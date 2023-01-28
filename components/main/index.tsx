import { useEffect, useRef, useState } from "react";

import { ParsedFeedsDataType } from "pages";

import { SORT_STANDARD, SORT_STANDARD_STATE } from "common/constants";

import { handleSort } from "common/helpers";

import Search from "components/search";
import Card from "components/card";
import SelectBox from "components/common/SelectBox";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import FilterBySource from "components/feeds/FilterBySource";
import FilterByText from "components/feeds/FilterByText";
import { FilterType } from "hooks/useFilters";
import Button from "components/feeds/common/Button";
import { SourceData } from 'controllers/sources';

interface Props {
    feedsFromServer: ParsedFeedsDataType[];
    currentPage: number;
    setCurrentPage: (value: number | ((value: number) => number)) => void;
    currentSort: number;
    checkShouldSortByReverse: (sortState: number) => boolean;
    setSortState: (stateString: string) => void;
    totalCount: number;
    isMobileLayout: boolean;
    sources: string;
    sourceDisplayState: FilterType<boolean>;
    setSourceDisplayState: (target: string, value: boolean) => void;
    updateObserverElement: (element: HTMLDivElement) => void;
    refetchStoredFeeds: () => void;
    setSearchTexts: (target: string, value: string) => void;
    filterFavorites: () => void;
}

type ModalKeys = "addSubscription" | "cancelSubscription" | "filterBySource";

type ModalStateType = {
    [key in ModalKeys]: boolean;
};

export interface SourcesList {
    sources: SourceData[];
}

export default function MainPage({
    feedsFromServer,
    currentPage,
    setCurrentPage,
    currentSort,
    checkShouldSortByReverse,
    setSortState,
    totalCount,
    isMobileLayout,
    sources,
    sourceDisplayState,
    setSourceDisplayState,
    updateObserverElement,
    refetchStoredFeeds,
    setSearchTexts,
    filterFavorites,
}: Props) {
    const [modalState, setModalState] = useState<ModalStateType>({
        addSubscription: false,
        cancelSubscription: false,
        filterBySource: false,
    });
    const startPageRef = useRef<HTMLElement | null>(null);
    const { sources: sourcesList }: SourcesList = JSON.parse(sources);

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

    const buttonData = {
        "구독 추가": handleClick("addSubscription"),
        "구독 취소": handleClick("cancelSubscription"),
        "즐겨찾기": filterFavorites,
        "출처별 필터": handleClick("filterBySource"),
    };

    useEffect(() => {
        if (modalState.addSubscription || modalState.cancelSubscription) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [modalState, startPageRef]);

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

    const optionButtonsList = Object.entries(buttonData).map(
        (buttonData: [string, () => void], index: number) => {
            const [buttonText, clickHandler] = buttonData;
            return (
                <Button
                    key={`${buttonText}_${index}`}
                    type="button"
                    customStyle="mr-3"
                    clickHandler={clickHandler}
                >
                    {buttonText}
                </Button>
            );
        }
    );

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
                            {optionButtonsList}
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
                        ref={updateObserverElement}
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
                        <SubscribeNew />
                    </SubscriptionDialogBox>
                </Modal>
            )}
            {modalState.cancelSubscription && (
                <Modal closeModal={closeModal("cancelSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("cancelSubscription")}
                    >
                        <CancelSubscription sources={sourcesList} />
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
