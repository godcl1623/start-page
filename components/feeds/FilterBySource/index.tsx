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
}: Props) {
    if (displayState == null || Object.keys(displayState).length === 0) {
        return <></>;
    }

    const changeDisplayFlag = (target: string, value: boolean) => () => {
        setDisplayFlag(target, value);
    };

    const enableDisplayFilter = () => {
        closeModal();
        refetchFeeds();
    };

    const initiateDisplayFilter = () => {
        Object.keys(displayState).forEach((key: string) =>
            setDisplayFlag(key, true)
        );
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
