"use client";

import { memo, useEffect, useRef, useState } from "react";

import { ParsedFeedsDataType, STATE_MESSAGE_STRINGS } from ".";
import { FilterType } from "hooks/useFilters";
import { SourceData } from "controllers/sources/helpers";

import { calculateTotalPages, calculatePagesList } from "./utils";

import Search from "components/search";
import Modal from "components/modal";
import SubscriptionDialogBox from "components/feeds/SubscriptionDialogBox";
import SubscribeNew from "components/feeds/SubscribeNew";
import CancelSubscription from "components/feeds/CancelSubscription";
import FilterBySource from "components/feeds/FilterBySource";
import PostHandleOptions from "./PostHandleOptions";
import PageButton from "./PageButton";
import LoginInfoArea from "./LoginInfoArea";
import Authentication from "components/authentication";
import { SvgSpinners90RingWithBg } from "components/common/Spinner";
import FeedsList from "components/feedsList";

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
    renewState: string;
    isFilterFavorite: boolean;
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
    renewState,
    isFilterFavorite,
}: Props) {
    const [modalState, setModalState] = useState<ModalStateType>({
        addSubscription: false,
        cancelSubscription: false,
        filterBySource: false,
        handleAuthentication: false,
    });
    const [shouldHideRenewState, setShouldHideRenewState] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldStartLoad, setShouldStartLoad] = useState(false);
    const startPageRef = useRef<HTMLElement | null>(null);
    const sourcesList = sources ? JSON.parse(sources) : [];
    const isFilterSources =
        Object.values(sourceDisplayState).filter((value) => !value).length > 0;

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

    useEffect(() => {
        if (
            renewState !== STATE_MESSAGE_STRINGS.start &&
            renewState !== STATE_MESSAGE_STRINGS.proceed
        ) {
            setIsLoaded(true);
        } else if (renewState === STATE_MESSAGE_STRINGS.start) {
            setShouldStartLoad(true);
        }
    }, [renewState]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isLoaded) {
            timeout = setTimeout(() => setShouldHideRenewState(true), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isLoaded]);

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
            <section
                className={`flex flex-col items-center w-full h-max min-h-[calc(100vh_-_64px)] fhd:max-w-[1920px] ${
                    feedsFromServer?.length === 0 ? "fhd:min-h-[1080px]" : ""
                } fhd:my-auto`}
            >
                <LoginInfoArea handleAuthenticationModal={handleClick} />
                <div className="flex flex-col justify-center my-auto">
                    <section className="flex-center w-full mt-32 mb-28 lg:w-[768px]">
                        <Search />
                    </section>
                    <section className="flex flex-col items-center w-full h-max lg:w-[768px]">
                        <div className="flex items-center justify-end gap-1.5 w-full min-h-[1rem] mb-2 text-right text-xs">
                            {sourcesList.length === 0 ||
                            shouldHideRenewState ? (
                                <></>
                            ) : (
                                <>
                                    {isLoaded || !shouldStartLoad ? (
                                        <></>
                                    ) : (
                                        <SvgSpinners90RingWithBg className="fill-neutral-700 dark:fill-neutral-100" />
                                    )}
                                    <p>{renewState}</p>
                                </>
                            )}
                        </div>
                        <PostHandleOptions
                            filterFavorites={filterFavorites}
                            handleClick={handleClick}
                            setSearchTexts={setSearchTexts}
                            setSortState={setSortState}
                        />
                        {sourcesList.length > 0 ? (
                            <FeedsList
                                feedsFromServer={feedsFromServer}
                                refetchFeeds={refetchStoredFeeds}
                                userId={userId}
                                isFilterFavorite={isFilterFavorite}
                                isFilterSources={isFilterSources}
                            />
                        ) : (
                            <></>
                        )}
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
