import Button from "components/common/Button";

interface Props {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function SubscriptionForm({ handleSubmit }: Props) {
    return (
        <section className="w-full h-full">
            <form
                className="flex flex-col justify-center items-center w-full h-full"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="feed_address"
                    placeholder="새 피드 주소를 입력해주세요."
                    className="w-full mt-8 mb-4 rounded-md shadow-lg py-2 px-4 text-neutral-700 dark:shadow-zinc-600 dark:focus:outline-sky-600 dark:text-neutral-400"
                />
                <Button
                    type="submit"
                    customStyle="w-20 p-1 bg-sky-400 font-bold text-xs text-neutral-100 dark:bg-sky-600 dark:text-gray-300"
                >
                    추가
                </Button>
            </form>
        </section>
    );
}
