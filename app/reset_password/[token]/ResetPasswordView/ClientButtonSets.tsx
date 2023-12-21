"use client";

import CancelSubmitButtonSets from "components/authentication/common/CancelSubmitButtonSets";
import { useRouter, usePathname } from "next/navigation";
import { memo } from "react";

export default memo(function ClientButtonSets() {
    const router = useRouter();
    const pathname = usePathname();

    const goToMain = () => router.push("/");
    const goToSuccess = () => router.push(`${pathname}/success`);
    const goToError = () => router.push(`${pathname}/error`);

    return (
        <CancelSubmitButtonSets
            handleCancel={goToMain}
            handleSubmit={goToSuccess}
        />
    );
});
