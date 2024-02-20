import useOutsideClickClose from "hooks/useOutsideClickClose";
import { nanoid } from "nanoid";
import { ChangeEvent, MouseEvent, memo, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

interface Props {
    optionValues: string[];
    customStyles?: string;
    setSortState?: (stateString: string) => void;
    options?: {
        enableEdit?: boolean;
        editHandler?: () => void;
    };
}

export default memo(function SelectDiv({
    optionValues,
    customStyles,
    setSortState,
    options,
}: Props) {
    const [selectedValue, setSelectedValue] = useState(optionValues[0]);
    const [shouldOpenList, setShouldOpenList] = useState(false);
    const uListRef = useRef<HTMLUListElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const toggleList = () => {
        setShouldOpenList(!shouldOpenList);
    };

    const handleOptionButton = (event: MouseEvent<HTMLButtonElement>) => {
        setSelectedValue(event.currentTarget.value);
        if (setSortState) {
            setSortState(event.currentTarget.value);
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
        optionValues?.map((optionValue: string, index: number) => (
            <li
                key={`${optionValue}_${nanoid()}`}
                className={`${
                    index === 0 ? "rounded-t-md" : ""
                } text-neutral-100 dark:text-gray-300 hover:bg-sky-400 hover:dark:bg-sky-800`}
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
            className={`relative flex-col justify-center items-center h-full px-3 text-gray-400 dark:focus:outline-sky-600 ${customStyles}`}
        >
            <button
                type="button"
                ref={toggleButtonRef}
                className="flex items-center w-full h-full"
                onClick={toggleList}
                value={selectedValue}
            >
                {selectedValue}
                <IoIosArrowDown className="absolute right-0" />
            </button>
            {shouldOpenList ? (
                <ul
                    ref={uListRef}
                    className="absolute z-50 top-0 right-0 w-full min-w-[4rem] rounded-md shadow-md bg-neutral-100 text-center text-xs dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                >
                    {selectOptions}
                    {options != null && options.enableEdit ? (
                        <li
                            className={`rounded-b-md text-neutral-100 dark:text-gray-300 hover:bg-sky-400 hover:dark:bg-sky-800`}
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
