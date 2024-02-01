"use client";

import { memo, useEffect, useRef, useState } from "react";

import { ParsedFeedsDataType } from ".";
import { FilterType } from "hooks/useFilters";
import { SourceData } from "controllers/sources";

import { calculateTotalPages, calculatePagesList } from "./utils";

import Search from "components/search";
import Card from "components/card";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds/SubscriptionDialogBox";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import FilterBySource from "components/feeds/FilterBySource";
import PostHandleOptions from "./PostHandleOptions";
import PageButton from "./PageButton";
import LoginInfoArea from "./LoginInfoArea";
import Authentication from "components/authentication";
import { useSession } from "next-auth/react";

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
    userId: string;
    updateObserverElement: (element: HTMLDivElement) => void;
    refetchStoredFeeds: () => void;
    setSearchTexts: (target: string, value: string) => void;
    filterFavorites: () => void;
}

export type ModalKeys =
    | "addSubscription"
    | "cancelSubscription"
    | "filterBySource"
    | "handleAuthentication";

type ModalStateType = {
    [key in ModalKeys]: boolean;
};

export interface SourcesList {
    sources: SourceData[];
}

export default memo(function MainView({
    feedsFromServer,
    currentPage,
    setCurrentPage,
    setSortState,
    totalCount,
    isMobileLayout,
    sources,
    sourceDisplayState,
    setSourceDisplayState,
    userId,
    updateObserverElement,
    refetchStoredFeeds,
    setSearchTexts,
    filterFavorites,
}: Props) {
    const [modalState, setModalState] = useState<ModalStateType>({
        addSubscription: false,
        cancelSubscription: false,
        filterBySource: false,
        handleAuthentication: false,
    });
    const startPageRef = useRef<HTMLElement | null>(null);
    const sourcesList = sources ? JSON.parse(sources) : [];
    const session = useSession();

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
                      key={`${feed?.id}_${Math.random()}`}
                      refetchFeeds={refetchStoredFeeds}
                      userId={userId}
                  />
              ))
            : [];

    const pageIndicator = calculatePagesList(
        currentPage,
        calculateTotalPages(totalCount)
    ).map((pageIndex: number) => (
        <li key={`page_${pageIndex}`} className="list-none">
            <PageButton
                customStyle={`${
                    currentPage === pageIndex ? "text-blue-500 font-bold" : ""
                }`}
                clickHandler={moveToPage(pageIndex)}
            >
                {pageIndex}
            </PageButton>
        </li>
    ));

    return (
        <article
            className="flex items-center space-between flex-col w-full h-max min-h-full p-8 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
            ref={startPageRef}
        >
            <button
                onClick={() => {
                    fetch(`https://www.googleapis.com/drive/v3/files`, {
                        headers: {
                            Authorization: `Bearer ${session?.data?.user?.access_token}`,
                        },
                    }).then((res) => res.json()).then((foo) => console.log(foo))
                }}
            >
                test
            </button>
            <section
                className={`flex flex-col items-center w-full h-max min-h-[calc(100vh_-_64px)] fhd:max-w-[1920px] ${
                    feedsFromServer?.length === 0 ? "fhd:min-h-[1080px]" : ""
                } fhd:my-auto`}
            >
                <LoginInfoArea handleAuthenticationModal={handleClick} />
                <div className="flex flex-col justify-center my-auto">
                    <section className="flex-center w-full my-32 lg:w-[768px]">
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
                            <ul className="flex justify-center items-center gap-2 w-full mt-10 mb-20">
                                <PageButton clickHandler={moveToPage(1)}>
                                    &lt;&lt;
                                </PageButton>
                                <PageButton clickHandler={moveToPreviousPage}>
                                    &lt;
                                </PageButton>
                                {pageIndicator}
                                <PageButton clickHandler={moveToNextPage}>
                                    &gt;
                                </PageButton>
                                <PageButton
                                    clickHandler={moveToPage(
                                        calculateTotalPages(totalCount)
                                    )}
                                >
                                    &gt;&gt;
                                </PageButton>
                            </ul>
                        )}
                    </section>
                </div>
            </section>
            {modalState.addSubscription && (
                <Modal closeModal={closeModal("addSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("addSubscription")}
                    >
                        <SubscribeNew userId={userId} />
                    </SubscriptionDialogBox>
                </Modal>
            )}
            {modalState.cancelSubscription && (
                <Modal closeModal={closeModal("cancelSubscription")}>
                    <SubscriptionDialogBox
                        closeModal={closeModal("cancelSubscription")}
                    >
                        <CancelSubscription
                            sources={sourcesList}
                            userId={userId}
                        />
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
            {modalState.handleAuthentication && (
                <Modal closeModal={closeModal("handleAuthentication")}>
                    <Authentication
                        closeModal={closeModal("handleAuthentication")}
                    />
                </Modal>
            )}
        </article>
    );
});
