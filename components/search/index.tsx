import { ChangeEvent, FormEvent, memo, useState } from "react";

import { extractFormValues, openSearchResult } from "./utils/helpers";
import useHandleInputFill from "./hooks/useHandleInputFill";

import SelectDiv from "components/common/SelectDiv";
import { SearchEnginesData } from "controllers/searchEngines";

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
            className="relative flex w-full h-12 rounded-md shadow-lg dark:shadow-zinc-600"
            onSubmit={handleSubmit}
        >
            <SelectDiv
                optionValues={namesList}
                customStyles="w-24 rounded-l-md bg-white"
                options={{
                    enableEdit: true,
                    editHandler: handleModal,
                }}
            />
            <input
                name="searchInput"
                type="text"
                placeholder="검색어를 입력해주세요"
                className="w-[calc(100%-12rem)] h-full p-4 text-neutral-400 dark:focus:outline-sky-600"
                value={inputValue}
                onChange={handleChange}
            />
            {isInputFilled && (
                <button
                    type="button"
                    className="absolute right-24 w-10 h-full text-neutral-400"
                    onClick={clearInput}
                >
                    ✕
                </button>
            )}
            <button
                name="submit"
                type="submit"
                className="w-24 h-full rounded-r-md bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300 cursor-pointer"
            >
                검색
            </button>
        </form>
    );
});
