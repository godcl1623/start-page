import useResizeEvent from "hooks/useResizeEvent";
import { forwardRef, useCallback, useEffect, useState } from "react";

interface Props {
    userEmail: string | null | undefined;
    handleDataHandler?: () => void;
}

export default forwardRef<HTMLButtonElement, Props>(function UserInfo(
    { userEmail, handleDataHandler }: Props,
    ref
) {
    const [signedInUser, setSignedInUser] = useState(userEmail);

    const adjustUserIdOnResize = useCallback(() => {
        if (userEmail != null) {
            if (document.documentElement.offsetWidth < 360) {
                setSignedInUser(userEmail.slice(0, 8) + "...");
            } else if (
                document.documentElement.offsetWidth >= 360 &&
                document.documentElement.offsetWidth < 768
            ) {
                setSignedInUser(userEmail.slice(0, 18) + "...");
            } else {
                setSignedInUser(userEmail);
            }
        }
    }, [userEmail]);

    useResizeEvent(adjustUserIdOnResize, true, [adjustUserIdOnResize]);

    return (
        <button
            type="button"
            ref={ref}
            className="px-3 py-2 rounded-md rounded-r-none shadow-md bg-neutral-500 font-bold text-sm text-neutral-100 dark:shadow-zinc-600 whitespace-pre"
            onClick={() => {
                if (handleDataHandler != null) handleDataHandler();
            }}
        >
            {signedInUser ?? "Guest"}
        </button>
    );
});
