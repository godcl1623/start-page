import Button from "components/common/Button";

interface Props {
    isUserSignedIn: boolean;
}

export default function LoginHandleButton({ isUserSignedIn }: Props) {
    const commonStyle = "w-24 font-bold";
    const loginStyle =
        "bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300";
    const logoutStyle = "bg-red-400 text-neutral-100 dark:bg-red-700";
    return (
        <Button
            type="button"
            customStyle={`${commonStyle} ${
                isUserSignedIn ? logoutStyle : loginStyle
            }`}
        >
            {isUserSignedIn ? "Logout" : "Login"}
        </Button>
    );
}
