import { ChangeEvent, FormEvent, memo, useEffect, useState } from "react";

import { SEARCH_ADDRESS_BY_ENGINE } from "./utils/constants";

import { extractFormValues, openSearchResult } from "./utils/helpers";

import SelectBox from "../common/SelectBox";

export default memo(function Search() {
    const [inputValue, setInputValue] = useState<string>("");
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
    const searchEngines = Object.keys(SEARCH_ADDRESS_BY_ENGINE);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [selectedSearchEngine, inputValue] = extractFormValues(event);
        openSearchResult(selectedSearchEngine, inputValue);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value);
    };

    const clearInput = () => {
        setInputValue("");
    };

    useEffect(() => {
        if (inputValue.length > 0) setIsInputFilled(true);
        else setIsInputFilled(false);
    }, [inputValue]);

    return (
        <form
            className="relative flex-center w-full h-12 shadow-lg dark:shadow-zinc-600"
            onSubmit={handleSubmit}
        >
            <SelectBox
                optionValues={searchEngines}
                customStyles="rounded-l-md"
            />
            <input
                name="searchInput"
                type="text"
                placeholder="검색어를 입력해주세요"
                className="w-[calc(100%-6rem)] h-full p-4 text-neutral-700 dark:focus:outline-sky-600 dark:text-neutral-200"
                value={inputValue}
                onChange={handleChange}
            />
            {isInputFilled && (
                <button
                    type="button"
                    className="absolute right-24 w-10 h-full"
                    onClick={clearInput}
                >
                    ✕
                </button>
            )}
            <input
                name="submit"
                type="submit"
                value="검색"
                className="w-24 h-full rounded-r-md bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300 cursor-pointer"
            />
        </form>
    );
})
