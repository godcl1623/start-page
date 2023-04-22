import CancelSubmitButtonSets from "../common/CancelSubmitButtonSets";
import TextInput from "../common/TextInput";

interface Props {
    closeModal: () => void;
    changeViewTo: () => void;
}

export default function AuthenticateEmail({ closeModal, changeViewTo }: Props) {
    return (
        <form>
            <TextInput
                type="text"
                placeholder="인증 코드"
                required
                name="authenticateEmail"
                className="w-full rounded-md shadow-md py-3 px-6 dark:shadow-zinc-600"
            />
            <section className="flex justify-between items-center">
                <p className="mt-3 px-4 text-xs">03:00</p>
                <p className="mt-3 px-4 text-xs text-right text-red-500">
                    오류 영역
                </p>
            </section>
            <div className="mt-20">
                <CancelSubmitButtonSets
                    handleCancel={closeModal}
                    handleSubmit={changeViewTo}
                />
            </div>
        </form>
    );
}
