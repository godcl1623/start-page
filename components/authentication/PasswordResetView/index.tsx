import CheckUserInfo from "./CheckUserInfo";
import useChangeModalView from "../hooks/useChangeModalView";
import { useMemo } from "react";
import AuthenticateEmail from "./AuthenticateEmail";
import EmailAuthenticated from "./EmailAuthenticated";

interface Props {
    closeModal: () => void;
}

export type PasswordResetViewState =
    | "checkUserInfo"
    | "authentcateEmail"
    | "emailAuthenticated";

export default function PasswordResetView({ closeModal }: Props) {
    const [currentView, changeViewTo] =
        useChangeModalView<PasswordResetViewState>("checkUserInfo");

    const viewComponent = useMemo(() => {
        switch (currentView) {
            case "checkUserInfo":
                return (
                    <CheckUserInfo
                        closeModal={closeModal}
                        changeViewTo={changeViewTo("authentcateEmail")}
                    />
                );
            case "authentcateEmail":
                return (
                    <AuthenticateEmail
                        closeModal={closeModal}
                        changeViewTo={changeViewTo("emailAuthenticated")}
                    />
                );
            case "emailAuthenticated":
                return <EmailAuthenticated closeModal={closeModal} />;
            default:
                return <h1>Error</h1>;
        }
    }, [currentView]);

    return <>{viewComponent}</>;
}
