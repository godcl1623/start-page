import { ChangeEvent, FormEvent, forwardRef } from "react";
import SelectDiv from "components/common/SelectDiv";
import Button from "components/common/Button";

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
                className="relative flex w-full my-2 h-full rounded-md shadow-md text-xs dark:shadow-zinc-600 md:mx-2 md:my-0"
                onSubmit={handleSubmit}
            >
                <SelectDiv
                    optionValues={searchOptions}
                    customStyles="w-20 h-full rounded-l-md bg-white"
                />
                <input
                    ref={ref}
                    className="w-full h-full px-3 text-neutral-400"
                    onChange={checkIfInputFilled}
                />
                {isInputFilled && (
                    <Button
                        type="button"
                        customStyle="absolute right-14 w-5 h-full shadow-none bg-transparent text-neutral-400 dark:bg-transparent"
                        clickHandler={clearInput}
                    >
                        ✕
                    </Button>
                )}
                <Button
                    type="submit"
                    customStyle="w-12 rounded-r-md bg-sky-400 font-bold text-neutral-100 dark:bg-sky-600 dark:text-gray-300 shadow-none rounded-l-none"
                >
                    검색
                </Button>
            </form>
        );
    }
);
FilterByTextView.displayName = "FilterByTextView";

export default FilterByTextView;
