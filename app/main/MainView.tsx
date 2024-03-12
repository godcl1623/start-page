"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
    ErrorResponse,
    ParsedFeedsDataType,
    STATE_MESSAGE_STRINGS,
    SourceDisplayState,
} from ".";
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
import EditSearchEngines from "components/editSearchEngines";
import { SearchEnginesData } from "controllers/searchEngines";
import { SEARCH_ADDRESS_BY_ENGINE } from "components/search/utils/constants";
import Button from "components/common/Button";

interface Props {
    feedsFromServer: ParsedFeedsDataType[];
    currentPage: number;
    setCurrentPage: (value: number) => void;
    filterBySort: (stateString: string) => void;
    totalCount: number;
    isMobileLayout: boolean;
    sources: string;
    sourceDisplayState: FilterType<boolean>;
    setSourceDisplayState: (target: string, value: boolean) => void;
    userId: string;
    updateObserverElement: (element: HTMLDivElement) => void;
    filterBySearchTexts: (target: string, value: string) => void;
    filterFavorites: () => void;
    renewState: string;
    isFilterFavorite: boolean;
    searchEnginesList: SearchEnginesData[] | ErrorResponse | null | undefined;
    checkAndUpdateNewFeeds: () => void;
    filterBySources: (newDisplayState: SourceDisplayState) => void;
    isFilterBySorts: boolean;
    isFilterByTexts: boolean;
    searchTexts: FilterType<string>;
    patchCachedData: (newData: ParsedFeedsDataType) => void;
}

