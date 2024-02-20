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
        <tr className="flex w-full border-b">
            <td className="w-full">
                <form className="flex w-full" onSubmit={addNewDataToList}>
                    <input
                        className="w-[20%] border-r px-2 text-center text-neutral-400"
                        defaultValue={defaultName != null ? defaultName : ""}
                    />
                    <input
                        className="w-[65%] px-2 text-center text-neutral-400"
                        defaultValue={defaultUrl != null ? defaultUrl : ""}
                    />
                    <div className="w-[15%]">
                        <button type="submit" className="w-1/2">
                            저장
                        </button>
                        <button
                            type="button"
                            className="w-1/2"
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
