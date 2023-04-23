import Button from "components/common/Button";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    closeModal: () => void;
}

export default function AuthenticationLayout({ children, closeModal }: Props) {
    return (
        <article className="flex flex-col justify-center w-[90vw] min-h-[25rem] h-max rounded-md shadow-md p-8 bg-neutral-100 text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 md:w-[37.5rem]">
            <Button
                type="button"
                customStyle="absolute top-0 right-0 flex justify-center items-center w-10 h-10 shadow-none rounded-none bg-none text-lg"
                clickHandler={closeModal}
            >
                ✕
            </Button>
            {children}
        </article>
    );
}
