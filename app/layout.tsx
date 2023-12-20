import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./root/providers";
import "tailwindcss/tailwind.css";

// TODO: use next-auth session on server components
export default function RootLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    return (
        <html lang="ko">
            <body>
                <main>
                    <Providers>{children}</Providers>
                </main>
                <div id="modal_root" />
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Start Page",
};
