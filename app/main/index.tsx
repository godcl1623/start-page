"use client";

import MainView from "./MainView";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import useFilters from "hooks/useFilters";
import { SEARCH_OPTIONS } from "components/feeds/FilterByText";
import { SORT_STANDARD } from "common/constants";
import RequestControllers from "controllers/requestControllers";
import { generateSearchParameters } from "controllers/utils";
import { SearchEnginesData } from "controllers/searchEngines";
import useResizeEvent from "hooks/useResizeEvent";

export interface ParsedFeedsDataType {
    id: string;
    title: string | null;
    description: string | null;
    link: string | null;
    pubDate: string | null;
    origin: string | null;
    isRead: boolean | null;
    isFavorite: boolean | null;
    [key: string]: number | string | boolean | null;
}

export interface ParseResultType {
    id: number;
    originName: string | null;
    originLink: string | null;
    lastFeedsLength: number;
    latestFeedTitle: string | null;
    feeds?: ParsedFeedsDataType[];
}

interface MainProps {
    feeds: string;
    sources: string;
    userId: string;
    isLocal: boolean;
}

interface PageParamData {
    data: ParsedFeedsDataType[];
    count: number;
    updated: number;
}

interface FeedsCache {
    [key: number]: ParsedFeedsDataType[];
}

export interface ErrorResponse {
    error: string;
    status: number;
}

export interface SourceDisplayState {
    [key: string]: boolean;
}

export const STATE_MESSAGE_STRINGS: { [key: string]: string } = {
    start: "피드 갱신을 시작합니다.",
    proceed: "피드 갱신을 진행중입니다.",
    no_change: "새로운 피드가 없습니다.",
    added: "개의 새로운 피드가 추가되었습니다.",
    end: "피드 갱신이 완료되었습니다.",
} as const;

export const ERROR_MESSAGE_STRINGS: { [key: string]: string } = {
    err_no_source: "구독 중인 사이트가 존재하지 않습니다.",
    err_renew_req_failed: "피드 갱신 요청이 실패했습니다.",
    err_unexpected: "오류가 발생했습니다.",
} as const;

export const DEFAULT_CARD_DATA: ParsedFeedsDataType = {
    description: "",
    id: "",
    isFavorite: false,
    isRead: false,
    link: "",
    origin: "",
    pubDate: "1900-01-01",
    title: "",
};

