import React from "react";
import Search from "components/search";
import RequestControllers from "controllers";
import Card from "components/card";
import { ParsedFeedsDataType, ParseResultType } from "types/global";
import { handleSort } from "common/helpers";
import { SORT_STANDARD, SORT_STANDARD_STATE } from "common/constants";
import SelectBox from "components/common/SelectBox";
import { AxiosResponse } from "axios";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import { useQuery } from "@tanstack/react-query";
import FilterBySource from "components/feeds/FilterBySource";
import useFilters from "hooks/useFilters";
import FilterByText from "components/feeds/FilterByText";
import { SEARCH_OPTIONS } from "components/feeds/FilterByText";

interface IndexProps {
    feeds: string;
    sources: string;
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
    const [isFilterFavorite, setIsFilterFavorite] =
        React.useState<boolean>(false);
    const [newFeeds, setNewFeeds] = React.useState<ParseResultType[]>([]);
    const [sourceDisplayState, setSourceDisplayState] = useFilters(
        sources,
        true
    );
    const [searchTexts, setSearchTexts] = useFilters(
        JSON.stringify(Object.values(SEARCH_OPTIONS)),
        ""
    );
    const startPageRef = React.useRef<HTMLElement | null>(null);
    const newFeedsRequestResult = useQuery<AxiosResponse<ParseResultType[]>>(
        ["/feeds/new"],
        () => getDataFrom("/feeds/new")
    )?.data?.data;
    const { data: storedFeed, refetch: refetchStoredFeeds } = useQuery<
        AxiosResponse<string>
    >(["/feeds"], () =>
        getDataFrom("/feeds", {
            params: {
                favorites: isFilterFavorite,
                displayOption: sourceDisplayState,
                textOption: searchTexts,
            },
        })
    );
    const feedsFromServer = newFeedsRequestResult
        ? newFeedsRequestResult
        : newFeeds;

    const checkShouldSortByReverse = (sortState: number) => sortState === 1;
    const setSortState = (stateString: string, stateStringArray: string[]) => {
        if (stateStringArray.includes(stateString)) {
            setCurrentSort(stateStringArray.indexOf(stateString));
        } else {
            setCurrentSort(0);
        }
    };

    const feedsToDisplay = feedsFromServer
        ? feedsFromServer
              .map((feedData: ParseResultType) => feedData.feeds)
              .reduce(
                  (
                      resultArray: ParsedFeedsDataType[] | undefined,
                      currentArray: ParsedFeedsDataType[] | undefined
                  ) => {
                      if (currentArray) resultArray?.push(...currentArray);
                      return resultArray;
                  },
                  []
              )
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
        if (feeds) {
            const { data }: { data: ParseResultType[] } = JSON.parse(feeds);
            setNewFeeds((previousArray) =>
                previousArray.slice(previousArray.length).concat(data)
            );
        }
    }, [feeds]);

    React.useEffect(() => {
        if (storedFeed && storedFeed.data) {
            const { data }: { data: ParseResultType[] } = JSON.parse(
                storedFeed.data
            );
            setNewFeeds((previousArray) =>
                previousArray.slice(previousArray.length).concat(data)
            );
        }
    }, [storedFeed]);

    React.useEffect(() => {
        if (modalState.addSubscription || modalState.cancelSubscription) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [modalState, startPageRef]);

    React.useEffect(() => {
        refetchStoredFeeds();
    }, [isFilterFavorite, searchTexts]);

    return (
        <article
            className="flex-center flex-col w-full h-max min-h-full bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
            ref={startPageRef}
        >
            <section className="flex-center w-1/2 h-1/3 my-[10%]">
                <Search />
            </section>
            <section className="w-1/2 h-max">
                <section>
                    <section className="flex justify-between h-8 mb-4">
                        <section>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("addSubscription")}
                            >
                                ?????? ??????
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("cancelSubscription")}
                            >
                                ?????? ??????
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={filterFavorites}
                            >
                                ????????????
                            </button>
                            <button
                                className="mr-3 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200"
                                onClick={handleClick("filterBySource")}
                            >
                                ????????? ??????
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
            </section>
            {modalState.addSubscription && (
                <Modal closeModal={closeModal("addSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("addSubscription")}
                    >
                        <SubscribeNew />
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
