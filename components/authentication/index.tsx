import { useMemo, useState } from "react";
import AuthenticationLayout from "./Layout";
import LoginView from "./LoginView";
import PasswordResetView from "./PasswordResetView";
import RegisterView from "./RegisterView";
import useChangeModalView from './hooks/useChangeModalView';

interface Props {
    closeModal: () => void;
}

export type ViewState = "login" | "register" | "reset";

export default function Authentication({ closeModal }: Props) {
    const [currentView, changeViewTo] = useChangeModalView<ViewState>("login");

    const viewComponent = useMemo(() => {
        switch (currentView) {
            case "login":
                return <LoginView changeViewTo={changeViewTo} />;
            case "register":
                return <RegisterView closeModal={closeModal} />;
            case "reset":
                return <PasswordResetView closeModal={closeModal} />;
            default:
                return <h1>Error</h1>;
        }
    }, [currentView]);

    return (
        <AuthenticationLayout closeModal={closeModal}>
            {viewComponent}
        </AuthenticationLayout>
    );
}
