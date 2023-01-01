import SelectBox from "components/common/SelectBox";
import React from "react";
import { extractFormValues } from "components/search/utils/helpers";

interface Props {
    setTextFilter: (target: string, value: string) => void;
}

type SearchOptions = {
    [key in string]: string;
};

export const SEARCH_OPTIONS: SearchOptions = {
    제목: "title",
    본문: "description",
};

export default function FilterByText({ setTextFilter }: Props) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [searchOptionKey, inputValue] = extractFormValues(event);
        const otherOption = searchOptionKey === '제목' ? '본문' : '제목';
        setTextFilter(SEARCH_OPTIONS[searchOptionKey], inputValue);
        setTextFilter(SEARCH_OPTIONS[otherOption], '');
    };
    return (
        <form
            className="flex w-72 h-full mr-3 shadow-md text-xs dark:shadow-zinc-600"
            onSubmit={handleSubmit}
        >
            <SelectBox
                optionValues={SEARCH_OPTIONS}
                customStyles="h-full rounded-l-md"
            />
            <input className="w-full h-full px-3" />
            <button
                type="submit"
                className="w-12 rounded-r-md bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
            >
                검색
            </button>
        </form>
    );
}
