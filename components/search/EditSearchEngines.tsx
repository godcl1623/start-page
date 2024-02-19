import Button from "components/common/Button";
import { SearchEnginesData } from "controllers/searchEngines";
import { nanoid } from "nanoid";
import { memo } from "react";

interface Props {
    userId: string;
    searchEnginsList: SearchEnginesData[];
    closeModal: () => void;
}

export default memo(function EditSearchEngines({
    userId,
    searchEnginsList,
    closeModal,
}: Props) {
    const buttonStyle = "w-16 text-neutral-100";
    const tableRowStyle = "flex w-full border-b";
    const siteNameStyle = "w-[20%] border-r";
    const queryStyle = "w-[65%]";
    const queryManageStyle = "flex w-[15%]";
    const queryManageButtonStyle = "w-1/2";
    const searchEngines = searchEnginsList.map((engineData) => (
        <tr
            className={tableRowStyle}
            key={`enginesList_${engineData.name}_${nanoid()}`}
        >
            <td className={siteNameStyle}>{engineData.name}</td>
            <td className={queryStyle}>{engineData.url}</td>
            {/* TODO: 편집, 삭제 버튼은 td 말고 url에 absolute 버튼으로 추가 */}
            <td className={queryManageStyle}>
                <div className={queryManageButtonStyle}>편집</div>
                <div className={queryManageButtonStyle}>삭제</div>
            </td>
        </tr>
    ));

    return (
        <section className="h-full w-full p-4">
            <table className="h-full w-full mb-8 border border-b-0">
                <tr className={tableRowStyle}>
                    <th className={siteNameStyle}>사이트명</th>
                    <th className={`w-4/5`}>쿼리문 주소</th>
                </tr>
                {searchEngines}
                <tr className={tableRowStyle}>
                    <td className={siteNameStyle}>
                        <input className="w-full" />
                    </td>
                    <td className={queryStyle}>
                        <input className="w-full" />
                    </td>
                    <td className={queryManageStyle}>
                        <div className={queryManageButtonStyle}>저장</div>
                        <div className={queryManageButtonStyle}>취소</div>
                    </td>
                </tr>
                <tr>
                    <td>추가</td>
                </tr>
            </table>
            <div className="flex justify-evenly w-full">
                <Button
                    type="button"
                    customStyle={`${buttonStyle} bg-red-400 dark:bg-red-700`}
                    clickHandler={closeModal}
                >
                    취소
                </Button>
                <Button
                    type="button"
                    customStyle={`${buttonStyle} bg-sky-500 dark:bg-sky-600`}
                >
                    저장
                </Button>
            </div>
        </section>
    );
});
