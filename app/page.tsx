import MainPage from "./main";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { encryptCookie, getNewUserId } from "controllers/utils";
import { cookies } from 'next/headers';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

interface LoginInfo {
    user: UserInfo;
}

interface UserInfo {
    name: string;
    email: string;
    image: string;
}

export default async function Main() {
    try {
        const loginInfo: LoginInfo | null = await getServerSession(authOptions);
        let userId: string = "";
        let isNewUser = false;

        if (loginInfo != null) {
            userId = encryptCookie({ userId: loginInfo.user.email });
        } else if (cookies().get('mw') != null) {
            userId = (cookies().get('mw') as RequestCookie).value;
        } else {
            const newUserId = getNewUserId();
            userId = encryptCookie({ userId: newUserId });
            isNewUser = true;
        }
        // const feedsResponse = await fetch(`http://localhost:3000/api/feeds?userId=${userId}`);
        // const sourcesResponse = await fetch(`http://localhost:3000/api/sources?userId=${userId}`);

        return <MainPage feeds={""} sources={""} userId={userId} isNewUser={isNewUser} />;
    } catch (error) {
        return error;
    }
}
