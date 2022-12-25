import { SourceData } from "controllers/sources";
import React from "react";
import { SourcesList } from "./CancelSubscription";
import Button from "./common/Button";
import ListItemBox from "./common/ListItemBox";
import ModalTemplate from "./common/ModalTemplate";

interface Props {
    sources: string;
    closeModal: () => void;
}

type CheckedStateType = {
    [key in string]: boolean;
};

export default function FilterBySource({ sources, closeModal }: Props) {
    const [subscriptionList, setSubscriptionList] = React.useState<
        SourceData[]
    >([]);
    const [checkedState, setCheckedState] = React.useState<CheckedStateType>(
        {}
    );

    const title = "표시할 출처를 선택해주세요";

    const changeDisplayFlag = (target: string) => () => {
        setCheckedState((previousObject) => ({
            ...previousObject,
            [target]: !checkedState[target],
        }));
    };

    React.useEffect(() => {
        if (sources != null) {
            const { sources: sourcesList }: SourcesList = JSON.parse(sources);
            setSubscriptionList((previousArray) =>
                previousArray.slice(previousArray.length).concat(sourcesList)
            );
            sourcesList.forEach((source: SourceData) => {
                const { name } = source;
                setCheckedState((previousObject) => ({
                    ...previousObject,
                    [name]: true,
                }));
            });
        }
    }, [sources]);

    const subscriptionOptions = Object.keys(subscriptionList).map(
        (origins: string, index: number) => {
            const { name }: SourceData = subscriptionList[index];
            return (
                <ListItemBox key={origins} onClick={changeDisplayFlag(name)}>
                    <div>{name || `blog_${index}`}</div>
                    <label
                        htmlFor="checkDisplay"
                        className="w-5 h-5 border rounded p-0.5 cursor-pointer"
                        onClick={changeDisplayFlag(name)}
                    >
                        <div
                            className={`w-full h-full ${
                                checkedState[name]
                                    ? "bg-white"
                                    : "bg-transparent"
                            }`}
                        />
                    </label>
                    <input
                        type="checkbox"
                        name="checkDisplay"
                        className="hidden"
                        value={name}
                        checked={checkedState[name] ?? true}
                        onChange={() => {}}
                    />
                </ListItemBox>
            );
        }
    );

    return (
        <section className="h-full">
            <ModalTemplate
                headingTitle={title}
                listItems={subscriptionOptions}
            />
            <div className="flex justify-evenly w-full">
                <Button type="button" customStyle="w-16" clickHandler={closeModal}>취소</Button>
                <Button type="button" customStyle="w-16 bg-blue-600 dark:bg-sky-600" clickHandler={closeModal}>
                    저장
                </Button>
            </div>
        </section>
    );
}
