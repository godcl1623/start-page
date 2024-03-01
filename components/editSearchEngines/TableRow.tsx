interface Props {
    engineName: string;
    engineUrl: string;
    editEngineData: () => void;
    deleteEngineData: () => void;
}

export default function TableRow({
    engineName,
    engineUrl,
    editEngineData,
    deleteEngineData,
}: Props) {
    return (
        <tr className="flex w-full border-b border-neutral-500 dark:border-neutral-200">
            <td className="w-[20%] border-r border-neutral-500 dark:border-neutral-200">
                {engineName}
            </td>
            <td className="w-[65%] whitespace-nowrap overflow-hidden text-ellipsis">
                {engineUrl}
            </td>
            <td className="flex w-[15%]">
                <button
                    type="button"
                    className="w-1/2 font-bold text-xs"
                    onClick={editEngineData}
                >
                    편집
                </button>
                <button
                    type="button"
                    className="w-1/2 font-bold text-xs"
                    onClick={deleteEngineData}
                >
                    삭제
                </button>
            </td>
        </tr>
    );
}
