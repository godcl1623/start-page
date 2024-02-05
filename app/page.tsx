import MainPage, { ParsedFeedsDataType } from "./main";
import { authOptions } from "./api/auth/[...nextauth]/setting";
import { getServerSession } from "next-auth";
import { encryptCookie, getNewUserId } from "controllers/utils";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import RequestControllers from "controllers/requestControllers";

interface LoginInfo {
    user: UserInfo;
}

interface UserInfo {
    name: string;
    email: string;
    image: string;
}

export default async function Main() {
    const { getDataFrom } = new RequestControllers();
    let userId: string = "";

    try {
        const loginInfo: LoginInfo | null = await getServerSession(authOptions);

        if (loginInfo != null) {
            userId = encryptCookie({ userId: loginInfo.user.email });
            const feedsResponse = await getDataFrom<string>(
                `/feeds?userId=${userId}`
            );
            const sourcesResponse = await getDataFrom<string>(
                `/sources?userId=${userId}`
            );

            return (
                <MainPage
                    feeds={feedsResponse}
                    sources={sourcesResponse}
                    userId={userId}
                    isLocal={loginInfo === null}
                />
            );
        } else {
            return (
                <MainPage
                    feeds={""}
                    sources={""}
                    userId={userId}
                    isLocal={loginInfo === null}
                />
            );
        }
    } catch (error) {
        console.error(error);
        // TODO: Error 페이지로 수정
        return (
            <MainPage
                feeds={""}
                sources={""}
                userId={userId}
                isLocal
            />
        );
    }
}
