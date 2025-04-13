import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./root/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/setting";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "app/globals.css";

const pretendard = localFont({
    src: [
        {
            path: "../public/fonts/Pretendard-Bold.subset.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/Pretendard-Bold.subset.woff",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/Pretendard-Regular.subset.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/Pretendard-Regular.subset.woff",
            weight: "400",
            style: "normal",
        },
    ],
    display: "swap",
    preload: true,
    variable: "--font-pretendard",
});

// TODO: use next-auth session on server components
export default async function RootLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const theme = (await cookies()).get("theme")?.value ?? "";
    const setInitialTheme = `(function () {
        const theme = document.cookie.split('; ').find((cookie) => cookie.includes('theme'));
        if (theme == null) {
            if (matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    })()`;

    return (
        <html
            lang="ko"
            className={`${theme !== "" ? theme + " " : theme}${
                pretendard.variable
            } font-sans`}
        >
            <body className="bg-stone-200 dark:bg-neutral-800">
                <Providers session={session}>{children}</Providers>
                <div id="modal_root" />
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Start Page",
};
