interface Props {
    customStyle?: string;
    type: "button" | "submit" | "reset" | undefined;
    clickHandler?: () => void;
    children: string;
}

export default function Button({
    customStyle,
    children,
    type,
    clickHandler,
}: Props) {
    return (
        <button
            type={type}
            className={`w-full px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 md:w-auto ${customStyle}`}
            onClick={clickHandler}
        >
            {children}
        </button>
    );
}
