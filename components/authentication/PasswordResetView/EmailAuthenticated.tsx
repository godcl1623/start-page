import Button from "components/common/Button";

interface Props {
    closeModal: () => void;
}

export default function EmailAuthenticated({ closeModal }: Props) {
    return (
        <article>
            <h1 className="text-center text-xl leading-10">
                회원님의 이메일 주소로 비밀번호 재설정 링크를 발송했습니다.
                <br />
                이메일 수신함을 확인해주세요.
            </h1>
            <Button
                type="button"
                customStyle="mt-20 bg-red-400 text-neutral-100 dark:bg-red-700"
                clickHandler={closeModal}
            >
                닫기
            </Button>
        </article>
    );
}
