import Button from "components/common/Button";
import { ViewState } from "..";
import TextInput from "../common/TextInput";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { FirebaseOptions, initializeApp } from "firebase/app";

interface Props {
    changeViewTo: (value: ViewState) => () => void;
}

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID,
};

const app = initializeApp(firebaseConfig);

export default function LoginView({ changeViewTo }: Props) {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const test = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result);
        } catch (error) {
            return Promise.reject(error);
        }
    };
    return (
        <article>
            <Button
                type="button"
                customStyle="bg-sky-400 text-base text-neutral-100 dark:bg-sky-800 dark:text-gray-300"
                clickHandler={test}
            >
                구글로 로그인
            </Button>
            {/* <form className="flex flex-col gap-8 mb-8">
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
            </section> */}
        </article>
    );
}
