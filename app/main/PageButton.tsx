import Button from "components/common/Button";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    customStyle?: string;
    clickHandler: () => void;
}

export default function PageButton({
    children,
    customStyle,
    clickHandler,
}: Props) {
    return (
        <Button
            type="button"
            customStyle={`flex justify-center items-center rounded-full shadow-md w-10 h-10 bg-neutral-100 dark:shadow-zinc-500 dark:bg-neutral-700 ${customStyle}`}
            clickHandler={clickHandler}
        >
            {children}
        </Button>
    );
}
