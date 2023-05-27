import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";

const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENTID ?? "",
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
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
    debug: false,
    jwt: {
        maxAge: 60 * 60 * 24,
    },
};

export default NextAuth(options);
