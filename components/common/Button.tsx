import { ReactNode, memo } from "react";

interface Props {
    customStyle?: string;
    type: "button" | "submit" | "reset" | undefined;
    clickHandler?: () => void;
    children: string | ReactNode;
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
            className={`px-3 py-2 rounded-md shadow-md dark:shadow-zinc-600 whitespace-pre ${customStyle}`}
            onClick={clickHandler}
        >
            {children}
        </button>
    );
});
