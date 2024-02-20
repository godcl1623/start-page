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
        <tr className="flex w-full border-b">
            <td className="w-[20%] border-r">{engineName}</td>
            <td className="w-[65%]">{engineUrl}</td>
            <td className="flex w-[15%]">
                <button
                    type="button"
                    className="w-1/2"
                    onClick={editEngineData}
                >
                    편집
                </button>
                <button
                    type="button"
                    className="w-1/2"
                    onClick={deleteEngineData}
                >
                    삭제
                </button>
            </td>
        </tr>
    );
}
