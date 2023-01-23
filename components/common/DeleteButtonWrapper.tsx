import { cloneElement, ReactElement } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import axios from 'axios';

import RequestControllers from 'controllers';

interface Props {
    children: ReactElement;
    deleteTarget: number;
}

export default function DeleteButtonWrapper({ children, deleteTarget }: Props) {
    const { deleteDataOf } = new RequestControllers();
    const mutationFn = () => deleteDataOf(`/sources/${deleteTarget}`);
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

    const ClonedChildren = cloneElement(children, { clickHandler: () => mutate() });

    return <>{ClonedChildren}</>
}