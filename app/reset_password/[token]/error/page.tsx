import ResetResultView from "../common/ResetResultView";

export default function ResetPasswordError() {
    const headerString = "오류가 발생했습니다.";

    return (
        <ResetResultView
            resultHeader={headerString}
            isSuccess={false}
        />
    );
}
