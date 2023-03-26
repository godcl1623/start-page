import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import RequestControllers from "controllers";
import useGetRawCookie from "hooks/useGetRawCookie";
import { useRouter } from "next/router";

const useCancelSubscription = () => {
    const { deleteDataOf } = new RequestControllers();
    const rawCookie = useGetRawCookie();
    const mutationFn = (deleteTarget: number) =>
        deleteDataOf(`/sources/${deleteTarget}?mw=${rawCookie}`);
    const router = useRouter();
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
