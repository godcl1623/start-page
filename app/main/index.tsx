"use client";

import MainView from "./MainView";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import useFilters from "hooks/useFilters";
import { SEARCH_OPTIONS } from "components/feeds/FilterByText";
import { SORT_STANDARD } from "common/constants";
import { setCookie } from "cookies-next";
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
    const [formerFeedsList, setFormerFeedsList] = useState<FeedsCache>({});
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
    const {
        data: storedFeed,
        refetch: refetchStoredFeeds,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [
            `/feeds?userId=${userId}`,
            { isMobileLayout, currentPage, sourceDisplayState },
        ],
        initialPageParam: currentPage,
        queryFn: ({ pageParam }) =>
            isLocal
                ? "{}"
                : getDataFrom<string>(
                      `/feeds?userId=${userId}${generateSearchParameters({
                          ...(isFilterFavorite && {
                              favorites: isFilterFavorite,
                          }),
                          ...(Object.values(sourceDisplayState).includes(
                              false
                          ) && {
                              displayOption: JSON.stringify(sourceDisplayState),
                          }),
                          ...(Object.values(searchTexts).some(
                              (searchText: string) => searchText.length >= 2
                          ) && { textOption: JSON.stringify(searchTexts) }),
                          ...(currentSort > 0 && { sortOption: currentSort }),
                          page: pageParam,
                      })}`
                  ),
        getNextPageParam: (lastPage: string) => {
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
    const feedsFromServer = isMobileLayout
        ? (Object.values(formerFeedsList) as any[])
              .filter((feedListPerPage: any[]) => feedListPerPage?.length > 0)
              .reduce((acc, x) => acc?.concat(x), [])
        : formerFeedsList[currentPage];

    const checkAndUpdateNewFeeds = async () => {
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
                        updateFormerFeedsList(data);
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
    };

    const updateFormerFeedsList = (feedsList: ParsedFeedsDataType[]) => {
        setFormerFeedsList(
            (previousObject: { [key in number]: ParsedFeedsDataType[] }) => {
                if (previousObject[currentPage] != null) {
                    if (
                        currentPage > 1 &&
                        previousObject[currentPage - 1].length > 0 &&
                        previousObject[currentPage - 1].every(
                            (feed: ParsedFeedsDataType, index: number) =>
                                feed.id === feedsList[index]?.id
                        )
                    ) {
                        return previousObject;
                    }
                    return {
                        ...previousObject,
                        [currentPage]: previousObject[currentPage]
                            ?.slice(previousObject[currentPage].length)
                            .concat(feedsList),
                    };
                } else {
                    return {
                        [currentPage]: feedsList,
                    };
                }
            }
        );
    };

    const setSortState = useCallback(
        (stateStringArray: string[]) => (stateString: string) => {
            if (stateStringArray.includes(stateString)) {
                setCurrentSort(stateStringArray.indexOf(stateString));
            } else {
                setCurrentSort(0);
            }
        },
        []
    );

    const filterFavorites = () => {
        setIsFilterFavorite(!isFilterFavorite);
        setCurrentPage(1);
        refetchStoredFeeds();
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
        if (feeds) {
            const {
                data,
                count,
            }: { data: ParsedFeedsDataType[]; count: number } =
                JSON.parse(feeds);
            setTotalCount(count);
            Array.from({ length: Math.ceil(count / 10) }, (v, k) =>
                setFormerFeedsList((previousObject: any) => ({
                    ...previousObject,
                    [k + 1]: [],
                }))
            );
            updateFormerFeedsList(data);
        }
    }, [feeds]);

    useEffect(() => {
        if (storedFeed?.pages) {
            const { data, count } = JSON.parse(
                storedFeed.pages[storedFeed.pages.length - 1]
            );
            if (count != null) setTotalCount(count);
            if (data != null) updateFormerFeedsList(data);
        }
    }, [storedFeed, isMobileLayout]);

    useEffect(() => {
        refetchStoredFeeds();
    }, [
        isFilterFavorite,
        searchTexts,
        currentPage,
        isMobileLayout,
        currentSort,
    ]);

    useEffect(() => {
        if (isMobileLayout) {
            const firstEmptyPageIndex = (
                Object.values(formerFeedsList) as any[]
            ).findIndex((value: any[]) => value?.length === 0);
            setCurrentPage(firstEmptyPageIndex);
            Object.keys(formerFeedsList).forEach((key: string, index) => {
                if (index > firstEmptyPageIndex) {
                    setFormerFeedsList((previousObject: any) => ({
                        ...previousObject,
                        [key]: [],
                    }));
                }
            });
        } else {
            const fetchedPages = (
                Object.values(formerFeedsList) as any[]
            ).reduce(
                (totalNumber: number, currentDataArray: any[]) =>
                    currentDataArray?.length > 0
                        ? (totalNumber += 1)
                        : totalNumber,
                0
            );
            setCurrentPage(fetchedPages > 0 ? fetchedPages : 1);
        }
    }, [isMobileLayout]);

    useEffect(() => {
        if (typeof window !== "undefined" && observerElement != null) {
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
            feedsFromServer={feedsFromServer}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
            setSortState={setSortState(SORT_STANDARD)}
            totalCount={totalCount}
            isMobileLayout={isMobileLayout}
            sources={sources}
            sourceDisplayState={sourceDisplayState}
            setSourceDisplayState={setSourceDisplayState}
            userId={userId}
            updateObserverElement={updateObserverElement}
            refetchStoredFeeds={refetchStoredFeeds}
            setSearchTexts={setSearchTexts}
            filterFavorites={filterFavorites}
            renewState={renewState}
            isFilterFavorite={isFilterFavorite}
            searchEnginesList={searchEnginesList}
            checkAndUpdateNewFeeds={checkAndUpdateNewFeeds}
        />
    );
}
