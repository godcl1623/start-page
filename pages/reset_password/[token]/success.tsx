import { useRouter } from "next/router";
import ResetResultView from "components/reset_password/ResetResultView";

export default function ResetPasswordSuccess() {
    const router = useRouter();
    const headerString = "비밀번호가 성공적으로 변경되었습니다.";
    const goToMain = () => router.push("/");

    return (
        <ResetResultView resultHeader={headerString} handleClick={goToMain} isSuccess />
    );
}
