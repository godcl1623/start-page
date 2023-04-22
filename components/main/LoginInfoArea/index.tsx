import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import { ModalKeys } from "..";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
}

export default function LoginInfoArea({ handleAuthenticationModal }: Props) {
    return (
        <section className="flex flex-col items-end gap-4 w-full md:flex-row md:gap-8 md:items-center md:justify-end">
            <UserInfo userEmail={undefined} />
            <LoginHandleButton
                isUserSignedIn={false}
                handleAuthenticationModal={handleAuthenticationModal}
            />
        </section>
    );
}
