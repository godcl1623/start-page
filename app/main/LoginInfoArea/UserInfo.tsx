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
            onClick={() => {
                if (handleDataHandler != null) handleDataHandler();
            }}
        >
            {userEmail ?? "Guest"}
        </button>
    );
});