export type ModalKeys =
    | "addSubscription"
    | "cancelSubscription"
    | "filterBySource"
    | "handleAuthentication"
    | "editSearchEngine"
    | "handleInquiry";

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
    filterBySort,
    totalCount,
    isMobileLayout,
    sources,
    sourceDisplayState,
    setSourceDisplayState,
    userId,
    updateObserverElement,
    filterBySearchTexts,
    filterFavorites,
    renewState,
    isFilterFavorite,
    searchEnginesList,
    checkAndUpdateNewFeeds,
    filterBySources,
    isFilterBySorts,
    isFilterByTexts,
    searchTexts,
    patchCachedData,
}: Props) {
    const [modalState, setModalState] = useState<ModalStateType>({
        addSubscription: false,
        cancelSubscription: false,
        filterBySource: false,
        handleAuthentication: false,
        editSearchEngine: false,
        handleInquiry: false,
    });
    const [shouldHideRenewState, setShouldHideRenewState] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldStartLoad, setShouldStartLoad] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(false);
    const startPageRef = useRef<HTMLElement | null>(null);
    const renewButtonRef = useRef<HTMLButtonElement>(null);
    const sourcesList = useMemo(
        () => (sources ? JSON.parse(sources) : []),
        [sources]
    );
    const isFilterSources =
        Object.values(sourceDisplayState).filter((value) => !value).length > 0;
    const searchEngines =
        searchEnginesList != null &&
        Array.isArray(searchEnginesList) &&
        searchEnginesList.length > 0
            ? searchEnginesList
            : SEARCH_ADDRESS_BY_ENGINE;

    const handleModal = (target: ModalKeys) => () => {
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
            setCurrentPage(currentPage - 1);
        }
    };

    const moveToNextPage = () => {
        if (Math.ceil(totalCount / 10) !== currentPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFeedUpdate = () => {
        setShouldHideRenewState(false);
        checkAndUpdateNewFeeds();
    };

    const activateInitialUpdate = useCallback(() => {
        setIsInitialLoad(true);
        renewButtonRef.current?.click();
    }, []);

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
        } else if (
            renewState === STATE_MESSAGE_STRINGS.start ||
            renewState === STATE_MESSAGE_STRINGS.proceed
        ) {
            setShouldStartLoad(true);
            setIsLoaded(false);
        }
    }, [renewState]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isLoaded) {
            timeout = setTimeout(() => setShouldHideRenewState(true), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isLoaded]);

    useEffect(() => {
        if (
            sourcesList.length > 0 &&
            feedsFromServer == null &&
            !isInitialLoad
        ) {
            activateInitialUpdate();
        }
    }, [feedsFromServer, sourcesList, isInitialLoad, activateInitialUpdate]);

    useEffect(() => {
        if (isInitialLoad && shouldHideRenewState && feedsFromServer == null) {
            location.reload();
        }
    }, [isInitialLoad, shouldHideRenewState, feedsFromServer]);

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
        <>
            <header className="p-8 pb-0 fhd:max-w-[1920px]">
                <LoginInfoArea handleModal={handleModal} userId={userId} />
            </header>
            <main
                className="flex items-center space-between flex-col w-full h-max min-h-full p-8 pt-0 dark:text-neutral-200"
                ref={startPageRef}
            >
                <section
                    className={`flex flex-col items-center w-full h-full min-h-[calc(100vh-140px)] xs:min-h-[calc(100vh-100px)] fhd:max-w-[1920px]`}
                >
                    <div className="flex flex-col justify-center items-center w-full my-auto">
                        <article className="flex-center w-full mt-24 mb-20 sm:mt-32 sm:mb-28 lg:w-[768px]">
                            <Search
                                handleModal={handleModal("editSearchEngine")}
                                searchEnginesList={searchEngines}
                            />
                        </article>
                        <article className="flex flex-col items-center w-full h-max lg:w-[768px]">
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
                                {sourcesList.length === 0 ? (
                                    <></>
                                ) : (
                                    <button
                                        ref={renewButtonRef}
                                        type="button"
                                        onClick={handleFeedUpdate}
                                        className="px-3 py-2 rounded-md shadow-md dark:shadow-zinc-600 whitespace-pre bg-neutral-500 text-neutral-100"
                                    >
                                        피드 갱신
                                    </button>
                                )}
                            </div>
                            <PostHandleOptions
                                filterFavorites={filterFavorites}
                                handleClick={handleModal}
                                filterBySearchTexts={filterBySearchTexts}
                                filterBySort={filterBySort}
                                isFilterFavorite={isFilterFavorite}
                                isFilterSources={isFilterSources}
                                isFilterSorts={isFilterBySorts}
                                isFilterTexts={isFilterByTexts}
                                searchTexts={searchTexts}
                            />
                            {sourcesList.length > 0 ? (
                                <FeedsList
                                    feedsFromServer={feedsFromServer}
                                    userId={userId}
                                    isFilterFavorite={isFilterFavorite}
                                    isFilterSources={isFilterSources}
                                    patchCachedData={patchCachedData}
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
                                <menu className="flex justify-center items-center gap-2 w-full mt-10 mb-20">
                                    <PageButton clickHandler={moveToPage(1)}>
                                        &lt;&lt;
                                    </PageButton>
                                    <PageButton
                                        clickHandler={moveToPreviousPage}
                                    >
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
                                </menu>
                            )}
                        </article>
                    </div>
                </section>
                {modalState.addSubscription && (
                    <Modal closeModal={closeModal("addSubscription")}>
                        <SubscriptionDialogBox
                            closeModal={closeModal("addSubscription")}
                            customStyle="w-screen rounded-none sm:w-96 sm:rounded-md"
                        >
                            <SubscribeNew
                                userId={userId}
                                activateInitialUpdate={activateInitialUpdate}
                                closeModal={closeModal("addSubscription")}
                            />
                        </SubscriptionDialogBox>
                    </Modal>
                )}
                {modalState.cancelSubscription && (
                    <Modal closeModal={closeModal("cancelSubscription")}>
                        <SubscriptionDialogBox
                            closeModal={closeModal("cancelSubscription")}
                            customStyle="w-screen rounded-none sm:w-96 sm:rounded-md"
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
                            customStyle="w-screen rounded-none sm:w-96 sm:rounded-md"
                        >
                            <FilterBySource
                                displayState={sourceDisplayState}
                                setDisplayFlag={setSourceDisplayState}
                                closeModal={closeModal("filterBySource")}
                                filterBySources={filterBySources}
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
                {modalState.editSearchEngine && (
                    <Modal closeModal={closeModal("editSearchEngine")}>
                        <SubscriptionDialogBox
                            closeModal={closeModal("editSearchEngine")}
                            customStyle="w-screen rounded-none sm:rounded-md lg:w-[768px]"
                        >
                            <EditSearchEngines
                                userId={userId}
                                serverSearchEnginesList={searchEngines}
                                closeModal={closeModal("editSearchEngine")}
                            />
                        </SubscriptionDialogBox>
                    </Modal>
                )}
            </main>
        </>
    );
});
