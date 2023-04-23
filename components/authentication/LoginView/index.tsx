import Button from "components/common/Button";
import { ViewState } from "..";
import TextInput from "../common/TextInput";

interface Props {
    changeViewTo: (value: ViewState) => () => void;
}

export default function LoginView({ changeViewTo }: Props) {
    return (
        <>
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
                    clickHandler={changeViewTo("register")}
                >
                    회원가입
                </Button>
                <Button
                    type="button"
                    customStyle="text-base bg-neutral-200 dark:bg-neutral-600"
                    clickHandler={changeViewTo("reset")}
                >
                    비밀번호 재설정
                </Button>
            </section>
        </>
    );
}
