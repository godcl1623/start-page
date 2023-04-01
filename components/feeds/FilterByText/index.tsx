import { ChangeEvent, FormEvent, memo, useRef, useState } from "react";

import { extractFormValues } from "components/search/utils/helpers";

import SelectBox from "components/common/SelectBox";

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

export default memo(function FilterByText({ setTextFilter }: Props) {
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
    const inputElement = useRef<HTMLInputElement>(null);
    const searchOptions = Object.keys(SEARCH_OPTIONS);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [searchOptionKey, inputValue] = extractFormValues(event);
        if (inputValue.length < 2) {
            alert("검색어는 두 글자 이상 입력해주세요.");
            return;
        }
        setTextFilter(SEARCH_OPTIONS[searchOptionKey], inputValue);
    };

    const checkIfInputFilled = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value.length > 0) {
            setIsInputFilled(true);
        } else {
            setIsInputFilled(false);
            setTextFilter(SEARCH_OPTIONS["제목"], "");
        }
    };

    const clearInput = () => {
        if (inputElement.current) {
            inputElement.current.value = "";
        }
        setIsInputFilled(false);
        Object.values(SEARCH_OPTIONS).forEach((value: string) =>
            setTextFilter(value, "")
        );
    };

    return (
        <form
            className="relative flex w-full my-2 h-full shadow-md text-xs dark:shadow-zinc-600 md:mx-2 md:my-0"
            onSubmit={handleSubmit}
        >
            <SelectBox
                optionValues={searchOptions}
                customStyles="h-full rounded-l-md"
            />
            <input
                ref={inputElement}
                className="w-full h-full px-3"
                onChange={checkIfInputFilled}
            />
            {isInputFilled && (
                <button
                    type="button"
                    className="absolute right-8 w-5 h-full"
                    onClick={clearInput}
                >
                    ✕
                </button>
            )}
            <button
                type="submit"
                className="w-12 rounded-r-md bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
            >
                검색
            </button>
        </form>
    );
})
