import { ReactNode, useCallback } from "react";
import { IoClose as CloseIcon } from "react-icons/io5";

interface Props {
    children: ReactNode;
    customStyle?: string;
    closeModal?: (value: boolean) => void;
}

export default function SubscriptionDialogBox({
    children,
    customStyle,
    closeModal,
}: Props) {
    const handleModal = useCallback(() => {
        if (closeModal) closeModal(false);
    }, [closeModal]);

    return (
        <article
            className={`w-96 min-h-48 h-max rounded-md shadow-lg px-6 py-4 bg-neutral-100 text-center text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 ${customStyle}`}
        >
            <CloseIcon
                className="absolute right-4 text-xl cursor-pointer"
                onClick={handleModal}
            />
            {children}
        </article>
    );
}
