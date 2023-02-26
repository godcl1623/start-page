import React from "react";
import Search from "components/search";
import RequestControllers, { getUserId } from "controllers";
import Card from "components/card";
import { ParsedFeedsDataType } from "types/global";
import { handleSort } from "common/helpers";
import { SORT_STANDARD, SORT_STANDARD_STATE } from "common/constants";
import SelectBox from "components/common/SelectBox";
import { AxiosResponse } from "axios";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import FilterBySource from "components/feeds/FilterBySource";
import useFilters from "hooks/useFilters";
import FilterByText from "components/feeds/FilterByText";
import { SEARCH_OPTIONS } from "components/feeds/FilterByText";
import { GetServerSidePropsContext } from "next";
import { encryptCookie, checkIfCookieExists } from "controllers";
import { setCookie, getCookie } from "cookies-next";
import { decryptCookie } from 'controllers';
import CryptoJS from 'crypto-js';

interface IndexProps {
    feeds: string;
    sources: string;
}

interface RenewedFeedsData {
    data: ParsedFeedsDataType[];
    count: number;
}

type ModalKeys = "addSubscription" | "cancelSubscription" | "filterBySource";

type ModalStateType = {
    [key in ModalKeys]: boolean;
};

export default function Index({ feeds, sources }: IndexProps) {
    const { getDataFrom } = new RequestControllers();
    const [currentSort, setCurrentSort] = React.useState(0);
    const [modalState, setModalState] = React.useState<ModalStateType>({
        addSubscription: false,
        cancelSubscription: false,
        filterBySource: false,
    });
    const [observerElement, setObserverElement] =
        React.useState<HTMLDivElement | null>(null);
    const [isFilterFavorite, setIsFilterFavorite] =
        React.useState<boolean>(false);
    const [newFeeds, setNewFeeds] = React.useState<ParsedFeedsDataType[]>([]);
    const [totalCount, setTotalCount] = React.useState<number>(0);
    const [isMobileLayout, setIsMobileLayout] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [formerFeedsList, setFormerFeedsList] = React.useState<any>({});
    const [rawCookie, setRawCookie] = React.useState('');
    const [sourceDisplayState, setSourceDisplayState] = useFilters(
        sources,
        true
    );
    const [searchTexts, setSearchTexts] = useFilters(
        JSON.stringify(Object.values(SEARCH_OPTIONS)),
        ""
    );
    const startPageRef = React.useRef<HTMLElement | null>(null);
    const newFeedsRequestResult = useQuery<AxiosResponse<RenewedFeedsData>>(
        [`/feeds/new?mw=${rawCookie}`],
        () => getDataFrom(`/feeds/new?mw=${rawCookie}`)
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
    const setSortState = (stateString: string, stateStringArray: string[]) => {
        if (stateStringArray.includes(stateString)) {
            setCurrentSort(stateStringArray.indexOf(stateString));
        } else {
            setCurrentSort(0);
        }
    };

    const handleClick = (target: ModalKeys) => () => {
        document.documentElement.scrollTo({ top: 0 });
        closeModal(target, !modalState[target])();
    };

    const closeModal =
        (target: ModalKeys, lastModalState = false) =>
        () => {
            setModalState((modalStateObject) => ({
                ...modalStateObject,
                [target]: lastModalState,
            }));
        };

    const filterFavorites = () => {
        setIsFilterFavorite(!isFilterFavorite);
    };

    React.useEffect(() => {
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

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (storedFeed && storedFeed.pages) {
            const dataArray = JSON.parse(
                storedFeed.pages[storedFeed.pages.length - 1].data
            ).data;
            setNewFeeds((previousArray) =>
                previousArray.slice(previousArray.length).concat(dataArray)
            );
        }
    }, [storedFeed, isMobileLayout]);

    React.useEffect(() => {
        if (
            newFeedsRequestResult != null &&
            typeof newFeedsRequestResult !== "string"
        ) {
            const { count } = newFeedsRequestResult;
            if (count !== totalCount) setTotalCount(count);
        }
    }, [newFeedsRequestResult]);

    React.useEffect(() => {
        if (modalState.addSubscription || modalState.cancelSubscription) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [modalState, startPageRef]);

    React.useEffect(() => {
        if (!isMobileLayout) {
            refetchStoredFeeds();
        }
    }, [isFilterFavorite, searchTexts, currentPage, isMobileLayout]);

    React.useEffect(() => {
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
                    currentDataArray?.length > 0
                        ? (totalNumber += 1)
                        : totalNumber,
                0
            );
            setCurrentPage(fetchedPages > 0 ? fetchedPages : 1);
        }
    }, [isMobileLayout]);

    React.useEffect(() => {
        const doh = newFeedsRequestResult
            ? newFeedsRequestResult?.data
            : newFeeds;
        setFormerFeedsList((previousObject: any) => ({
            ...previousObject,
            [currentPage]:
                previousObject[currentPage]?.length === 0
                    ? previousObject[currentPage]
                          ?.slice(previousObject[currentPage].length)
                          .concat(doh)
                    : previousObject[currentPage],
        }));
    }, [newFeedsRequestResult, newFeeds]);

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const userCookie = getCookie('mw');
            if (userCookie && typeof userCookie === 'string') {
                setRawCookie(userCookie);
            }
        }
    }, []);

    const feedsToDisplay = feedsFromServer
        ? feedsFromServer
              ?.sort(
                  handleSort(
                      SORT_STANDARD_STATE[currentSort],
                      checkShouldSortByReverse(currentSort)
                  )
              )
              .map((feed: ParsedFeedsDataType) => (
                  <Card
                      cardData={feed}
                      key={feed.id}
                      refetchFeeds={refetchStoredFeeds}
                  />
              ))
        : [];

    const pageIndicator = Array.from(
        { length: Math.ceil(totalCount / 10) },
        (v, k) => k + 1
    ).map((pageIndex: number) => (
        <li
            key={`page_${pageIndex}`}
            className="list-none"
            onClick={() => {
                setCurrentPage(pageIndex);
            }}
        >
            <button
                className={`${
                    currentPage === pageIndex ? "text-blue-500 font-bold" : ""
                }`}
            >
                {pageIndex}
            </button>
        </li>
    ));

    return (
        <article
            className="flex-center flex-col w-full h-max min-h-full bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
            ref={startPageRef}
        >
            <section className="flex-center w-full h-1/3 my-32 md:w-[768px]">
                <Search />
            </section>
            <section className="flex flex-col items-center w-full h-max md:w-[768px]">
                <section>
                    <section className="flex justify-between h-8 mb-4">
                        <section>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("addSubscription")}
                            >
                                구독 추가
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("cancelSubscription")}
                            >
                                구독 취소
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={filterFavorites}
                            >
                                즐겨찾기
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("filterBySource")}
                            >
                                출처별 필터
                            </button>
                        </section>
                        <FilterByText setTextFilter={setSearchTexts} />
                        <SelectBox
                            optionValues={SORT_STANDARD}
                            customStyles="rounded-md shadow-md text-xs dark:shadow-zinc-600"
                            setSortState={setSortState}
                        />
                    </section>
                </section>
                <section>{feedsToDisplay}</section>
                {isMobileLayout ? (
                    <div
                        ref={setObserverElement}
                        className="w-full h-[150px]"
                    />
                ) : (
                    <ul className="flex justify-evenly items-center w-1/2 mt-10 mb-20">
                        <button
                            onClick={() => {
                                if (currentPage !== 1) {
                                    setCurrentPage(
                                        (previousValue) => previousValue - 1
                                    );
                                }
                            }}
                        >
                            &lt;
                        </button>
                        {pageIndicator}
                        <button
                            onClick={() => {
                                if (
                                    Math.ceil(totalCount / 10) !== currentPage
                                ) {
                                    setCurrentPage(
                                        (previousValue) => previousValue + 1
                                    );
                                }
                            }}
                        >
                            &gt;
                        </button>
                    </ul>
                )}
            </section>
            {modalState.addSubscription && (
                <Modal closeModal={closeModal("addSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("addSubscription")}
                    >
                        <SubscribeNew userCookie={rawCookie} />
                    </SubscriptionDialogBox>
                </Modal>
            )}
            {modalState.cancelSubscription && (
                <Modal closeModal={closeModal("cancelSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("cancelSubscription")}
                    >
                        <CancelSubscription sources={sources} />
                    </SubscriptionDialogBox>
                </Modal>
            )}
            {modalState.filterBySource && (
                <Modal closeModal={closeModal("filterBySource")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("filterBySource")}
                    >
                        <FilterBySource
                            displayState={sourceDisplayState}
                            setDisplayFlag={setSourceDisplayState}
                            closeModal={closeModal("filterBySource")}
                            refetchFeeds={refetchStoredFeeds}
                        />
                    </SubscriptionDialogBox>
                </Modal>
            )}
        </article>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { getDataFrom } = new RequestControllers();
    try {
        const userId = getUserId(context);
        if (!checkIfCookieExists(context)) {
            const encryptedId = encryptCookie({ userId });
            setCookie("mw", encryptedId, {
                req: context.req,
                res: context.res,
                maxAge: 60 * 6 * 24,
            });
        }
        const { data: feeds } = await getDataFrom("/feeds");
        const { data: sources } = await getDataFrom(`/sources?userId=${userId}`);

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
