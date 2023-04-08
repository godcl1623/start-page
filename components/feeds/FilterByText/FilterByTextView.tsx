import { ChangeEvent, FormEvent, forwardRef } from "react";
import SelectBox from "components/common/SelectBox";

interface Props {
    searchOptions: string[];
    isInputFilled: boolean;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    checkIfInputFilled: (event: ChangeEvent<HTMLInputElement>) => void;
    clearInput: () => void;
}

const FilterByTextView = forwardRef<HTMLInputElement, Props>(
    (
        {
            handleSubmit,
            searchOptions,
            checkIfInputFilled,
            isInputFilled,
            clearInput,
        }: Props,
        ref
    ) => {
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
                    ref={ref}
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
);
FilterByTextView.displayName = "FilterByTextView";

export default FilterByTextView;
