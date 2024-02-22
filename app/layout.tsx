import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./root/providers";
import "tailwindcss/tailwind.css";
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/setting';

// TODO: use next-auth session on server components
export default async function RootLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ko">
            <body>
                <main>
                    <Providers session={session}>{children}</Providers>
                </main>
                <div id="modal_root" />
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Start Page",
};
