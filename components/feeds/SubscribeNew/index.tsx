import { useRouter } from "next/router";
import axios from "axios";

import { extractInputValue, checkIfStringPassesRule } from "../utils/helpers";
import RequestControllers from "controllers";
import SubscriptionForm from './SubscriptionForm';

interface Props {
    userCookie: string;
}

export default function SubscribeNew({ userCookie }: Props) {
    const router = useRouter();
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

        const { data: urlCheckResult } = await axios.post(
            "/api/sources/check",
            { url }
        );
        if (urlCheckResult == null) {
            alert("유효하지 않은 주소입니다.");
            return;
        } else if (typeof urlCheckResult === "string") {
            const documentHeadString = urlCheckResult.substring(0, 5);
            if (documentHeadString !== "<?xml") {
                alert("유효하지 않은 주소입니다.");
                return;
            }
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(urlCheckResult, "text/xml");
        const feedOriginTitle = xml.querySelector("title")?.textContent;

        try {
            const { data } = await getDataFrom(`/sources?mw=${userCookie}`);
            const { sources } = JSON.parse(data);
            const id = sources.length;
            const postResult = await postDataTo(`/sources?mw=${userCookie}`, {
                id,
                name: feedOriginTitle,
                url,
            });
            if (postResult != null && postResult.status === 201) {
                window.alert("저장되었습니다.");
                router.reload();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    alert("이미 등록된 URL입니다.");
                    return Promise.reject(error);
                }
            }
        }
    };

    return <SubscriptionForm handleSubmit={handleSubmit} />;
}
