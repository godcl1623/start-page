import ClientButton from "./ClientButton";

interface Props {
    resultHeader: string;
    isSuccess: boolean;
}

export default function ResetResultView({
    resultHeader,
    isSuccess,
}: Props) {
    const buttonStyle = isSuccess
        ? "w-40 bg-sky-500 text-base text-neutral-100 dark:bg-sky-600"
        : "w-40 bg-red-400 text-base text-neutral-100 dark:bg-red-700";
    const buttonText = isSuccess ? "메인 페이지로" : "이전 페이지로";
    return (
        <article className="flex justify-center items-center w-full h-full bg-neutral-200 dark:bg-neutral-800">
            <section className="flex flex-col justify-center items-center gap-12 w-[90vw] h-[25rem] rounded-md shadow-md p-8 bg-neutral-100 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 md:w-[37.5rem]">
                <h1 className="w-full mb-8 text-2xl text-center">
                    {resultHeader}
                </h1>
                <ClientButton buttonStyle={buttonStyle}>
                    {buttonText}
                </ClientButton>
            </section>
        </article>
    );
}
