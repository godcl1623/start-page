import {
    ChangeEvent,
    FormEvent,
    MouseEvent,
    memo,
    useCallback,
    useRef,
    useState,
} from "react";

import { extractFormValues } from "components/search/utils/helpers";

import FilterByTextView from "./FilterByTextView";
import { FilterType } from "hooks/useFilters";
import SelectDiv from "components/common/SelectDiv";

interface Props {
    setTextFilter: (target: string, value: string) => void;
    customStyle?: string;
    searchTexts: FilterType<string>;
}

type SearchOptions = {
    [key in string]: string;
};

export const SEARCH_OPTIONS: SearchOptions = {
    제목: "title",
    본문: "description",
};

export default memo(function FilterByText({
    setTextFilter,
    customStyle,
    searchTexts,
}: Props) {
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
    const inputElement = useRef<HTMLInputElement>(null);
    const searchOptions = Object.keys(SEARCH_OPTIONS);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const [searchOptionKey, inputValue] = extractFormValues(event);
            if (inputValue.length > 0 && inputValue.length < 2) {
                alert("검색어는 두 글자 이상 입력해주세요.");
                return;
            }
            setTextFilter(SEARCH_OPTIONS[searchOptionKey], inputValue);
        },
        [setTextFilter]
    );

    const checkIfInputFilled = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (event.currentTarget.value.length > 0) {
                setIsInputFilled(true);
            } else {
                setIsInputFilled(false);
            }
        },
        []
    );

    const clearInput = useCallback(() => {
        if (inputElement.current) {
            inputElement.current.value = "";
        }
        setIsInputFilled(false);
        Object.entries(searchTexts)
            .filter(([_, value]) => value !== "")
            .forEach(([searchOption]) => setTextFilter(searchOption, ""));
    }, [searchTexts, setTextFilter]);

    const initializeFilter = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const selectedOption = event.currentTarget.value;
            setTextFilter(SEARCH_OPTIONS[selectedOption], "");
        },
        [setTextFilter]
    );

    const filterEnabledSelectBox = (
        <SelectDiv
            optionValues={searchOptions}
            customStyles="w-20 h-full rounded-l-md bg-neutral-50"
            options={{
                changeHandler: initializeFilter,
            }}
        />
    );

    return (
        <FilterByTextView
            checkIfInputFilled={checkIfInputFilled}
            clearInput={clearInput}
            handleSubmit={handleSubmit}
            isInputFilled={isInputFilled}
            customStyle={customStyle}
            ref={inputElement}
            selectBox={filterEnabledSelectBox}
        />
    );
});
