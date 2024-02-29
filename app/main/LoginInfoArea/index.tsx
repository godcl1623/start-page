import { useSession, signOut } from "next-auth/react";
import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import { ModalKeys } from "../MainView";
import Button from "components/common/Button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import RequestControllers from "controllers/requestControllers";
import useOutsideClickClose from "hooks/useOutsideClickClose";
import { useMutation } from "@tanstack/react-query";
import { UploadFileType } from "app/api/data/import/route";
import { getCookie, setCookie, deleteCookie, hasCookie } from "cookies-next";
import { MdLightMode, MdDarkMode, MdFormatColorReset } from "react-icons/md";
import useDetectSystemTheme from "hooks/useDetectSystemTheme";
import UserSettingMenu from "./UserSettingMenu";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
    userId: string;
}

export type Theme = "light" | "dark" | "system";

export default function LoginInfoArea({
    handleAuthenticationModal,
    userId,
}: Readonly<Props>) {
    const [modalState, setModalState] = useState(false);
    const [userMenu, setUserMenu] = useState<HTMLDivElement | null>(null);
    const [isSystemTheme, setIsSystemTheme] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isDark, setIsDark] = useDetectSystemTheme();
    const { data: session } = useSession();
    useOutsideClickClose({
        target: userMenu,
        toggleButton: buttonRef.current,
        closeFunction: () => setModalState(false),
    });
    const { getDataFrom, putDataTo } = new RequestControllers();
    const mutationFn = ({
        userId,
        dataToUpload,
    }: {
        userId: string;
        dataToUpload: string | UploadFileType;
    }) =>
        putDataTo<{ result: string } | { error: string }>(
            `/data/import?userId=${userId}`,
            dataToUpload
        );
    const { mutateAsync } = useMutation({
        mutationFn,
    });

    const updateUserMenu = (value: HTMLDivElement | null) => {
        setUserMenu(value);
    };

    const updateModalState = (value: boolean) => () => {
        setModalState(value);
    };

    const getTotalData = async () => {
        try {
            const exportedData = await getDataFrom<
                ErrorOptions | UploadFileType
            >(`/data/export?userId=${userId}`);
            if ("error" in exportedData) {
                throw new Error(exportedData.error as string);
            }
            const dataToJSON = new Blob([JSON.stringify(exportedData)], {
                type: "application/json",
            });
            const tempLink = document.createElement("a");
            tempLink.href = URL.createObjectURL(dataToJSON);
            tempLink.download = "export.json";
            tempLink.click();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const uploadUserData = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            if (
                confirm(
                    "이 동작은 업로드하는 파일로 기존 데이터를 덮어쓰게 됩니다.\n계속하시겠습니까?"
                )
            ) {
                if (userId === "") {
                    userId = (
                        await getDataFrom<{ userCookie: string }>("/register")
                    ).userCookie;
                    setCookie("mw", userId, { maxAge: 60 * 60 * 24 * 30 });
                }
                const uploadedFile = await event.target.files?.[0]?.text();
                const uploadResult = await mutateAsync({
                    userId,
                    dataToUpload: uploadedFile ?? "",
                });
                if ("error" in uploadResult) {
                    throw new Error(uploadResult.error);
                }
                await alert(uploadResult.result);
                location.reload();
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const handleUserData = async () => {
        try {
            if (session == null) {
                throw new Error("이메일 로그인 후 이용 가능합니다.");
            }

            if (
                confirm(
                    "이 동작은 브라우저에 저장된 데이터로 기존 데이터를 덮어쓰게 됩니다.\n계속하시겠습니까?"
                )
            ) {
                const localUserUUID = getCookie("mw");
                if (localUserUUID == null) {
                    throw new Error("브라우저에 저장된 데이터가 없습니다.");
                }

                const localUserData = await getDataFrom<
                    ErrorOptions | UploadFileType
                >(`/data/export?userId=${localUserUUID}`);
                if ("error" in localUserData) {
                    throw new Error(localUserData.error as string);
                }

                const uploadResult = await mutateAsync({
                    userId,
                    dataToUpload: (localUserData as UploadFileType) ?? "",
                });
                if ("error" in uploadResult) {
                    throw new Error(uploadResult.error);
                }

                await alert(uploadResult.result);
                location.reload();
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            }
        }
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
