import React from "react";
import Button from "./common/Button";
import ListItemBox from "./common/ListItemBox";
import ModalTemplate from "./common/ModalTemplate";
import { SourceStateType } from "hooks/useSourceFilters";

interface Props {
    displayState?: SourceStateType;
    closeModal: () => void;
    setDisplayFlag: (target: string, value: boolean) => void;
}

export default function FilterBySource({
    displayState,
    closeModal,
    setDisplayFlag,
}: Props) {
    if (displayState == null || Object.keys(displayState).length === 0) {
        return <></>;
    }

    const title = "표시할 출처를 선택해주세요";

    const changeDisplayFlag = (target: string, value: boolean) => () => {
        setDisplayFlag(target, value);
    };

    const subscriptionOptions = Object.keys(displayState).map(
        (origins: string, index: number) => {
            return (
                <ListItemBox
                    key={origins}
                    onClick={changeDisplayFlag(origins, !displayState[origins])}
                >
                    <div>{origins || `blog_${index}`}</div>
                    <label
                        htmlFor="checkDisplay"
                        className="w-5 h-5 border rounded p-0.5 cursor-pointer"
                        onClick={changeDisplayFlag(
                            origins,
                            !displayState[origins]
                        )}
                    >
                        <div
                            className={`w-full h-full ${
                                displayState[origins]
                                    ? "bg-white"
                                    : "bg-transparent"
                            }`}
                        />
                    </label>
                    <input
                        type="checkbox"
                        name="checkDisplay"
                        className="hidden"
                        value={origins}
                        checked={displayState[origins] ?? true}
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
                <Button
                    type="button"
                    customStyle="w-16"
                    clickHandler={closeModal}
                >
                    취소
                </Button>
                <Button
                    type="button"
                    customStyle="w-16 bg-blue-600 dark:bg-sky-600"
                    clickHandler={closeModal}
                >
                    저장
                </Button>
            </div>
        </section>
    );
}
