import { ChangeEvent, memo } from "react";

import { SORT_STANDARD } from "common/constants";

interface Props {
    optionValues: string[];
    customStyles?: string;
    setSortState?: (stateString: string) => void;
}

export default memo(function SelectBox({
    optionValues,
    customStyles,
    setSortState,
}: Props) {
    const options = Array.isArray(optionValues) ? (
        optionValues?.map((optionValue: string, index: number) => (
            <option key={`${optionValue}_${index}`}>{optionValue}</option>
        ))
    ) : (
        <></>
    );

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (setSortState) setSortState(event.currentTarget.value);
    };

    return (
        <select
            name="searchEngines"
            className={`h-full px-2 text-gray-400 dark:focus:outline-sky-600 ${customStyles}`}
            onChange={handleChange}
        >
            {options}
        </select>
    );
})
