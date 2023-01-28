// FIXME: 즐겨찾기, 출처별 필터 등 필터링 기능 작동 안함
// TODO: 페이지 네비게이터는 5개까지 + 맨 처음, 맨 마지막 페이지만 표시, 그 외는 줄임표로
import { useEffect, useState } from "react";
import RequestControllers from "controllers";
import { AxiosResponse } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import useFilters from "hooks/useFilters";
import { SEARCH_OPTIONS } from "components/feeds/FilterByText";
import MainPage from "components/main";
import { SORT_STANDARD } from 'common/constants';

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

interface IndexProps {
    feeds: string;
    sources: string;
}

interface RenewedFeedsData {
    data: ParsedFeedsDataType[];
    count: number;
}

export default function Index({ feeds, sources }: IndexProps) {
    const { getDataFrom } = new RequestControllers();
    const [currentSort, setCurrentSort] = useState(0);
    const [isFilterFavorite, setIsFilterFavorite] = useState<boolean>(false);
    const [observerElement, setObserverElement] =
        useState<HTMLDivElement | null>(null);
    const [newFeeds, setNewFeeds] = useState<ParsedFeedsDataType[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [formerFeedsList, setFormerFeedsList] = useState<any>({});
    const [sourceDisplayState, setSourceDisplayState] = useFilters(
        sources,
        true
    );
    const [searchTexts, setSearchTexts] = useFilters(
        JSON.stringify(Object.values(SEARCH_OPTIONS)),
        ""
    );
    const newFeedsRequestResult = useQuery<AxiosResponse<RenewedFeedsData>>(
        ["/feeds/new"],
        () => getDataFrom("/feeds/new")
    )?.data?.data;
    const {
        data: storedFeed,
        refetch: refetchStoredFeeds,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["/feeds", { isMobileLayout }],
        queryFn: ({ pageParam = currentPage }) =>
            getDataFrom("/feeds", {
                params: {
                    favorites: isFilterFavorite,
                    displayOption: sourceDisplayState,
                    textOption: searchTexts,
                    page: pageParam,
                },
            }),
        getNextPageParam: (lastPage) => {
            const totalCount = JSON.parse(lastPage.data).count;
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
              .filter((foo: any[]) => foo?.length > 0)
              .reduce((acc, x) => acc?.concat(x), [])
        : formerFeedsList[currentPage];

    const checkShouldSortByReverse = (sortState: number) => sortState === 1;
    const setSortState = (stateStringArray: string[]) => (stateString: string) => {
        if (stateStringArray.includes(stateString)) {
            setCurrentSort(stateStringArray.indexOf(stateString));
        } else {
            setCurrentSort(0);
        }
    };

    const filterFavorites = () => {
        setIsFilterFavorite(!isFilterFavorite);
    };

    const updateObserverElement = (element: HTMLDivElement) => {
        setObserverElement(element);
    };

    const updateCurrentPage = (value: number | ((value: number) => number)) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const callback = () => {
                if (window.innerWidth > 768) {
                    setIsMobileLayout(false);
                } else {
                    setIsMobileLayout(true);
                }
            };
            callback();
            window.addEventListener("resize", callback);
            return () => window.removeEventListener("resize", callback);
        }
    }, []);

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
            setNewFeeds((previousArray) =>
                previousArray.slice(previousArray.length).concat(data)
            );
        }
    }, [feeds]);

    useEffect(() => {
        if (storedFeed && storedFeed.pages) {
            const dataArray = JSON.parse(
                storedFeed.pages[storedFeed.pages.length - 1].data
            ).data;
            setNewFeeds((previousArray) =>
                previousArray.slice(previousArray.length).concat(dataArray)
            );
        }
    }, [storedFeed, isMobileLayout]);

    useEffect(() => {
        if (
            newFeedsRequestResult != null &&
            typeof newFeedsRequestResult !== "string"
        ) {
            const { count } = newFeedsRequestResult;
            if (count !== totalCount) setTotalCount(count);
        }
    }, [newFeedsRequestResult]);

    useEffect(() => {
        if (!isMobileLayout) {
            refetchStoredFeeds();
        }
    }, [isFilterFavorite, searchTexts, currentPage, isMobileLayout]);

    useEffect(() => {
        if (isMobileLayout) {
            const firstEmptyPageIndex = (
                Object.values(formerFeedsList) as any[]
            ).findIndex((value: any[]) => value.length === 0);
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
                    currentDataArray.length > 0
                        ? (totalNumber += 1)
                        : totalNumber,
                0
            );
            setCurrentPage(fetchedPages > 0 ? fetchedPages : 1);
        }
    }, [isMobileLayout]);

    useEffect(() => {
        const fetchedNewFeeds = newFeedsRequestResult
            ? newFeedsRequestResult?.data
            : newFeeds;
        setFormerFeedsList((previousObject: any) => ({
            ...previousObject,
            [currentPage]:
                previousObject[currentPage]?.length === 0
                    ? previousObject[currentPage]
                          ?.slice(previousObject[currentPage].length)
                          .concat(fetchedNewFeeds)
                    : previousObject[currentPage],
        }));
    }, [newFeedsRequestResult, newFeeds]);

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

    return (
        <MainPage
            feedsFromServer={feedsFromServer}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
            currentSort={currentSort}
            checkShouldSortByReverse={checkShouldSortByReverse}
            setSortState={setSortState(SORT_STANDARD)}
            totalCount={totalCount}
            isMobileLayout={isMobileLayout}
            sources={sources}
            sourceDisplayState={sourceDisplayState}
            setSourceDisplayState={setSourceDisplayState}
            updateObserverElement={updateObserverElement}
            refetchStoredFeeds={refetchStoredFeeds}
            setSearchTexts={setSearchTexts}
            filterFavorites={filterFavorites}
        />
    );
}

export async function getServerSideProps() {
    const { getDataFrom } = new RequestControllers();
    try {
        const { data: feeds } = await getDataFrom("/feeds");
        const { data: sources } = await getDataFrom("/sources");

        return {
            props: {
                feeds,
                sources,
            },
        };
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
    }
}
