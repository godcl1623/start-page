import { SORT_STANDARD } from "common/constants";
import FilterByText from "components/feeds/FilterByText";
import { memo, useMemo } from "react";
import { ModalKeys } from '../MainView';
import SubscriptionOptions from "./SubscriptionOptions";
import SelectDiv from 'components/common/SelectDiv';

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
                customStyles="rounded-md shadow-md bg-white text-xs dark:shadow-zinc-600 md:w-[20%]"
                setSortState={setSortState}
            />
        ),
        []
    );
    return (
        <section className="w-full">
            <section className="flex flex-col justify-between gap-1 w-full h-36 mb-4 md:flex-row md:gap-0 xs:h-28 md:h-8">
                {subscriptionOptions}
                {filterByText}
                {selectBox}
            </section>
        </section>
    );
});
