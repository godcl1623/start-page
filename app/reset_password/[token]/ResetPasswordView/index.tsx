import TextInput, {
    Props as InputData,
} from "components/authentication/common/TextInput";
import ClientButtonSets from "./ClientButtonSets";

export default function ResetPasswordView() {
    const inputs = INPUT_DATA.map((inputData: InputData, index: number) => (
        <section key={`${inputData.name}_${index}`}>
            <TextInput {...inputData} />
            <p className="mt-3 px-4 text-xs text-right text-red-500">
                오류 영역
            </p>
        </section>
    ));

    return (
        <article className="flex justify-center items-center w-full h-full bg-neutral-200 dark:bg-neutral-800">
            <form className="w-[90vw] h-[25rem] rounded-md shadow-md p-8 bg-neutral-100 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 md:w-[37.5rem]">
                <h1 className="w-full mb-8 text-2xl text-center">
                    새로운 비밀번호를 입력해주세요.
                </h1>
                <section className="mb-8">{inputs}</section>
                <ClientButtonSets />
            </form>
        </article>
    );
}

const INPUT_DATA: InputData[] = [
    {
        type: "password",
        placeholder: "비밀번호",
        required: true,
        name: "new_password",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
    {
        type: "password",
        placeholder: "비밀번호 확인",
        required: true,
        name: "new_password_check",
        className: "w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600",
    },
];
