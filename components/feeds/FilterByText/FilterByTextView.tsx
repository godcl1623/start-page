import { ChangeEvent, FormEvent, ReactNode, forwardRef } from "react";
import Button from "components/common/Button";

interface Props {
    isInputFilled: boolean;
    customStyle?: string;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    checkIfInputFilled: (event: ChangeEvent<HTMLInputElement>) => void;
    clearInput: () => void;
    selectBox: ReactNode;
}

const FilterByTextView = forwardRef<HTMLInputElement, Props>(
    (
        {
            handleSubmit,
            checkIfInputFilled,
            isInputFilled,
            clearInput,
            customStyle,
            selectBox,
        }: Props,
        ref
    ) => {
        return (
            <form
                className={`relative flex w-full my-2 h-full max-h-8 rounded-md shadow-md text-xs dark:shadow-zinc-600 md:mx-2 md:my-0 ${customStyle}`}
                onSubmit={handleSubmit}
            >
                {selectBox}
                <input
                    ref={ref}
                    className="w-full h-full px-3 rounded-none bg-neutral-50 text-neutral-400"
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
                    customStyle="w-12 rounded-r-md bg-sky-400 font-bold text-xs text-neutral-100 dark:bg-sky-600 dark:text-gray-300 shadow-none rounded-l-none"
                >
                    검색
                </Button>
            </form>
        );
    }
);
FilterByTextView.displayName = "FilterByTextView";

export default FilterByTextView;
