import { useEffect, useRef, useState } from "react";

import { ParsedFeedsDataType } from "pages";

import { SORT_STANDARD } from "common/constants";

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
import { SourceData } from "controllers/sources";

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
        if (modalState.addSubscription || modalState.cancelSubscription) {
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

    const pageIndicator = Array.from(
        { length: Math.ceil(totalCount / 10) },
        (v, k) => k + 1
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

    const buttonData = {
        "구독 추가": handleClick("addSubscription"),
        "구독 취소": handleClick("cancelSubscription"),
        즐겨찾기: filterFavorites,
        "출처별 필터": handleClick("filterBySource"),
    };
    const optionButtonsList = Object.entries(buttonData).map(
        (buttonData: [string, () => void], index: number) => {
            const [buttonText, clickHandler] = buttonData;
            return (
                <Button
                    key={`${buttonText}_${index}`}
                    type="button"
                    customStyle="mr-3" // TODO: 필요 여부 체크
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
            <section className="flex-center w-full h-1/3 my-32 lg:w-[768px]">
                <Search />
            </section>
            <section className="flex flex-col items-center w-full h-max lg:w-[768px]">
                <section className="w-full">
                    <section className="flex flex-col justify-between gap-2 w-full h-28 mb-4 md:flex-row md:gap-0 md:h-8">
                        <section className="flex justify-between gap-2">
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
}
