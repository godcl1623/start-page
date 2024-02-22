import { useMutation } from "@tanstack/react-query";
import RequestControllers from "controllers/requestControllers";

const useCancelSubscription = (userId: string) => {
    const { deleteDataOf } = new RequestControllers();
    const mutationFn = (deleteTarget: number) =>
        deleteDataOf(`/sources/${deleteTarget}?userId=${userId}`);
    const onSuccess = () => {
        window.alert("저장되었습니다.");
        location.reload();
    };
    const onError = (error: unknown) => {
        window.alert("오류가 발생했습니다.");
        if (error instanceof Error) throw new Error(error.message);
    };
    const { mutate } = useMutation({
        mutationFn,
        onError,
        onSuccess,
    });

    return mutate;
};

export default useCancelSubscription;
