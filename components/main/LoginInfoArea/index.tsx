import { useSession, signOut } from "next-auth/react";
import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import { ModalKeys } from "..";
import Button from "components/common/Button";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
}

export default function LoginInfoArea({ handleAuthenticationModal }: Props) {
    const { data: session } = useSession();

    return (
        <section className="flex flex-col items-end gap-4 w-full md:flex-row md:gap-8 md:items-center md:justify-end">
            <UserInfo
                userEmail={
                    session != null &&
                    session.user != null &&
                    session.user.email != null
                        ? session.user.email
                        : undefined
                }
            />
            {session != null ? (
                <Button
                    type="button"
                    clickHandler={() => signOut()}
                    customStyle="w-32 bg-red-500 text-base text-neutral-100  dark:bg-red-700 dark:text-gray-300"
                >
                    Logout
                </Button>
            ) : (
                <LoginHandleButton
                    isUserSignedIn={false}
                    handleAuthenticationModal={handleAuthenticationModal}
                />
            )}
        </section>
    );
}
