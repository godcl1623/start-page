import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./root/providers";
import "tailwindcss/tailwind.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/setting";
import { cookies } from "next/headers";
import { calculateSunsetSunrise } from 'common/helpers';

// TODO: use next-auth session on server components
export default async function RootLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const theme = cookies().get("theme");
    const { isSunset, isSunrise } = await calculateSunsetSunrise();
    const darkmodeClass = theme?.value === 'dark' ? 'dark' : isSunset && !isSunrise ? 'dark' : '';

    return (
        <html lang="ko" className={`${darkmodeClass} sunset_${isSunset} sunrise_${isSunrise}`}>
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
