import { FilterType } from "hooks/useFilters";

import FilterBySourceView from "./FilterBySourceView";
import { SourceDisplayState } from "app/main";

interface Props {
    displayState?: FilterType<boolean>;
    closeModal: () => void;
    setDisplayFlag: (target: string, value: boolean) => void;
    updateSourceDisplay: (newSourceDisplay: SourceDisplayState) => void;
}

export default function FilterBySource({
    displayState,
    closeModal,
    setDisplayFlag,
    updateSourceDisplay,
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

    const enableDisplayFilter =
        (returnNewDisplayState?: () => [string, boolean][]) => () => {
            let newDisplayState: SourceDisplayState = {};
            if (returnNewDisplayState != null) {
                const newDisplayStateList = returnNewDisplayState();
                newDisplayState = newDisplayStateList.reduce(
                    (
                        totalStates: SourceDisplayState,
                        [sourceKey, displayState]: [string, boolean]
                    ) => ({ ...totalStates, [sourceKey]: displayState }),
                    {}
                );
            }
            updateSourceDisplay(newDisplayState);
            closeModal();
        };

    return (
        <FilterBySourceView
            displayState={displayState}
            changeDisplayFlag={changeDisplayFlag}
            closeModal={closeModal}
            enableDisplayFilter={enableDisplayFilter}
        />
    );
}
