import { useRouter } from "next/router";
import ResetResultView from "components/reset_password/ResetResultView";

export default function ResetPasswordError() {
    const router = useRouter();
    const headerString = "오류가 발생했습니다.";
    const goToMain = () => router.back();

    return (
        <ResetResultView
            resultHeader={headerString}
            handleClick={goToMain}
            isSuccess={false}
        />
    );
}
