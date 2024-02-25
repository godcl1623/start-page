import { useSession, signOut } from "next-auth/react";
import UserInfo from "./UserInfo";
import LoginHandleButton from "./LoginHandleButton";
import { ModalKeys } from "../MainView";
import Button from "components/common/Button";
import { ChangeEvent, useRef, useState } from "react";
import RequestControllers from "controllers/requestControllers";
import useOutsideClickClose from "hooks/useOutsideClickClose";
import { useMutation } from "@tanstack/react-query";
import { UploadFileType } from "app/api/data/import/route";
import { setCookie } from "cookies-next";

interface Props {
    handleAuthenticationModal: (target: ModalKeys) => () => void;
    userId: string;
}

export default function LoginInfoArea({
    handleAuthenticationModal,
    userId,
}: Props) {
    const [modalState, setModalState] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    // FIXME: 타입 오류 수정 필요
    const { data: session } = useSession();
    // useOutsideClickClose({
    //     target: userMenuRef.current,
    //     toggleButton: buttonRef.current,
    //     closeFunction: () => setModalState(false),
    // });
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
                    "이 동작은 기존 데이터를 덮어쓰게 됩니다.\n계속하시겠습니까?"
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

    return (
        <section className="flex flex-col items-end gap-4 w-full md:flex-row md:gap-8 md:items-center md:justify-end">
            <UserInfo
                ref={buttonRef}
                userEmail={
                    session != null &&
                    session.user != null &&
                    session.user.email != null
                        ? session.user.email
                        : undefined
                }
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
                    customStyle="w-32 bg-red-400 font-bold text-base text-neutral-100  dark:bg-red-700 dark:text-gray-300"
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
                    className={`absolute top-32 left-[${
                        buttonRef.current
                            ? `${buttonRef.current.offsetLeft}px`
                            : 0
                    }] z-10 md:top-28`}
                >
                    {/* <div className="hidden absolute -top-[40px] left-1/2 -translate-x-[10px] border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-neutral-100 dark:border-b-neutral-700 md:block" /> */}
                    <div
                        ref={userMenuRef}
                        className="flex flex-col gap-4 justify-center items-center w-64 h-36 rounded-md shadow-lg bg-neutral-100 dark:bg-neutral-700 dark:shadow-zinc-600 md:gap-8 md:w-80 md:h-56"
                    >
                        <label
                            ref={labelRef}
                            className="w-44 px-4 py-2 rounded-md bg-zinc-600 text-base text-neutral-100 cursor-pointer dark:text-gray-300"
                        >
                            피드 / 출처 불러오기
                            <input
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={uploadUserData}
                            />
                        </label>
                        <button
                            type="button"
                            className="w-44 px-4 py-2 rounded-md bg-zinc-600 text-base text-neutral-100 dark:text-gray-300"
                            onClick={getTotalData}
                        >
                            피드 / 출처 내보내기
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
