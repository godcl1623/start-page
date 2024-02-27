import { useMutation } from "@tanstack/react-query";
import Button from "components/common/Button";
import RequestControllers from "controllers/requestControllers";
import { SearchEnginesData } from "controllers/searchEngines";
import { nanoid } from "nanoid";
import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { extractFormValues } from "../search/utils/helpers";
import EngineDataEditor from "./EngineDataEditor";
import TableRow from "./TableRow";
import { setCookie } from "cookies-next";

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
    const [isEditingData, setIsEditingData] = useState<number | false>(false);
    const tableRef = useRef<HTMLTableElement>(null);
    const { getDataFrom, postDataTo } = new RequestControllers();

    const mutationFn = ({
        userId,
        searchEnginesList,
    }: {
        userId: string;
        searchEnginesList: SearchEnginesData[];
    }) =>
        postDataTo<string>(
            `/search_engines?userId=${userId}`,
            searchEnginesList
        );
    const { mutateAsync } = useMutation({ mutationFn });

    const addNewDataToList = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const [name, url] = extractFormValues(event);
        const newData: SearchEnginesData = {
            id: `engine_data_${nanoid()}`,
            name,
            url,
        };
        setSearchEnginesList((oldList) => oldList.concat([newData]));
        setIsAppendingNewData(false);
    };

    const updateDataOfList =
        (targetIndex: number) => (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (targetIndex > searchEnginesList.length) return;
            const [name, url] = extractFormValues(event);
            const newList = searchEnginesList.map((engineData, index) => {
                if (targetIndex === index) {
                    return {
                        ...engineData,
                        name,
                        url,
                    };
                }
                return engineData;
            });
            setSearchEnginesList((oldList) =>
                oldList.slice(oldList.length).concat(newList)
            );
            setIsEditingData(false);
        };

    const deleteDataFromList = (targetIndex: number) => () => {
        if (targetIndex > searchEnginesList.length || targetIndex < 0) return;
        setSearchEnginesList((oldList) =>
            oldList.filter((engineData, index) => index !== targetIndex)
        );
    };

    const handleSave = async () => {
        try {
            if (userId === "") {
                userId = (
                    await getDataFrom<{ userCookie: string }>("/register")
                ).userCookie;
                setCookie("mw", userId, { maxAge: 60 * 60 * 24 * 30 });
            }

            const mutateResult = JSON.parse(
                await mutateAsync({ userId, searchEnginesList })
            );
            if ("error" in mutateResult) throw new Error();
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

    const searchEngines = searchEnginesList.map((engineData, index) =>
        typeof isEditingData !== "boolean" && isEditingData === index ? (
            <EngineDataEditor
                key={`enginesList_${engineData.name}_${nanoid()}`}
                addNewDataToList={updateDataOfList(index)}
                cancelAdd={() => setIsEditingData(false)}
                defaultName={engineData.name}
                defaultUrl={engineData.url}
            />
        ) : (
            <TableRow
                key={`enginesList_${engineData.name}_${nanoid()}`}
                engineName={engineData.name}
                engineUrl={engineData.url}
                editEngineData={() => setIsEditingData(index)}
                deleteEngineData={deleteDataFromList(index)}
            />
        )
    );

    return (
        <section className="h-full w-full p-4 pt-6">
            <article className="mb-8">
                <table
                    ref={tableRef}
                    className="h-full w-full border border-b-0 border-neutral-500 dark:border-neutral-200"
                >
                    <thead>
                        <tr className="flex w-full border-b border-neutral-500 dark:border-neutral-200">
                            <th className="w-1/5 border-r border-neutral-500 dark:border-neutral-200">
                                사이트명
                            </th>
                            <th className="w-4/5">쿼리문 주소</th>
                        </tr>
                    </thead>
                    <tbody>{searchEngines}</tbody>
                    <tfoot>
                        {isAppendingNewData ? (
                            <EngineDataEditor
                                addNewDataToList={addNewDataToList}
                                cancelAdd={() => setIsAppendingNewData(false)}
                            />
                        ) : (
                            <></>
                        )}
                    </tfoot>
                </table>
                <Button
                    type="button"
                    customStyle="w-full mt-[1px] bg-neutral-500 font-bold text-sm text-neutral-100 rounded-none dark:bg-neutral-500 dark:text-gray-300"
                    clickHandler={() => setIsAppendingNewData(true)}
                >
                    추가
                </Button>
            </article>
            <div className="flex justify-evenly w-full">
                <Button
                    type="button"
                    customStyle="w-16 bg-red-400 font-bold text-xs text-neutral-100 dark:bg-red-700 dark:text-gray-300"
                    clickHandler={closeModal}
                >
                    취소
                </Button>
                <Button
                    type="button"
                    customStyle="w-16 bg-sky-400 font-bold text-xs text-neutral-100 dark:bg-sky-600 dark:text-gray-300"
                    clickHandler={handleSave}
                >
                    저장
                </Button>
            </div>
        </section>
    );
});
