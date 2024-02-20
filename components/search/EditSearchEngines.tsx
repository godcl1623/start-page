import { useMutation } from "@tanstack/react-query";
import Button from "components/common/Button";
import RequestControllers from "controllers/requestControllers";
import { SearchEnginesData } from "controllers/searchEngines";
import { nanoid } from "nanoid";
import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { extractFormValues } from "./utils/helpers";

interface Props {
    userId: string;
    serverSearchEnginesList: SearchEnginesData[];
    closeModal: () => void;
}

export default memo(function EditSearchEngines({
    userId,
    serverSearchEnginesList,
    closeModal,
}: Props) {
    const [searchEnginesList, setSearchEnginesList] = useState<
        SearchEnginesData[]
    >(serverSearchEnginesList);
    const [isAppendingNewData, setIsAppendingNewData] = useState(false);
    const tableRef = useRef<HTMLTableElement>(null);
    const { postDataTo } = new RequestControllers();
    const buttonStyle = "w-16 text-neutral-100";
    const tableRowStyle = "flex w-full border-b";
    const siteNameStyle = "w-[20%] border-r";
    const queryStyle = "w-[65%]";
    const queryManageStyle = "flex w-[15%]";
    const queryManageButtonStyle = "w-1/2";

    const mutationFn = (mutatedEnginesList: SearchEnginesData[]) =>
        postDataTo(`/search_engines?userId=${userId}`, mutatedEnginesList);
    const { mutate } = useMutation({ mutationFn });

    const addNewDataToList = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [name, url] = extractFormValues(event);
        const newData: SearchEnginesData = {
            id: searchEnginesList.length,
            name,
            url,
        };
        setSearchEnginesList((oldList) => oldList.concat([newData]));
        setIsAppendingNewData(false);
    };

    const handleSave = async () => {
        try {
            mutate(searchEnginesList);
            await alert("저장되었습니다.");
            location.reload();
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        if (serverSearchEnginesList != null) {
            setSearchEnginesList((oldList) =>
                oldList.slice(oldList.length).concat(serverSearchEnginesList)
            );
        }
    }, [serverSearchEnginesList]);

    const searchEngines = searchEnginesList.map((engineData) => (
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
    // TODO: 비로그인 상태에서 편집 버튼까지는 정상적으로 표시되고 리스트를 저장할 때 구독 추가처럼 DB에 기록되도록 기능 구현

    return (
        <section className="h-full w-full p-4 pt-6">
            <article className="mb-8">
                <table
                    ref={tableRef}
                    className="h-full w-full border border-b-0"
                >
                    <tr className={tableRowStyle}>
                        <th className={siteNameStyle}>사이트명</th>
                        <th className={`w-4/5`}>쿼리문 주소</th>
                    </tr>
                    {searchEngines}
                    {isAppendingNewData ? (
                        <tr className={tableRowStyle}>
                            <td className="w-full">
                                <form
                                    className="flex w-full"
                                    onSubmit={addNewDataToList}
                                >
                                    <input
                                        className={`${siteNameStyle} px-2 text-center text-neutral-400`}
                                    />
                                    <input
                                        className={`${queryStyle} px-2 text-center text-neutral-400`}
                                    />
                                    <div className="w-[15%]">
                                        <button
                                            type="submit"
                                            className={queryManageButtonStyle}
                                        >
                                            저장
                                        </button>
                                        <button
                                            type="button"
                                            className={queryManageButtonStyle}
                                            onClick={() =>
                                                setIsAppendingNewData(false)
                                            }
                                        >
                                            취소
                                        </button>
                                    </div>
                                </form>
                            </td>
                        </tr>
                    ) : (
                        <></>
                    )}
                </table>
                <Button
                    type="button"
                    customStyle="w-full mt-[1px] bg-neutral-500 dark:bg-neutral-500 rounded-none"
                    clickHandler={() => setIsAppendingNewData(true)}
                >
                    추가
                </Button>
            </article>
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
                    clickHandler={handleSave}
                >
                    저장
                </Button>
            </div>
        </section>
    );
});
