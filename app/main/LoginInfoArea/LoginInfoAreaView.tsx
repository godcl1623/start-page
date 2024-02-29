import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Theme } from ".";
import Button from "components/common/Button";
import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import UserSettingMenu from "./UserSettingMenu";
import useOutsideClickClose from "hooks/useOutsideClickClose";
import useDetectSystemTheme from "hooks/useDetectSystemTheme";
import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import { signOut, useSession } from "next-auth/react";
import { ModalKeys } from "../MainView";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
    getTotalData: () => void;
    uploadUserData: (event: ChangeEvent<HTMLInputElement>) => void;
    handleUserData: () => void;
}

export default function LoginInfoAreaView({
    handleAuthenticationModal,
    getTotalData,
    uploadUserData,
    handleUserData,
}: Readonly<Props>) {
    const [modalState, setModalState] = useState(false);
    const [userMenu, setUserMenu] = useState<HTMLDivElement | null>(null);
    const [isSystemTheme, setIsSystemTheme] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { data: session } = useSession();
    const [isDark, setIsDark] = useDetectSystemTheme();
    useOutsideClickClose({
        target: userMenu,
        toggleButton: buttonRef.current,
        closeFunction: () => setModalState(false),
    });

    const updateUserMenu = (value: HTMLDivElement | null) => {
        setUserMenu(value);
    };

    const updateModalState = (value: boolean) => () => {
        setModalState(value);
    };

    const handleTheme = (value: Theme) => () => {
        const root = document.documentElement;
        switch (value) {
            case "light":
                setIsDark(false);
                setIsSystemTheme(false);
                root.classList.remove("dark");
                setCookie("theme", "light");
                return;
            case "dark":
                setIsDark(true);
                setIsSystemTheme(false);
                root.classList.add("dark");
                setCookie("theme", "dark");
                return;
            default:
                deleteCookie("theme");
                setIsSystemTheme(true);
                if (matchMedia("(prefers-color-scheme: dark)").matches) {
                    setIsDark(true);
                    root.classList.add("dark");
                } else {
                    setIsDark(false);
                    root.classList.remove("dark");
                }
                return;
        }
    };

    useEffect(() => {
        if (hasCookie("theme")) {
            setIsSystemTheme(false);
        } else {
            setIsSystemTheme(true);
        }
    }, []);

    return (
        <section className="flex flex-col items-end gap-4 w-full md:flex-row md:gap-8 md:items-center md:justify-end">
            <UserInfo
                ref={buttonRef}
                userEmail={session?.user?.email}
                handleDataHandler={() => setModalState(!modalState)}
            />
            {session != null ? (
                <Button
                    type="button"
                    clickHandler={() =>
                        signOut({
                            callbackUrl: process.env.NEXTAUTH_URL,
                        })
                    }
                    customStyle="w-32 bg-red-400 font-bold text-sm text-neutral-100  dark:bg-red-700 dark:text-gray-300"
                >
                    Logout
                </Button>
            ) : (
                <LoginHandleButton
                    isUserSignedIn={false}
                    handleAuthenticationModal={handleAuthenticationModal}
                />
            )}
            {modalState ? (
                <UserSettingMenu
                    toggleButtonRef={buttonRef.current}
                    isDark={isDark}
                    isSystemTheme={isSystemTheme}
                    updateUserMenu={updateUserMenu}
                    updateModalState={updateModalState}
                    getTotalData={getTotalData}
                    uploadUserData={uploadUserData}
                    handleUserData={handleUserData}
                    handleTheme={handleTheme}
                />
            ) : (
                <></>
            )}
        </section>
    );
}
