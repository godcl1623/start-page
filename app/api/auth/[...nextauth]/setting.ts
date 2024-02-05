import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export interface CustomSession extends Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        access_token?: string | null;
    };
}

export interface CustomSessionParams {
    session: CustomSession;
    token: JWT;
    user: AdapterUser;
}

interface NewSessionParams {
    newSession: any;
    trigger: "update";
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENTID ?? "",
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    scope: [
                        "email",
                        "profile",
                        "https://www.googleapis.com/auth/drive.file",
                    ].join(" "),
                },
            },
        }),
        NaverProvider({
            clientId: process.env.NAVER_OAUTH_CLIENTID ?? "",
            clientSecret: process.env.NAVER_OAUTH_CLIENT_SECRET ?? "",
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_OAUTH_CLIENTID ?? "",
            clientSecret: process.env.KAKAO_OAUTH_CLIENT_SECRET ?? "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    debug: false,
    jwt: {
        maxAge: 60 * 60 * 24,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account?.access_token) {
                token.access_token = account?.access_token;
            }
            return token;
        },
        async session({
            session,
            token,
        }: CustomSessionParams & NewSessionParams) {
            if (
                session?.user &&
                token?.access_token &&
                typeof token.access_token === "string"
            ) {
                session.user.access_token = token.access_token;
            }
            return session;
        },
    },
};
