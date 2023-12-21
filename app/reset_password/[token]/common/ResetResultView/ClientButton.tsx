"use client";

import Button from "components/common/Button";
import { useRouter } from "next/navigation";
import { memo } from "react";

interface Props {
    buttonStyle: string;
    children: string;
}

export default memo(function ClientButton({
    buttonStyle,
    children,
}: Readonly<Props>) {
    const router = useRouter();

    const goToMain = () => router.push("/");

    return (
        <Button type="button" customStyle={buttonStyle} clickHandler={goToMain}>
            {children}
        </Button>
    );
});
