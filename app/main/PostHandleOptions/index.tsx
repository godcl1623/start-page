import { SORT_STANDARD } from "common/constants";
import FilterByText from "components/feeds/FilterByText";
import { memo, useMemo } from "react";
import { ModalKeys } from "../MainView";
import SubscriptionOptions from "./SubscriptionOptions";
import SelectDiv from "components/common/SelectDiv";

interface Props {
    handleClick: (target: ModalKeys) => () => void;
    filterFavorites: () => void;
    setSearchTexts: (target: string, value: string) => void;
    setSortState: (stateString: string) => void;
}

export default memo(function PostHandleOptions({
    handleClick,
    filterFavorites,
    setSearchTexts,
    setSortState,
}: Props) {
    const subscriptionOptions = useMemo(
        () => (
            <SubscriptionOptions
                filterFavorites={filterFavorites}
                handleClick={handleClick}
            />
        ),
        [filterFavorites, handleClick]
    );
    const filterByText = useMemo(
        () => <FilterByText setTextFilter={setSearchTexts} />,
        [setSearchTexts]
    );
    const selectBox = useMemo(
        () => (
            <SelectDiv
                optionValues={SORT_STANDARD}
                customStyles="max-h-8 rounded-md shadow-md bg-neutral-50 text-xs dark:shadow-zinc-600 md:w-[20%]"
                setSortState={setSortState}
            />
        ),
        []
    );
    return (
        <div className="flex flex-col justify-between gap-1 w-full h-40 mb-4 xs:gap-0.5 xs:h-32 md:flex-row md:gap-0 md:h-8">
            {subscriptionOptions}
            {filterByText}
            {selectBox}
        </div>
    );
});
