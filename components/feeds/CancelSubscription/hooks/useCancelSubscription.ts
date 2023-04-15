import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import RequestControllers from "controllers/requestControllers";
import useGetRawCookie from "hooks/useGetRawCookie";
import { useRouter } from "next/router";

const useCancelSubscription = () => {
    const rawCookie = useGetRawCookie();
    const router = useRouter();

    const { deleteDataOf } = new RequestControllers();
    const mutationFn = (deleteTarget: number) =>
        deleteDataOf(`/sources/${deleteTarget}?mw=${rawCookie}`);
    const onSuccess = () => {
        window.alert("저장되었습니다.");
        router.reload();
    };
    const onError = (error: unknown) => {
        window.alert("오류가 발생했습니다.");
        if (axios.isAxiosError(error)) return Promise.reject(error);
        else if (error instanceof Error) throw new Error(error.message);
    };
    const { mutate } = useMutation({
        mutationFn,
        onError,
        onSuccess,
    });

    return mutate;
};

export default useCancelSubscription;
