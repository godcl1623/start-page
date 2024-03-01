import { useSession } from "next-auth/react";
import { ModalKeys } from "../MainView";
import { ChangeEvent } from "react";
import RequestControllers from "controllers/requestControllers";
import { useMutation } from "@tanstack/react-query";
import { UploadFileType } from "app/api/data/import/route";
import { getCookie, setCookie } from "cookies-next";
import LoginInfoAreaView from "./LoginInfoAreaView";

interface Props {
    handleModal: (target: ModalKeys) => () => void;
    userId: string;
}

export type Theme = "light" | "dark" | "system";

export default function LoginInfoArea({
    handleModal,
    userId,
}: Readonly<Props>) {
    const { data: session } = useSession();
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

    return (
        <LoginInfoAreaView
            handleModal={handleModal}
            getTotalData={getTotalData}
            uploadUserData={uploadUserData}
            handleUserData={handleUserData}
        />
    );
}
