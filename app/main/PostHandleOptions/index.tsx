import { SORT_STANDARD } from "common/constants";
import FilterByText from "components/feeds/FilterByText";
import { memo, useMemo } from "react";
import { ModalKeys } from "../MainView";
import SubscriptionOptions from "./SubscriptionOptions";
import SelectDiv from "components/common/SelectDiv";
import { FilterType } from 'hooks/useFilters';

interface Props {
    handleClick: (target: ModalKeys) => () => void;
    filterFavorites: () => void;
    filterBySearchTexts: (target: string, value: string) => void;
    filterBySort: (stateString: string) => void;
    isFilterFavorite: boolean;
    isFilterSources: boolean;
    isFilterTexts: boolean;
    isFilterSorts: boolean;
    searchTexts: FilterType<string>;
}

export default memo(function PostHandleOptions({
    handleClick,
    filterFavorites,
    filterBySearchTexts,
    filterBySort,
    isFilterFavorite,
    isFilterSources,
    isFilterSorts,
    isFilterTexts,
    searchTexts
}: Props) {
    const subscriptionOptions = useMemo(
        () => (
            <SubscriptionOptions
                filterFavorites={filterFavorites}
                handleClick={handleClick}
                isFilterFavorite={isFilterFavorite}
                isFilterSources={isFilterSources}
            />
        ),
        [filterFavorites, handleClick, isFilterFavorite, isFilterSources]
    );
    const filterByText = useMemo(
        () => (
            <FilterByText
                setTextFilter={filterBySearchTexts}
                customStyle={`${isFilterTexts ? "" : ""}`}
                searchTexts={searchTexts}
            />
        ),
        [filterBySearchTexts, isFilterTexts, searchTexts]
    );
    const selectBox = useMemo(
        () => (
            <SelectDiv
                optionValues={SORT_STANDARD}
                customStyles={`max-h-8 rounded-md shadow-md bg-neutral-50 text-xs dark:shadow-zinc-600 md:w-[20%] z-10 ${
                    isFilterSorts ? "" : ""
                }`}
                filterBySort={filterBySort}
            />
        ),
        [filterBySort, isFilterSorts]
    );
    return (
        <div className="flex flex-col justify-between gap-1 w-full h-40 mb-4 xs:gap-0.5 xs:h-32 md:flex-row md:gap-0 md:h-8">
            {subscriptionOptions}
            {filterByText}
            {selectBox}
        </div>
    );
});
