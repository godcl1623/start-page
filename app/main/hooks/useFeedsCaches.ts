import { useCallback, useRef } from "react";
import { ParsedFeedsDataType } from "..";

interface Options {
    totalFeedsCount: number;
    currentPage: number;
}

export interface FeedsCache {
    [key: number]: ParsedFeedsDataType[];
}

interface CachesContainerValue {
    cache: FeedsCache;
    lastPage: number;
}

const CACHE_KEYS = ["default", "filtered"] as const;

type CacheKeys = (typeof CACHE_KEYS)[number];

type CachesContainer = Record<CacheKeys, CachesContainerValue>;

const DEFAULT_CACHE_DATA: CachesContainerValue = {
    cache: {},
    lastPage: 1,
};

const useFeedsCaches = ({ totalFeedsCount, currentPage }: Options) => {
    const caches = useRef<CachesContainer>({
        ...CACHE_KEYS.reduce<CachesContainer>(
            (resultObject: CachesContainer, cacheKey: CacheKeys) => ({
                ...resultObject,
                [cacheKey]: {
                    cache: {},
                    lastPage: 1,
                },
            }),
            {
                default: DEFAULT_CACHE_DATA,
                filtered: DEFAULT_CACHE_DATA,
            }
        ),
    });

    const initializeCache = useCallback(
        (indexList: number[], feedsList: ParsedFeedsDataType[]) => {
            Object.entries(caches.current).forEach(([cacheKey, cacheData]) => {
                indexList.forEach((pageIndex) => {
                    if (cacheKey === "basic") {
                        cacheData.cache[pageIndex] =
                            pageIndex === 1 ? feedsList : [];
                    } else {
                        cacheData.cache[pageIndex] = [];
                    }
                });
            });
        },
        [caches]
    );

    const initializeFilteredCache = useCallback(() => {
        caches.current.filtered.cache = {
            ...caches.current.filtered.cache,
            ...Array.from(
                { length: Math.ceil(totalFeedsCount / 10) },
                (_, k) => k + 1
            ).reduce(
                (result, pageIndex) => ({
                    ...result,
                    [pageIndex]: [],
                }),
                {}
            ),
        };
    }, [caches, totalFeedsCount]);

    const updateFeedsCache = useCallback(
        (
            feedsList: ParsedFeedsDataType[],
            cacheData: { cache: FeedsCache; lastPage: number }
        ) => {
            const { cache, lastPage } = cacheData;
            const pageNumber = currentPage > lastPage ? currentPage : lastPage;
            const currentPageList = cache[pageNumber];
            if (currentPageList?.length > 0) {
                const isListsIdentical = currentPageList.every(
                    (feedData, index) =>
                        Object.keys(feedData).every(
                            (dataKey) =>
                                feedData[dataKey] ===
                                feedsList[index]?.[dataKey]
                        )
                );
                if (!isListsIdentical) {
                    cache[pageNumber] = currentPageList
                        .slice(currentPageList.length)
                        .concat(feedsList);
                }
            } else {
                cache[pageNumber] = currentPageList
                    ?.slice(currentPageList.length)
                    .concat(feedsList);
            }
        },
        [currentPage]
    );

    return {
        cacheContainer: caches.current,
        initializeCache,
        initializeFilteredCache,
        updateFeedsCache,
    };
};

export default useFeedsCaches;

export const getLastPageOfConsecutiveList = (cacheData: FeedsCache) => {
    const firstEmptyPage = Object.entries(cacheData).find(
        ([_, cachedList]) => cachedList.length === 0
    )?.[0];
    return !Number.isNaN(firstEmptyPage) && Number(firstEmptyPage) > 1
        ? Number(firstEmptyPage) - 1
        : 1;
};
