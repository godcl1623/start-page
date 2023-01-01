import SelectBox from "components/common/SelectBox";
import React from "react";

const SEARCH_OPTIONS = {
    제목: "title",
    본문: "body",
};

export default function FilterByText() {
    return (
        <form className="flex w-72 h-full mr-3 shadow-md text-xs dark:shadow-zinc-600">
            <SelectBox
                optionValues={SEARCH_OPTIONS}
                customStyles="h-full rounded-l-md"
            />
            <input className="w-full h-full" />
            <button
                type="submit"
                className="w-12 rounded-r-md bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
            >
                검색
            </button>
        </form>
    );
}
