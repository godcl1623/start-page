import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./root/providers";
import "tailwindcss/tailwind.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/setting";
import { cookies } from "next/headers";

// TODO: use next-auth session on server components
export default async function RootLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const theme = cookies().get("theme");
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
        <html lang="ko" className={theme?.value === "dark" ? "dark" : ""}>
            <body>
                <main>
                    <Providers session={session}>{children}</Providers>
                </main>
                <div id="modal_root" />
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Start Page",
};
