interface Props {
    userEmail: string | undefined;
    handleDataHandler?: () => void;
}

export default function UserInfo({ userEmail, handleDataHandler }: Props) {
    return (
        <button
            type="button"
            onClick={() => {
                if (handleDataHandler != null) handleDataHandler();
            }}
        >
            {userEmail != null ? userEmail : "Guest"}
        </button>
    );
}
