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
import {
    FeedsCache,
    getLastPageOfConsecutiveList,
} from "./hooks/useFeedsCaches";
import useObserveElement from "./hooks/useObserveElement";
import useFilteredFeeds from "./hooks/useFilteredFeeds";

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
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [renewState, setRenewState] = useState<string>(
        STATE_MESSAGE_STRINGS.start
    );
    const [feedsToDisplay, setFeedsToDisplay] = useState<ParsedFeedsDataType[]>(
        []
    );

    const queryParameters = useRef<string>("");
    const abortControllerRef = useRef<AbortController | null>(null);

    const {
        getCachedFeedsToDisplay,
        handleFavoritesFilter,
        handleSearchTextsFilter,
        handleSortFilter,
        handleSourceFilter,
        initializeCache,
    } = useFilteredFeeds({
        totalFeedsCount: totalCount,
        currentPage,
        commonFlagToChangeLogic: isMobileLayout,
    });
    const [sourceDisplayState, setSourceDisplayState] = useFilters(
        sources,
        true
    );
    const [searchTexts, setSearchTexts] = useFilters(
        JSON.stringify(Object.values(SEARCH_OPTIONS)),
        ""
    );

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

    const { data: searchEnginesList } = useQuery({
        queryKey: [`/search_engines?userId=${userId}`],
        queryFn: () =>
            isLocal
                ? null
                : getDataFrom<SearchEnginesData[] | ErrorResponse>(
                      `/search_engines?userId=${userId}`
                  ),
    });

    const queryFn = useCallback(
        ({ pageParam }: { pageParam: number }) =>
            isLocal
                ? null
                : getDataFrom<string>(
                      `/feeds?userId=${userId}${queryParameters.current}&page=${pageParam}`
                  ),
        [getDataFrom, userId, isLocal]
    );
    const {
        data: storedFeed,
        refetch: refetchStoredFeeds,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [
            `/feeds?userId=${userId}${queryParameters.current}&page=${currentPage}`,
            { isFilterFavorite, sourceDisplayState, currentSort, searchTexts },
        ],
        initialPageParam: currentPage,
        queryFn,
        getNextPageParam: (lastPage) => {
            if (lastPage == null) return;
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
    const { updateObserverElement } = useObserveElement({
        callbackCondition: hasNextPage,
        callback: () => setCurrentPage((oldPage) => oldPage + 1),
    });

    const updateFeedsToDisplay = useCallback(
        (cache: FeedsCache) => {
            if (isMobileLayout) {
                const lastFilledPage = getLastPageOfConsecutiveList(cache);
                const joinedList = Object.values(cache)
                    .slice(0, lastFilledPage + 1)
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

    const handleFeedsAndCache = useCallback(
        (feedsList: ParsedFeedsDataType[]) => {
            const cache = getCachedFeedsToDisplay(feedsList);
            updateFeedsToDisplay(cache);
        },
        [updateFeedsToDisplay, getCachedFeedsToDisplay]
    );

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

    const filterBySources = useCallback(
        (newDisplay: SourceDisplayState) => {
            const lastPage = handleSourceFilter(sourceDisplayState, newDisplay);
            setCurrentPage(lastPage);
        },
        [sourceDisplayState, handleSourceFilter]
    );

    const filterBySearchTexts = useCallback(
        (target: string, value: string) => {
            const lastPage = handleSearchTextsFilter(
                searchTexts,
                target,
                value
            );
            setCurrentPage(lastPage);
            setSearchTexts(target, value);
        },
        [setSearchTexts, searchTexts, handleSearchTextsFilter]
    );

    const filterBySort = useCallback(
        (stateStringArray: string[]) => (stateString: string) => {
            const { lastPage, newSort } = handleSortFilter(
                stateStringArray,
                stateString
            );
            setCurrentPage(lastPage);
            setCurrentSort(newSort);
        },
        [handleSortFilter]
    );

    const filterFavorites = useCallback(() => {
        setIsFilterFavorite(!isFilterFavorite);
        const lastPage = handleFavoritesFilter(isFilterFavorite);
        setCurrentPage(lastPage);
    }, [isFilterFavorite, handleFavoritesFilter]);

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
                storedFeed.pages[storedFeed.pages.length - 1] ?? "{}"
            );
            if (count != null) setTotalCount(count);
            if (data != null) {
                handleFeedsAndCache(data);
            }
        }
    }, [storedFeed, isMobileLayout, handleFeedsAndCache]);

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
            isFilterBySorts={currentSort > 0}
            isFilterByTexts={Object.values(searchTexts).some(
                (searchText: string) => searchText.length >= 2
            )}
        />
    );
}
