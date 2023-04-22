import { useMemo, useState } from "react";
import AuthenticationLayout from "./Layout";
import LoginView from "./LoginView";
import PasswordResetView from "./PasswordResetView";
import RegisterView from "./RegisterView";

interface Props {
    closeModal: () => void;
}

export type ViewState = "login" | "register" | "reset";

export default function Authentication({ closeModal }: Props) {
    const [currentView, setCurrentView] = useState<ViewState>("login");
    const changeViewTo = (value: ViewState) => () => {
        setCurrentView(value);
    };

    const viewComponent = useMemo(() => {
        switch (currentView) {
            case "login":
                return <LoginView changeViewTo={changeViewTo} />;
            case "register":
                return <RegisterView />;
            case "reset":
                return <PasswordResetView />;
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
