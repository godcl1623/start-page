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
    const [isInputFilled, setIsInputFilled] = React.useState<boolean>(false);
    const inputElement = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [searchOptionKey, inputValue] = extractFormValues(event);
        if (inputValue.length < 2) {
            alert("검색어는 두 글자 이상 입력해주세요.");
            return;
        }
        setTextFilter(SEARCH_OPTIONS[searchOptionKey], inputValue);
    };

    const checkIfInputFilled = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            className="relative flex w-full h-full mr-3 shadow-md text-xs dark:shadow-zinc-600 md:w-80"
            onSubmit={handleSubmit}
        >
            <SelectBox
                optionValues={SEARCH_OPTIONS}
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
}
