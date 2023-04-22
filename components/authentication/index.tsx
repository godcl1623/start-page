import TextInput from "./common/TextInput";
import Button from "components/common/Button";

interface Props {
    closeModal: () => void;
}

export default function Authentication({ closeModal }: Props) {
    return (
        <article className="flex flex-col justify-center w-[37.5rem] h-[25rem] rounded-md shadow-md p-8 bg-neutral-100 text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200">
            <Button
                type="button"
                customStyle="absolute top-0 right-0 flex justify-center items-center w-10 h-10 shadow-none rounded-none bg-none text-lg"
                clickHandler={closeModal}
            >
                ✕
            </Button>
            <form className="flex flex-col gap-8 mb-8">
                <TextInput
                    type="email"
                    placeholder="EMAIL"
                    required
                    name="email"
                    className="rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600"
                />
                <TextInput
                    type="password"
                    placeholder="PW"
                    required
                    name="password"
                    className="rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600"
                />
                <Button
                    type="submit"
                    customStyle="bg-sky-400 text-base text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
                >
                    로그인
                </Button>
            </form>
            <section className="flex gap-4">
                <Button
                    type="button"
                    customStyle="text-base bg-neutral-200 dark:bg-neutral-600"
                >
                    회원가입
                </Button>
                <Button
                    type="button"
                    customStyle="text-base bg-neutral-200 dark:bg-neutral-600"
                >
                    비밀번호 재설정
                </Button>
            </section>
        </article>
    );
}
