import React from "react";
import {
    extractInputValue,
    checkIfStringPassesRule,
} from "./utils/helpers";
import axios from "axios";
import RequestControllers from 'controllers';
import { useRouter } from 'next/router';

export default function SubscribeNew() {
    const router = useRouter();
    const { getDataFrom, postDataTo } = new RequestControllers();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const input = event.currentTarget["0"];
        const url = extractInputValue(input);
        if (url != null) {
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
            } else if (typeof urlCheckResult === 'string') {
                const documentHeadString = urlCheckResult.substring(0, 5);
                if (documentHeadString !== '<?xml') {
                    alert("유효하지 않은 주소입니다.");
                    return;
                }
            }
            const parser = new DOMParser();
            const xml = parser.parseFromString(urlCheckResult, 'text/xml');
            const feedOriginTitle = xml.querySelector('title')?.textContent;

            try {
                const { data } = await getDataFrom('/sources');
                const { sources } = JSON.parse(data);
                const id = sources.length;
                const postResult = await postDataTo('/sources', {
                    id,
                    name: feedOriginTitle,
                    url,
                });
                if (postResult != null && postResult.status === 201) {
                    window.alert('저장되었습니다.');
                    router.reload();
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.status === 409) {
                        alert('이미 등록된 URL입니다.');
                        return Promise.reject(error);
                    }
                }
            }
        } else {
            alert("URL을 입력해주세요.");
        }
    };

    return (
        <section className="w-full h-full">
            <form
                className="flex flex-col justify-center items-center w-full h-full"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="feed_address"
                    placeholder="새 피드 주소를 입력해주세요."
                    className="w-full mt-8 mb-4 rounded-md shadow-lg py-2 px-4 text-neutral-700 dark:shadow-zinc-600 dark:focus:outline-sky-600 dark:text-neutral-200"
                />
                <button
                    type="submit"
                    className="w-20 rounded-md p-1 bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
                >
                    추가
                </button>
            </form>
        </section>
    );
}
