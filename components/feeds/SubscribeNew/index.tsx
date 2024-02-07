import { extractInputValue, checkIfStringPassesRule } from "../utils/helpers";
import RequestControllers from "controllers/requestControllers";
import SubscriptionForm from "./SubscriptionForm";
import { parseCookie } from 'controllers/utils';
import { setCookie } from 'cookies-next';

interface Props {
    userId: string;
}

interface CheckResult {
    result: boolean;
    data: string | null;
}

export default function SubscribeNew({ userId }: Props) {
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

        const { result: urlCheckResult, data: fetchData } =
            await postDataTo<CheckResult>("/sources/check", { url });
        if (!urlCheckResult || fetchData == null) {
            alert("유효하지 않은 주소입니다.");
            return;
        }

        if (userId === '') {
            userId = (await getDataFrom<{ userCookie: string }>('/register')).userCookie
            setCookie('mw', userId, { maxAge: 60 * 60 * 24 * 30 });
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(fetchData, "text/xml");
        const feedOriginTitle = xml.querySelector("title")?.textContent;

        try {
            const getResult = await getDataFrom<string>(
                `/sources?userId=${userId}`
            );
            const sources = JSON.parse(getResult);
            const id = sources == null ? 0 : sources.length;
            const postResult = JSON.parse(
                await postDataTo<string>(`/sources?userId=${userId}`, {
                    id,
                    name: feedOriginTitle,
                    url,
                })
            );
            // TODO: 다른 오류 핸들링 방법 알아보기
            switch (postResult.status) {
                case 201:
                    alert("저장되었습니다.");
                    location.reload();
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
