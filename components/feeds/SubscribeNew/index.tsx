import {
    extractInputValue,
    checkIfStringPassesRule,
    parseClientXml,
    makeClientFeedDataArray,
} from "../utils/helpers";
import RequestControllers from "controllers/requestControllers";
import SubscriptionForm from "./SubscriptionForm";
import { setCookie } from "cookies-next";
import { ParseResultType } from "app/main";

interface Props {
    userId: string;
}

interface CheckResult {
    result: boolean;
    data: string | null;
    rssUrl: string | null;
}

export default function SubscribeNew({ userId }: Readonly<Props>) {
    const { getDataFrom, postDataTo } = new RequestControllers();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const input = event.currentTarget["0"];
        const url = extractInputValue(input);
        if (url == null) {
            alert("URL을 입력해주세요.");
            return;
        }

        const ruleCheckResult = checkIfStringPassesRule(url);
        if (!ruleCheckResult) {
            alert("URL 형식을 확인해주세요.");
            return;
        }

        const {
            result: urlCheckResult,
            data: fetchData,
            rssUrl,
        } = await postDataTo<CheckResult>("/sources/check", { url });
        if (!urlCheckResult || fetchData == null || rssUrl == null) {
            alert("유효하지 않은 주소입니다.");
            return;
        }

        if (userId === "") {
            userId = (await getDataFrom<{ userCookie: string }>("/register"))
                .userCookie;
            setCookie("mw", userId, { maxAge: 60 * 60 * 24 * 30 });
        }

        const { feedOriginName, rssFeeds, feedOriginParsedLink } =
            parseClientXml(fetchData);
        const parsedFeedsArray = makeClientFeedDataArray(
            rssFeeds,
            feedOriginName,
            0
        );
        try {
            const getResult = await getDataFrom<string>(
                `/sources?userId=${userId}`
            );
            const sources = JSON.parse(getResult);
            const id = sources == null ? 0 : sources.length;
            const sourcePostResult = JSON.parse(
                await postDataTo<string>(`/sources?userId=${userId}`, {
                    id,
                    name: feedOriginName,
                    url: rssUrl,
                })
            );
            const newFeedData: ParseResultType = {
                id,
                originName: feedOriginName,
                originLink: feedOriginParsedLink,
                lastFeedsLength: parsedFeedsArray.length,
                latestFeedTitle: parsedFeedsArray[0]?.title,
                feeds: parsedFeedsArray,
            };

            switch (sourcePostResult.status) {
                case 201:
                    const newFeedPostResult = await postDataTo<string>(
                        `/feeds/new?userId=${userId}`,
                        newFeedData
                    );
                    if (newFeedPostResult === "success") {
                        alert("저장되었습니다.");
                        location.reload();
                    } else {
                        alert("오류가 발생했습니다.");
                    }
                    return;
                case 400:
                    alert("업데이트에 실패했습니다.");
                    return;
                case 409:
                    alert("이미 등록된 주소입니다.");
                    return;
                default:
                    alert("오류가 발생했습니다.");
                    return;
            }
        } catch (error) {
            alert("오류가 발생했습니다.");
            return Promise.reject(error);
        }
    };

    return <SubscriptionForm handleSubmit={handleSubmit} />;
}
