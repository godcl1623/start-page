import { FilterType } from "hooks/useFilters";

import FilterBySourceView from "./FilterBySourceView";

interface Props {
    displayState?: FilterType<boolean>;
    closeModal: () => void;
    setDisplayFlag: (target: string, value: boolean) => void;
    refetchFeeds: () => void;
}

export default function FilterBySource({
    displayState,
    closeModal,
    setDisplayFlag,
    refetchFeeds,
}: Readonly<Props>) {
    if (displayState == null || Object.keys(displayState).length === 0) {
        return (
            <div className=" flex justify-center items-center h-40">
                구독 중인 사이트가 없습니다.
            </div>
        );
    }

    const changeDisplayFlag = (target: string, value: boolean) => {
        setDisplayFlag(target, value);
    };

    const enableDisplayFilter = (callback?: () => void) => () => {
        if (callback != null) {
            callback();
        }
        refetchFeeds();
        closeModal();
    };

    const initiateDisplayFilter = () => {
        Object.keys(displayState).forEach((key: string) =>
            setDisplayFlag(key, true)
        );
        closeModal();
    };

    return (
        <FilterBySourceView
            displayState={displayState}
            changeDisplayFlag={changeDisplayFlag}
            closeModal={closeModal}
            enableDisplayFilter={enableDisplayFilter}
            initiateDisplayFilter={initiateDisplayFilter}
        />
    );
}
