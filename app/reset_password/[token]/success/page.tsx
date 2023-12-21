import ResetResultView from "../common/ResetResultView";

export default function ResetPasswordSuccess() {
    const headerString = "비밀번호가 성공적으로 변경되었습니다.";

    return (
        <ResetResultView
            resultHeader={headerString}
            isSuccess
        />
    );
}
