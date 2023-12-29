import MainPage from "./main";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { encryptCookie, getNewUserId } from "controllers/utils";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import NewRequestControllers from "controllers/newRequestControllers";

interface LoginInfo {
    user: UserInfo;
}

interface UserInfo {
    name: string;
    email: string;
    image: string;
}

export default async function Main() {
    const { getDataFrom } = new NewRequestControllers();
    let userId: string = "";
    let isNewUser = false;
    try {
        const loginInfo: LoginInfo | null = await getServerSession(authOptions);

        if (loginInfo != null) {
            userId = encryptCookie({ userId: loginInfo.user.email });
        } else if (cookies().get("mw") != null) {
            userId = (cookies().get("mw") as RequestCookie).value;
        } else {
            const newUserId = getNewUserId();
            userId = encryptCookie({ userId: newUserId });
            isNewUser = true;
        }

        const feedsResponse = await getDataFrom(`/feeds?userId=${userId}`);
        const sourcesResponse = await getDataFrom(`/sources?userId=${userId}`);

        return (
            <MainPage
                feeds={feedsResponse}
                sources={sourcesResponse}
                userId={userId}
                isNewUser={isNewUser}
            />
        );
    } catch (error) {
        console.error(error);
        return (
            <MainPage
                feeds={""}
                sources={""}
                userId={userId}
                isNewUser={isNewUser}
            />
        );
    }
}
