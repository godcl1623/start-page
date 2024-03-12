import { ChangeEvent, FormEvent, memo, useRef, useState } from "react";

import { extractFormValues } from "components/search/utils/helpers";

import FilterByTextView from "./FilterByTextView";

interface Props {
    setTextFilter: (target: string, value: string) => void;
    customStyle?: string;
}

type SearchOptions = {
    [key in string]: string;
};

export const SEARCH_OPTIONS: SearchOptions = {
    제목: "title",
    본문: "description",
};

export default memo(function FilterByText({ setTextFilter, customStyle }: Props) {
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
    const inputElement = useRef<HTMLInputElement>(null);
    const searchOptions = Object.keys(SEARCH_OPTIONS);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [searchOptionKey, inputValue] = extractFormValues(event);
        if (inputValue.length > 0 && inputValue.length < 2) {
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
        }
    };

    const clearInput = () => {
        if (inputElement.current) {
            inputElement.current.value = "";
        }
        setIsInputFilled(false);
        // Object.values(SEARCH_OPTIONS).forEach((value: string) =>
        //     setTextFilter(value, "")
        // );
        setTextFilter('title', '')
    };

    return (
        <FilterByTextView
            searchOptions={searchOptions}
            checkIfInputFilled={checkIfInputFilled}
            clearInput={clearInput}
            handleSubmit={handleSubmit}
            isInputFilled={isInputFilled}
            customStyle={customStyle}
            ref={inputElement}
        />
    );
});