export default function MainPage({
    feeds,
    sources,
    userId,
    isLocal,
}: Readonly<MainProps>) {
    const { getDataFrom } = new RequestControllers();
    const [currentSort, setCurrentSort] = useState(0);
    const [isFilterFavorite, setIsFilterFavorite] = useState<boolean>(false);
    const [observerElement, setObserverElement] =
        useState<HTMLDivElement | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [renewState, setRenewState] = useState<string>(
        STATE_MESSAGE_STRINGS.start
    );
    const abortControllerRef = useRef<AbortController | null>(null);
    const [sourceDisplayState, setSourceDisplayState] = useFilters(
        sources,
        true
    );
    const [searchTexts, setSearchTexts] = useFilters(
        JSON.stringify(Object.values(SEARCH_OPTIONS)),
        ""
    );
    const { data: searchEnginesList } = useQuery({
        queryKey: [`/search_engines?userId=${userId}`],
        queryFn: () =>
            isLocal
                ? null
                : getDataFrom<SearchEnginesData[] | ErrorResponse>(
                      `/search_engines?userId=${userId}`
                  ),
    });

    const [feedsToDisplay, setFeedsToDisplay] = useState<ParsedFeedsDataType[]>(
        []
    );
    const queryParameters = useRef<string>("");
    const basicCache = useRef<FeedsCache>({});
    const favoriteCache = useRef<FeedsCache>({});
    const sourceCache = useRef<FeedsCache>({});
    const textsCache = useRef<FeedsCache>({});
    const sortsCache = useRef<FeedsCache>({});
    const lastPageParam = useRef<{
        basic: number;
        favorite: number;
        source: number;
        texts: number;
        sorts: number;
    }>({
        basic: 1,
        favorite: 1,
        source: 1,
        texts: 1,
        sorts: 1,
    });
    const queryFn = useCallback(
        ({ pageParam }: { pageParam: number }) =>
            getDataFrom<string>(
                `/feeds?userId=${userId}${queryParameters.current}&page=${pageParam}`
            ),
        [getDataFrom, userId]
    );
    const {
        data: storedFeed,
        refetch: refetchStoredFeeds,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [
            `/feeds?userId=${userId}${queryParameters.current}&page=${currentPage}`,
        ],
        initialPageParam: currentPage,
        queryFn,
        getNextPageParam: (lastPage) => {
            if (lastPage === "" || !JSON.parse(lastPage).data) return 1;
            const totalCount = JSON.parse(lastPage)?.count;
            if (currentPage >= Math.ceil(totalCount / 10)) return;
            return currentPage + 1;
        },
        getPreviousPageParam: () => {
            if (currentPage <= 0) return;
            return currentPage - 1;
        },
    });
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
                    (feedData, index) => feedData.id === feedsList[index]?.id
                );
                if (!isListsIdentical) {
                    cache[pageNumber] = currentPageList
                        .slice(currentPageList.length)
                        .concat(feedsList);
                }
            } else {
                cache[pageNumber] = currentPageList
                    .slice(currentPageList.length)
                    .concat(feedsList);
            }
        },
        [currentPage]
    );
    const updateFeedsToDisplay = useCallback(
        (cache: FeedsCache) => {
            if (isMobileLayout) {
                const joinedList = Object.values(cache)
                    .filter(
                        (feedListPerPage: any[]) => feedListPerPage?.length > 0
                    )
                    .reduce((acc, x) => acc?.concat(x), []);
                setFeedsToDisplay(joinedList);
            } else {
                setFeedsToDisplay(cache[currentPage]);
            }
        },
        [isMobileLayout, currentPage]
    );
    const filterBySources = useCallback(
        (newDisplay: SourceDisplayState) => {
            const lastDisplayState = JSON.stringify(sourceDisplayState);
            const newDisplayState = JSON.stringify(newDisplay);
            let lastPage: number = 1;
            switch (true) {
                case !Object.values(sourceDisplayState).includes(false) &&
                    lastDisplayState !== newDisplayState:
                    lastPageParam.current.basic = Object.values(
                        basicCache.current
                    ).filter((cachedList) => cachedList.length > 0).length;
                    lastPage = 1;
                    break;
                case Object.values(sourceDisplayState).includes(false) &&
                    Object.values(newDisplay).includes(false) &&
                    lastDisplayState !== newDisplayState:
                    sourceCache.current = {
                        ...sourceCache.current,
                        ...Array.from(
                            { length: Math.ceil(totalCount / 10) },
                            (_, k) => k + 1
                        ).reduce(
                            (result, pageIndex) => ({
                                ...result,
                                [pageIndex]: [],
                            }),
                            {}
                        ),
                    };
                    lastPageParam.current.source = 1;
                    lastPage = 1;
                    break;
                default:
                    lastPageParam.current.source = Object.values(
                        sourceCache.current
                    ).filter((cachedList) => cachedList.length > 0).length;
                    lastPage =
                        lastPageParam.current.basic > 1
                            ? lastPageParam.current.basic
                            : 1;
                    break;
            }
            setCurrentPage(lastPage);
        },
        [sourceDisplayState, totalCount]
    );
    const filterBySearchTexts = useCallback(
        (target: string, value: string) => {
            let lastPage: number = 1;
            switch (true) {
                case Object.values(searchTexts).every(
                    (searchText: string) => searchText.length === 0
                ) && value.length >= 2:
                    lastPageParam.current.basic = Object.values(
                        basicCache.current
                    ).filter((cachedList) => cachedList.length > 0).length;
                    lastPage = 1;
                    break;
                case Object.values(searchTexts).some(
                    (searchText: string) => searchText.length >= 2
                ) &&
                    value.length >= 2 &&
                    searchTexts[target] !== value:
                    textsCache.current = {
                        ...textsCache.current,
                        ...Array.from(
                            { length: Math.ceil(totalCount / 10) },
                            (_, k) => k + 1
                        ).reduce(
                            (result, pageIndex) => ({
                                ...result,
                                [pageIndex]: [],
                            }),
                            {}
                        ),
                    };
                    lastPageParam.current.texts = 1;
                    lastPage = 1;
                    break;
                case value === "":
                    textsCache.current = {
                        ...textsCache.current,
                        ...Array.from(
                            { length: Math.ceil(totalCount / 10) },
                            (_, k) => k + 1
                        ).reduce(
                            (result, pageIndex) => ({
                                ...result,
                                [pageIndex]: [],
                            }),
                            {}
                        ),
                    };
                    lastPageParam.current.texts = 1;
                    lastPage = lastPageParam.current.basic;
                    break;
                default:
                    lastPageParam.current.texts = Object.values(
                        textsCache.current
                    ).filter((cachedList) => cachedList.length > 0).length;
                    lastPage =
                        lastPageParam.current.texts > 1
                            ? lastPageParam.current.texts
                            : 1;
                    break;
            }
            setCurrentPage(lastPage);
            setSearchTexts(target, value);
        },
        [setSearchTexts, searchTexts, totalCount]
    );
    const handleFeedsAndCache = useCallback(
        (feedsList: ParsedFeedsDataType[]) => {
            let cache: FeedsCache = basicCache.current;
            let lastPage: number = 1;
            switch (true) {
                case isFilterFavorite:
                    cache = favoriteCache.current;
                    lastPage = lastPageParam.current.favorite;
                    break;
                case Object.values(sourceDisplayState).includes(false):
                    cache = sourceCache.current;
                    lastPage = lastPageParam.current.source;
                    break;
                case Object.values(searchTexts).some(
                    (searchText: string) => searchText.length >= 2
                ):
                    cache = textsCache.current;
                    lastPage = lastPageParam.current.texts;
                    break;
                case currentSort > 0:
                    cache = sortsCache.current;
                    lastPage = lastPageParam.current.sorts;
                    break;
                default:
                    cache = basicCache.current;
                    lastPage = lastPageParam.current.basic;
                    break;
            }
            updateFeedsCache(feedsList, { cache, lastPage });
            updateFeedsToDisplay(cache);
        },
        [
            isFilterFavorite,
            updateFeedsCache,
            updateFeedsToDisplay,
            sourceDisplayState,
            searchTexts,
            currentSort,
        ]
    );
    const initializeCache = useCallback(
        (indexList: number[], feedsList: ParsedFeedsDataType[]) => {
            const cacheList = [
                basicCache.current,
                favoriteCache.current,
                sourceCache.current,
                textsCache.current,
                sortsCache.current,
            ];
            cacheList.forEach((cache, index) => {
                indexList.forEach((pageIndex) => {
                    if (index === 0) {
                        cache[pageIndex] = pageIndex === 1 ? feedsList : [];
                    } else {
                        cache[pageIndex] = [];
                    }
                });
            });
        },
        []
    );
    useEffect(() => {
        if (feeds) {
            const {
                data,
                count,
            }: { data: ParsedFeedsDataType[]; count: number } =
                JSON.parse(feeds);
            setTotalCount(count);
            const indexList = Array.from(
                { length: Math.ceil(count / 10) },
                (_, k) => k + 1
            );
            initializeCache(indexList, data);
        }
    }, [feeds, initializeCache]);
    useEffect(() => {
        queryParameters.current = generateSearchParameters({
            ...(isFilterFavorite && {
                favorites: isFilterFavorite,
            }),
            ...(Object.values(sourceDisplayState).includes(false) && {
                displayOption: JSON.stringify(sourceDisplayState),
            }),
            ...(Object.values(searchTexts).some(
                (searchText: string) => searchText.length >= 2
            ) && { textOption: JSON.stringify(searchTexts) }),
            ...(currentSort > 0 && { sortOption: currentSort }),
        });
    }, [isFilterFavorite, currentSort, searchTexts, sourceDisplayState]);
    useEffect(() => {
        if (storedFeed?.pages) {
            const { data, count } = JSON.parse(
                storedFeed.pages[storedFeed.pages.length - 1]
            );
            if (count != null) setTotalCount(count);
            if (data != null) {
                handleFeedsAndCache(data);
            }
        }
    }, [storedFeed, isMobileLayout, handleFeedsAndCache]);

    const checkAndUpdateNewFeeds = useCallback(async () => {
        try {
            setRenewState(STATE_MESSAGE_STRINGS.proceed);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;
            const newFeedsRequestResult = await getDataFrom<
                PageParamData | ErrorResponse
            >(`/feeds/new?userId=${userId}`, { signal });
            if (newFeedsRequestResult != null) {
                switch (true) {
                    case "data" in newFeedsRequestResult:
                        const { data, count, updated } = newFeedsRequestResult;
                        if (count !== totalCount) {
                            setTotalCount(count);
                        }
                        if (updated !== 0) {
                            setRenewState(
                                updated + STATE_MESSAGE_STRINGS.added
                            );
                        } else {
                            setRenewState(STATE_MESSAGE_STRINGS.end);
                        }
                        handleFeedsAndCache(data);
                        break;
                    case "error" in newFeedsRequestResult:
                        setRenewState(
                            STATE_MESSAGE_STRINGS[newFeedsRequestResult.error]
                        );
                        break;
                    default:
                        setRenewState(STATE_MESSAGE_STRINGS.no_change);
                        break;
                }
            } else {
                throw new Error("피드 갱신에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
        }
    }, [getDataFrom, handleFeedsAndCache, totalCount, userId]);

    const filterBySort = useCallback(
        (stateStringArray: string[]) => (stateString: string) => {
            let lastPage: number = 1;
            if (stateStringArray.includes(stateString)) {
                const stateIndex = stateStringArray.indexOf(stateString);
                if (stateIndex > 0) {
                    console.log("##### fired #####");
                    const filledBasicCacheList = Object.values(
                        basicCache.current
                    ).filter((cachedList) => cachedList.length > 0).length;
                    if (lastPageParam.current.basic !== filledBasicCacheList) {
                        lastPageParam.current.basic = filledBasicCacheList;
                    }
                    sortsCache.current = {
                        ...sortsCache.current,
                        ...Object.entries(sortsCache.current).reduce(
                            (result, [pageIndex]) => ({
                                ...result,
                                [pageIndex]: [],
                            }),
                            {}
                        ),
                    };
                    lastPageParam.current.sorts = 1;
                    lastPage = 1;
                } else {
                    lastPage = lastPageParam.current.basic;
                }
                setCurrentPage(lastPage);
                setCurrentSort(stateIndex);
            } else {
                setCurrentSort(0);
            }
        },
        []
    );

    const filterFavorites = () => {
        setIsFilterFavorite(!isFilterFavorite);
        let lastPage: number = 1;
        if (!isFilterFavorite) {
            lastPageParam.current.favorite = Object.values(
                favoriteCache.current
            ).filter(
                (cachedList: ParsedFeedsDataType[]) => cachedList.length > 0
            ).length;
            lastPage =
                lastPageParam.current.favorite > 1
                    ? lastPageParam.current.favorite
                    : 1;
        } else {
            lastPageParam.current.basic = Object.values(
                basicCache.current
            ).filter(
                (cachedList: ParsedFeedsDataType[]) => cachedList.length > 0
            ).length;
            lastPage =
                lastPageParam.current.basic > 1
                    ? lastPageParam.current.basic
                    : 1;
        }
        setCurrentPage(lastPage);
    };

    const updateObserverElement = (element: HTMLDivElement) => {
        setObserverElement(element);
    };

    const updateCurrentPage = (value: number | ((value: number) => number)) => {
        setCurrentPage(value);
    };

    const detectIfMobileLayout = useCallback(() => {
        if (document.documentElement.offsetWidth >= 768) {
            setIsMobileLayout(false);
        } else {
            setIsMobileLayout(true);
        }
    }, []);

    useResizeEvent(detectIfMobileLayout, true, [detectIfMobileLayout]);

    useEffect(() => {
        if (observerElement != null) {
            const observerOption: IntersectionObserverInit = {
                threshold: 0.5,
            };
            const observerCallback: IntersectionObserverCallback = (
                entries: IntersectionObserverEntry[]
            ) => {
                entries.forEach((entry: IntersectionObserverEntry) => {
                    if (entry.isIntersecting) {
                        if (hasNextPage) {
                            fetchNextPage();
                            setCurrentPage(
                                (previousValue) => previousValue + 1
                            );
                        }
                    }
                });
            };
            const observer = new IntersectionObserver(
                observerCallback,
                observerOption
            );
            observer.observe(observerElement);
            return () => observer.unobserve(observerElement);
        }
    }, [observerElement, hasNextPage]);

    useEffect(() => {
        if (abortControllerRef.current) {
            const controller = abortControllerRef.current;
            return () => {
                controller.abort();
            };
        }
    }, [renewState]);

    return (
        <MainView
            feedsFromServer={feedsToDisplay}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
            filterBySort={filterBySort(SORT_STANDARD)}
            totalCount={totalCount}
            isMobileLayout={isMobileLayout}
            sources={sources}
            sourceDisplayState={sourceDisplayState}
            setSourceDisplayState={setSourceDisplayState}
            userId={userId}
            updateObserverElement={updateObserverElement}
            refetchStoredFeeds={refetchStoredFeeds}
            filterBySearchTexts={filterBySearchTexts}
            filterFavorites={filterFavorites}
            renewState={renewState}
            isFilterFavorite={isFilterFavorite}
            searchEnginesList={searchEnginesList}
            checkAndUpdateNewFeeds={checkAndUpdateNewFeeds}
            filterBySources={filterBySources}
        />
    );
}
