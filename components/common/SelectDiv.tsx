import useOutsideClickClose from "hooks/useOutsideClickClose";
import { nanoid } from "nanoid";
import { MouseEvent, memo, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

interface Props {
    optionValues: string[];
    customStyles?: string;
    filterBySort?: (stateString: string) => void;
    options?: {
        enableEdit?: boolean;
        editHandler?: () => void;
        changeHandler?: (event: MouseEvent<HTMLButtonElement>) => void;
    };
}

export default memo(function SelectDiv({
    optionValues,
    customStyles,
    filterBySort,
    options,
}: Props) {
    const [selectedValue, setSelectedValue] = useState(optionValues[0]);
    const [shouldOpenList, setShouldOpenList] = useState(false);
    const uListRef = useRef<HTMLUListElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const toggleList = () => {
        setShouldOpenList(!shouldOpenList);
    };

    const handleSelectedButton = (event: MouseEvent<HTMLButtonElement>) => {
        if (options != null && options.changeHandler) {
            options.changeHandler(event);
        }
        toggleList();
    }

    const handleOptionButton = (event: MouseEvent<HTMLButtonElement>) => {
        setSelectedValue(event.currentTarget.value);
        if (filterBySort) {
            filterBySort(event.currentTarget.value);
        }
        toggleList();
    };

    const handleEditButton = () => {
        if (options != null && options.editHandler) {
            options.editHandler();
        }
        toggleList();
    };

    useOutsideClickClose({
        target: uListRef.current,
        toggleButton: toggleButtonRef.current,
        closeFunction: () => setShouldOpenList(false),
    });

    const selectOptions = Array.isArray(optionValues) ? (
        optionValues?.map((optionValue: string, index: number, arraySelf) => (
            <li
                key={`${optionValue}_${nanoid()}`}
                className={`${
                    index === 0
                        ? "rounded-t-md"
                        : index === arraySelf.length - 1
                        ? options != null && options.enableEdit
                            ? ""
                            : "rounded-b-md"
                        : ""
                } text-neutral-700 dark:text-gray-300 hover:bg-sky-400 hover:text-neutral-100 hover:dark:bg-sky-800`}
            >
                <button
                    className="flex justify-center w-full p-2"
                    type="button"
                    onClick={handleOptionButton}
                    value={optionValue}
                >
                    {selectedValue === optionValue ? (
                        <FaCheck className="mr-1" />
                    ) : (
                        <></>
                    )}
                    {optionValue}
                </button>
            </li>
        ))
    ) : (
        <></>
    );

    return (
        <div
            className={`relative flex-col justify-center items-center h-full px-2.5 text-gray-400 dark:focus:outline-sky-600 ${customStyles}`}
        >
            <button
                type="button"
                ref={toggleButtonRef}
                className="relative flex items-center w-full h-full min-h-8"
                onClick={handleSelectedButton}
                value={selectedValue}
            >
                {selectedValue}
                <IoIosArrowDown className="absolute right-0" />
            </button>
            {shouldOpenList ? (
                <ul
                    ref={uListRef}
                    className="absolute z-50 top-0 right-0 w-full min-w-[4rem] rounded-md shadow-lg bg-neutral-100 text-center text-xs dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                >
                    {selectOptions}
                    {options != null && options.enableEdit ? (
                        <li
                            className={`rounded-b-md text-neutral-700 dark:text-gray-300 hover:bg-sky-400 hover:text-neutral-100 hover:dark:bg-sky-800`}
                        >
                            <button
                                className="flex justify-center w-full p-2"
                                type="button"
                                onClick={handleEditButton}
                            >
                                편집
                            </button>
                        </li>
                    ) : (
                        <></>
                    )}
                </ul>
            ) : (
                <></>
            )}
        </div>
    );
});
