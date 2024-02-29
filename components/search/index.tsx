import { ChangeEvent, FormEvent, memo, useState } from "react";

import { extractFormValues, openSearchResult } from "./utils/helpers";
import useHandleInputFill from "./hooks/useHandleInputFill";

import SelectDiv from "components/common/SelectDiv";
import { SearchEnginesData } from "controllers/searchEngines";
import Button from "components/common/Button";

interface Props {
    searchEnginesList: SearchEnginesData[];
    handleModal: () => void;
}

export default memo(function Search({ searchEnginesList, handleModal }: Props) {
    const [inputValue, setInputValue] = useState<string>("");
    const isInputFilled = useHandleInputFill(inputValue);
    const namesList = searchEnginesList.map((engineData) => engineData.name);
    const getCorrespondingUrl = (searchEngineName: string) => {
        const correspondingData = searchEnginesList.find(
            (engineData) => engineData.name === searchEngineName
        );
        return correspondingData != null ? correspondingData.url : null;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [selectedSearchEngine, inputValue] = extractFormValues(event);
        const correspondingUrl = getCorrespondingUrl(selectedSearchEngine);
        openSearchResult(correspondingUrl, inputValue);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value);
    };

    const clearInput = () => {
        setInputValue("");
    };

    return (
        <form
            className="relative flex flex-col w-full h-max rounded-md shadow-lg dark:shadow-zinc-600 xs:flex-row xs:h-8 sm:h-10 md:h-12"
            onSubmit={handleSubmit}
        >
            <SelectDiv
                optionValues={namesList}
                customStyles="w-full h-max rounded-t-md bg-neutral-50 text-xs xs:w-24 xs:h-full xs:rounded-l-md xs:rounded-r-none xs:px-2.5 xs:py-0 sm:w-24 sm:text-sm"
                options={{
                    enableEdit: true,
                    editHandler: handleModal,
                }}
            />
            <input
                name="searchInput"
                type="text"
                placeholder="검색어를 입력해주세요"
                className="w-full h-3 p-4 bg-neutral-50 text-sm text-neutral-400 dark:focus:outline-sky-600 xs:w-[calc(100%-8rem)] xs:h-full sm:w-[calc(100%-12rem)] sm:text-base placeholder:text-xs placeholder:md:text-sm"
                value={inputValue}
                onChange={handleChange}
            />
            {isInputFilled && (
                <Button
                    type="button"
                    customStyle="absolute top-8 right-0 w-10 h-8 shadow-none bg-transparent text-xs text-neutral-400 dark:bg-transparent xs:top-0 xs:right-20 xs:h-full sm:right-24 sm:text-sm"
                    clickHandler={clearInput}
                >
                    ✕
                </Button>
            )}
            <Button
                type="submit"
                customStyle="w-full h-full rounded-b-md rounded-t-none bg-sky-400 font-bold text-xs  text-neutral-100 dark:bg-sky-600 dark:text-gray-300 cursor-pointer shadow-none xs:w-20 xs:rounded-l-none xs:rounded-r-md sm:w-24 sm:text-sm"
            >
                검색
            </Button>
        </form>
    );
});
