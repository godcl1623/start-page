import MainPage from "./main";
import RequestControllers from "controllers/requestControllers";
import { getUserId } from "../controllers/common";

export default async function Main() {
    const { getDataFrom } = new RequestControllers();
    let userId: string = "";

    try {
        userId = await getUserId();

        const feedsResponse =
            userId === "" || userId == null
                ? ""
                : await getDataFrom<string>(`/feeds?page=1`);
        const sourcesResponse =
            userId === "" || userId == null
                ? ""
                : await getDataFrom<string>(`/sources`);

        return (
            <MainPage
                feeds={feedsResponse}
                sources={sourcesResponse}
                userId={userId}
                isLocal={userId === ""}
            />
        );
    } catch (error) {
        console.error(error);
        // TODO: Error 페이지로 수정
        return <MainPage feeds={""} sources={""} userId={userId} isLocal/>;
    }
}
