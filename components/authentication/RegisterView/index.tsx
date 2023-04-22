import Button from "components/common/Button";
import TextInput, { Props as InputData } from "../common/TextInput";

interface Props {
    closeModal: () => void;
}

export default function RegisterView({ closeModal }: Props) {
    const inputs = INPUT_DATA.map((inputData: InputData, index: number) => (
        <section key={`${inputData.name}_${index}`}>
            <TextInput {...inputData} />
            <p className="mt-3 px-4 text-xs text-right text-red-500">
                오류 영역
            </p>
        </section>
    ));
    return (
        <form className="flex flex-col gap-4 mt-8">
            {inputs}
            <section className="flex gap-4">
                <Button
                    type="button"
                    customStyle="bg-red-400 text-neutral-100 dark:bg-red-700"
                    clickHandler={closeModal}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    customStyle="bg-sky-500 text-neutral-100 dark:bg-sky-600"
                >
                    제출
                </Button>
            </section>
        </form>
    );
}

const INPUT_DATA: InputData[] = [
    {
        type: "email",
        placeholder: "이메일 주소",
        required: true,
        name: "email",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
    {
        type: "text",
        placeholder: "닉네임",
        required: true,
        name: "nickname",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
    {
        type: "password",
        placeholder: "비밀번호",
        required: true,
        name: "password",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
    {
        type: "password",
        placeholder: "비밀번호 확인",
        required: true,
        name: "password_check",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
];
