import { FormEvent } from "react";

import { SEARCH_ADDRESS_BY_ENGINE } from "./constants";

export const extractFormValues = (event: FormEvent<HTMLFormElement>) => {
    const selectBox = event.currentTarget[0];
    const searchInput = event.currentTarget[1];
    let selectBoxValue = "";
    let inputValue = "";
    if (
        selectBox instanceof HTMLButtonElement ||
        selectBox instanceof HTMLInputElement
    )
        selectBoxValue = selectBox.value;
    if (searchInput instanceof HTMLInputElement) inputValue = searchInput.value;

    return [selectBoxValue, inputValue] as const;
};

export const openSearchResult = (
    selectedSearchEngineUrl: string | null,
    inputValue: string
) => {
    if (selectedSearchEngineUrl != null) {
        window.location.assign(`${selectedSearchEngineUrl}${inputValue}`);
    } else {
        throw new Error("Search address is not available");
    }
};
