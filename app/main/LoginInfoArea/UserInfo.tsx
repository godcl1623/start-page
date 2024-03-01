import { forwardRef } from "react";

interface Props {
    userEmail: string | null | undefined;
    handleDataHandler?: () => void;
}

export default forwardRef<HTMLButtonElement, Props>(function UserInfo(
    { userEmail, handleDataHandler }: Props,
    ref
) {
    return (
        <button
            type="button"
            ref={ref}
            className="px-3 py-2 rounded-md rounded-r-none shadow-md bg-neutral-500 font-bold text-sm text-neutral-100 dark:shadow-zinc-600 whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={() => {
                if (handleDataHandler != null) handleDataHandler();
            }}
        >
            {userEmail ?? "Guest"}
        </button>
    );
});
