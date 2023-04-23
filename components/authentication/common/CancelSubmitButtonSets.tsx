import Button from "components/common/Button";

interface Props {
    handleCancel: () => void;
    handleSubmit: () => void;
}

export default function CancelSubmitButtonSets({
    handleCancel,
    handleSubmit,
}: Props) {
    return (
        <section className="flex gap-4">
            <Button
                type="button"
                customStyle="bg-red-400 text-neutral-100 dark:bg-red-700"
                clickHandler={handleCancel}
            >
                취소
            </Button>
            <Button
                type="submit"
                customStyle="bg-sky-500 text-neutral-100 dark:bg-sky-600"
                clickHandler={handleSubmit}
            >
                제출
            </Button>
        </section>
    );
}
