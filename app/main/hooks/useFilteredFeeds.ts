import { useCallback, useRef } from "react";
import useFeedsCaches, {
    FeedsCache,
    getLastPageOfConsecutiveList,
} from "./useFeedsCaches";
import { ParsedFeedsDataType, SourceDisplayState } from "..";

interface Options {
    totalFeedsCount: number;
    currentPage: number;
    commonFlagToChangeLogic: boolean;
}

const useFilteredFeeds = ({
    totalFeedsCount,
    currentPage,
    commonFlagToChangeLogic,
}: Options) => {
    const enabledFilters = useRef<
        ("favorite" | "source" | "texts" | "sorts")[]
    >([]);
    const {
        cacheContainer,
        initializeCache,
        initializeFilteredCache,
        updateFeedsCache,
    } = useFeedsCaches({
        totalFeedsCount,
        currentPage,
    });

    const getCachedFeedsToDisplay = useCallback(
        (feedsList: ParsedFeedsDataType[]) => {
            let cache: FeedsCache = cacheContainer.default.cache;
            let lastPage: number = 1;

            if (enabledFilters.current.length > 0) {
                cache = cacheContainer.filtered.cache;
                lastPage = cacheContainer.filtered.lastPage;
            } else {
                cache = cacheContainer.default.cache;
                lastPage = cacheContainer.default.lastPage;
            }
            updateFeedsCache(feedsList, { cache, lastPage });

            return cache;
        },
        [updateFeedsCache, cacheContainer]
    );

    const updateEnabledFilters = useCallback(
        (
            value: "favorite" | "source" | "texts" | "sorts",
            enable: "enable" | "disable" = "enable"
        ) => {
            const currentList = enabledFilters.current;
            if (enable === "enable") {
                if (!currentList.includes(value)) {
                    enabledFilters.current.push(value);
                } else {
                    enabledFilters.current = enabledFilters.current
                        .filter((enabledItem) => enabledItem !== value)
                        .concat([value]);
                }
            } else if (enable === "disable") {
                if (currentList.includes(value)) {
                    enabledFilters.current = enabledFilters.current.filter(
                        (enabledItem) => enabledItem !== value
                    );
                }
            }
        },
        []
    );

    const handleSourceFilter = useCallback(
        (lastDisplay: SourceDisplayState, newDisplay: SourceDisplayState) => {
            const lastDisplayState = JSON.stringify(lastDisplay);
            const newDisplayState = JSON.stringify(newDisplay);
            let lastPage: number = 1;
            switch (true) {
                case !Object.values(lastDisplay).includes(false) &&
                    lastDisplayState !== newDisplayState:
                    cacheContainer.default.lastPage =
                        getLastPageOfConsecutiveList(
                            cacheContainer.default.cache
                        );
                    initializeFilteredCache();
                    updateEnabledFilters("source");
                    break;
                case Object.values(lastDisplay).includes(false) &&
                    Object.values(newDisplay).includes(false) &&
                    lastDisplayState !== newDisplayState:
                    initializeFilteredCache();
                    cacheContainer.filtered.lastPage = 1;
                    updateEnabledFilters("source");
                    break;
                default:
                    cacheContainer.filtered.lastPage =
                        getLastPageOfConsecutiveList(
                            cacheContainer.filtered.cache
                        );
                    lastPage = commonFlagToChangeLogic
                        ? enabledFilters.current.length > 1
                            ? cacheContainer.filtered.lastPage > 0
                                ? cacheContainer.filtered.lastPage
                                : 1
                            : cacheContainer.default.lastPage
                        : 1;
                    updateEnabledFilters("source", "disable");
                    break;
            }
            return lastPage;
        },
        [
            cacheContainer,
            commonFlagToChangeLogic,
            updateEnabledFilters,
            initializeFilteredCache,
        ]
    );

    const handleSearchTextsFilter = useCallback(
        (
            searchContainer: { [key: string]: string },
            target: string,
            value: string
        ) => {
            let lastPage: number = 1;
            switch (true) {
                case Object.values(searchContainer).every(
                    (searchText: string) => searchText.length === 0
                ) && value.length >= 2:
                    cacheContainer.default.lastPage =
                        getLastPageOfConsecutiveList(
                            cacheContainer.default.cache
                        );
                    initializeFilteredCache();
                    updateEnabledFilters("texts");
                    break;
                case Object.values(searchContainer).some(
                    (searchText: string) => searchText.length >= 2
                ) &&
                    value.length >= 2 &&
                    searchContainer[target] !== value:
                    initializeFilteredCache();
                    cacheContainer.filtered.lastPage = 1;
                    updateEnabledFilters("texts");
                    break;
                case value === "":
                    initializeFilteredCache();
                    cacheContainer.filtered.lastPage = 1;
                    lastPage = commonFlagToChangeLogic
                        ? enabledFilters.current.length > 1
                            ? cacheContainer.filtered.lastPage > 0
                                ? cacheContainer.filtered.lastPage
                                : 1
                            : cacheContainer.default.lastPage
                        : 1;
                    updateEnabledFilters("texts", "disable");
                    break;
                default:
                    cacheContainer.filtered.lastPage =
                        getLastPageOfConsecutiveList(
                            cacheContainer.filtered.cache
                        );
                    lastPage =
                        commonFlagToChangeLogic &&
                        cacheContainer.filtered.lastPage > 1
                            ? cacheContainer.filtered.lastPage
                            : 1;
                    updateEnabledFilters("texts");
                    break;
            }
            // setCurrentPage(lastPage);
            // setSearchTexts(target, value);
            return lastPage;
        },
        [
            cacheContainer,
            commonFlagToChangeLogic,
            updateEnabledFilters,
            initializeFilteredCache,
        ]
    );

    const handleSortFilter = useCallback(
        (stateStringArray: string[], stateString: string) => {
            let lastPage: number = 1;
            let newSort: number = 0;
            if (stateStringArray.includes(stateString)) {
                const stateIndex = stateStringArray.indexOf(stateString);
                if (stateIndex > 0) {
                    const filledBasicCacheList = getLastPageOfConsecutiveList(
                        cacheContainer.default.cache
                    );
                    if (
                        cacheContainer.default.lastPage !== filledBasicCacheList
                    ) {
                        cacheContainer.default.lastPage = filledBasicCacheList;
                    }
                    initializeFilteredCache();
                    cacheContainer.filtered.lastPage = 1;
                    updateEnabledFilters("sorts");
                } else {
                    lastPage = commonFlagToChangeLogic
                        ? enabledFilters.current.length > 1
                            ? cacheContainer.filtered.lastPage > 0
                                ? cacheContainer.filtered.lastPage
                                : 1
                            : cacheContainer.default.lastPage
                        : 1;
                    updateEnabledFilters("sorts", "disable");
                }
                // setCurrentPage(lastPage);
                // setCurrentSort(stateIndex);
                newSort = stateIndex;
            } else {
                // setCurrentSort(0);
            }
            return { lastPage, newSort };
        },
        [
            cacheContainer,
            commonFlagToChangeLogic,
            updateEnabledFilters,
            initializeFilteredCache,
        ]
    );

    const handleFavoritesFilter = useCallback(
        (favoriteFlag: boolean) => {
            let lastPage: number = 1;
            if (!favoriteFlag) {
                cacheContainer.default.lastPage = getLastPageOfConsecutiveList(
                    cacheContainer.default.cache
                );
                initializeFilteredCache();
                updateEnabledFilters("favorite");
            } else {
                cacheContainer.filtered.lastPage = getLastPageOfConsecutiveList(
                    cacheContainer.filtered.cache
                );
                lastPage = commonFlagToChangeLogic
                    ? enabledFilters.current.length > 1
                        ? cacheContainer.filtered.lastPage > 0
                            ? cacheContainer.filtered.lastPage
                            : 1
                        : cacheContainer.default.lastPage
                    : 1;
                updateEnabledFilters("favorite", "disable");
            }
            // setCurrentPage(lastPage);
            return lastPage;
        },
        [
            cacheContainer,
            commonFlagToChangeLogic,
            updateEnabledFilters,
            initializeFilteredCache,
        ]
    );

    return {
        initializeCache,
        getCachedFeedsToDisplay,
        handleFavoritesFilter,
        handleSearchTextsFilter,
        handleSortFilter,
        handleSourceFilter,
        cacheContainer,
        enabledFilters
    };
};

export default useFilteredFeeds;
