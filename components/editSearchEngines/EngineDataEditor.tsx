import { FormEvent } from "react";

interface Props {
    addNewDataToList: (event: FormEvent<HTMLFormElement>) => void;
    cancelAdd: () => void;
    defaultName?: string;
    defaultUrl?: string;
}

export default function EngineDataEditor({
    addNewDataToList,
    cancelAdd,
    defaultName,
    defaultUrl,
}: Props) {
    return (
        <tr className="flex w-full border-b border-neutral-500 dark:border-neutral-200">
            <td className="w-full">
                <form className="flex w-full" onSubmit={addNewDataToList}>
                    <input
                        className="w-[calc(20%-1px)] border-r border-neutral-500 px-2 text-center text-neutral-400 dark:border-neutral-200 dark:bg-neutral-700 dark:text-neutral-400"
                        defaultValue={defaultName != null ? defaultName : ""}
                    />
                    <input
                        className="w-[calc(65%+2px)] px-2 text-center text-neutral-400 dark:bg-neutral-700 dark:text-neutral-400"
                        defaultValue={defaultUrl != null ? defaultUrl : ""}
                    />
                    <div className="flex w-[calc(15%-1px)]">
                        <button
                            type="submit"
                            className="w-1/2 font-bold text-xs"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            className="w-1/2 font-bold text-xs"
                            onClick={cancelAdd}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </td>
        </tr>
    );
}
