import { useSession, signOut } from "next-auth/react";
import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import { ModalKeys } from "../MainView";
import Button from "components/common/Button";
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import RequestControllers from "controllers/requestControllers";
import useOutsideClickClose from "hooks/useOutsideClickClose";
import { useMutation } from "@tanstack/react-query";
import { UploadFileType } from "app/api/data/import/route";
import { getCookie, setCookie } from "cookies-next";
import { MdLightMode, MdDarkMode } from "react-icons/md";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
    userId: string;
}

export default function LoginInfoArea({
    handleAuthenticationModal,
    userId,
}: Readonly<Props>) {
    const [isDark, setIsDark] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [userMenu, setUserMenu] = useState<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
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

    const handleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            setIsDark(false);
            root.classList.remove("dark");
            setCookie("theme", "light");
        } else {
            setIsDark(true);
            root.classList.add("dark");
            setCookie("theme", "dark");
        }
    };

    useLayoutEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
    }, [isDark]);

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
            {modalState && (
                <div
                    ref={setUserMenu}
                    className={`absolute top-0 z-10 w-full md:top-20 md:w-max`}
                    style={{
                        right:
                            buttonRef.current &&
                            document.documentElement.offsetWidth > 768
                                ? buttonRef.current.offsetWidth
                                : 0,
                    }}
                >
                    <div className="flex flex-col gap-4 justify-center items-center w-full p-4 rounded-md shadow-lg bg-neutral-100 dark:bg-neutral-700 dark:shadow-zinc-600 md:gap-6 md:w-80">
                        {document.documentElement.offsetWidth < 768 ? (
                            <button
                                type="button"
                                className="absolute top-4 right-4 flex justify-center items-center w-4 h-4"
                                onClick={() => setModalState(false)}
                            >
                                ✕
                            </button>
                        ) : (
                            <></>
                        )}
                        <Button
                            type="button"
                            customStyle="w-44 px-4 py-2 rounded-md bg-neutral-500 text-sm text-neutral-100 dark:text-gray-300"
                            clickHandler={getTotalData}
                        >
                            피드 / 출처 내보내기
                        </Button>
                        <label
                            ref={labelRef}
                            className="w-44 px-4 py-2 rounded-md bg-neutral-500 text-center text-sm text-neutral-100 cursor-pointer dark:text-gray-300"
                        >
                            피드 / 출처 불러오기
                            <input
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={uploadUserData}
                            />
                        </label>
                        <Button
                            type="button"
                            customStyle="w-44 px-4 py-2 rounded-md bg-neutral-500 text-sm text-neutral-100 dark:text-gray-300"
                            clickHandler={handleUserData}
                        >
                            데이터 이전
                        </Button>
                        <div className="flex justify-evenly w-44 py-2">
                            <MdLightMode className="w-8 h-8 fill-yellow-400" />
                            <label
                                htmlFor="handleTheme"
                                className="relative w-16 h-8 mx-2 border border-transparent shadow-lg rounded-full bg-neutral-100 transition-all duration-300 cursor-pointer dark:bg-neutral-500 dark:shadow-md dark:shadow-zinc-500"
                            >
                                <div
                                    className={`absolute top-[3px] left-1 ${
                                        isDark
                                            ? "translate-x-[calc(100%+0.4rem)]"
                                            : "translate-x-0"
                                    } w-6 h-6 rounded-full shadow-md bg-gray-300 transition-all duration-300 dark:bg-neutral-700`}
                                />
                                <button
                                    id="handleTheme"
                                    onClick={handleTheme}
                                    className="hidden"
                                />
                            </label>
                            <MdDarkMode className="w-8 h-8 fill-blue-400" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
