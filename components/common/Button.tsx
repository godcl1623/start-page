import { memo } from "react";

interface Props {
    customStyle?: string;
    type: "button" | "submit" | "reset" | undefined;
    clickHandler?: () => void;
    children: string;
}

export default memo(function Button({
    customStyle,
    children,
    type,
    clickHandler,
}: Props) {
    return (
        <button
            type={type}
            className={`px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs dark:shadow-zinc-600 dark:bg-neutral-700 whitespace-pre ${customStyle}`}
            onClick={clickHandler}
        >
            {children}
        </button>
    );
});
