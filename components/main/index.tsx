import { memo, useEffect, useRef, useState } from "react";

import { ParsedFeedsDataType } from "pages";
import { FilterType } from "hooks/useFilters";
import { SourceData } from "controllers/sources";

import { calculateTotalPages, calculatePagesList } from "./utils";

import Search from "components/search";
import Card from "components/card";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import FilterBySource from "components/feeds/FilterBySource";
import PostHandleOptions from "./PostHandleOptions";

interface Props {
    feedsFromServer: ParsedFeedsDataType[];
    currentPage: number;
    setCurrentPage: (value: number | ((value: number) => number)) => void;
    setSortState: (stateString: string) => void;
    totalCount: number;
    isMobileLayout: boolean;
    sources: string;
    sourceDisplayState: FilterType<boolean>;
    setSourceDisplayState: (target: string, value: boolean) => void;
    rawCookie: string;
    updateObserverElement: (element: HTMLDivElement) => void;
    refetchStoredFeeds: () => void;
    setSearchTexts: (target: string, value: string) => void;
    filterFavorites: () => void;
}

export type ModalKeys =
    | "addSubscription"
    | "cancelSubscription"
    | "filterBySource";

type ModalStateType = {
    [key in ModalKeys]: boolean;
};

export interface SourcesList {
    sources: SourceData[];
}

export default memo(function MainPage({
    feedsFromServer,
    currentPage,
    setCurrentPage,
    setSortState,
    totalCount,
    isMobileLayout,
    sources,
    sourceDisplayState,
    setSourceDisplayState,
    rawCookie,
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
    const { sources: sourcesList }: SourcesList = sources
        ? JSON.parse(sources)
        : {};

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

    const moveToPage = (pageIndex: number) => () => setCurrentPage(pageIndex);

    const moveToPreviousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage((previousValue) => previousValue - 1);
        }
    };

    const moveToNextPage = () => {
        if (Math.ceil(totalCount / 10) !== currentPage) {
            setCurrentPage((previousValue) => previousValue + 1);
        }
    };

    useEffect(() => {
        if (Object.values(modalState).includes(true)) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [modalState, startPageRef]);

    const feedsToDisplay =
        feedsFromServer != null && feedsFromServer.length > 0
            ? feedsFromServer?.map((feed: ParsedFeedsDataType) => (
                  <Card
                      cardData={feed}
                      key={feed?.id}
                      refetchFeeds={refetchStoredFeeds}
                  />
              ))
            : [];

    const pageIndicator = calculatePagesList(
        currentPage,
        calculateTotalPages(totalCount)
    ).map((pageIndex: number) => (
        <li
            key={`page_${pageIndex}`}
            className="list-none"
            onClick={moveToPage(pageIndex)}
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
            className="flex-center flex-col w-full h-max min-h-full px-4 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
            ref={startPageRef}
        >
            <section className="flex-center w-full h-1/3 my-32 lg:w-[768px]">
                <Search />
            </section>
            <section className="flex flex-col items-center w-full h-max lg:w-[768px]">
                <PostHandleOptions
                    filterFavorites={filterFavorites}
                    handleClick={handleClick}
                    setSearchTexts={setSearchTexts}
                    setSortState={setSortState}
                />
                <section>{feedsToDisplay}</section>
                {isMobileLayout ? (
                    <div
                        ref={updateObserverElement}
                        className="w-full h-[150px]"
                    />
                ) : (
                    <ul className="flex justify-evenly items-center w-1/2 mt-10 mb-20">
                        <button onClick={moveToPreviousPage}>&lt;</button>
                        {pageIndicator}
                        <button onClick={moveToNextPage}>&gt;</button>
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
});
