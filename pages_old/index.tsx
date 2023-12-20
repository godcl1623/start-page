// import { useCallback, useEffect, useState } from "react";
// import RequestControllers from "controllers/requestControllers";
// import { AxiosResponse } from "axios";
// import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
// import useFilters from "hooks/useFilters";
// import { SEARCH_OPTIONS } from "components/feeds/FilterByText";
// import MainPage from "components/main";
// import { SORT_STANDARD } from "common/constants";
// import { GetServerSidePropsContext } from "next";
// import { encryptCookie, getNewUserId } from "controllers/utils";
// import { setCookie } from "cookies-next";
// import { getToken } from "next-auth/jwt";

// export interface ParsedFeedsDataType {
//     id: string;
//     title: string | null;
//     description: string | null;
//     link: string | null;
//     pubDate: string | null;
//     origin: string | null;
//     isRead: boolean | null;
//     isFavorite: boolean | null;
//     [key: string]: number | string | boolean | null;
// }

// export interface ParseResultType {
//     id: number;
//     originName: string | null;
//     originLink: string | null;
//     lastFeedsLength: number;
//     latestFeedTitle: string | null;
//     feeds?: ParsedFeedsDataType[];
// }

// interface IndexProps {
//     feeds: string;
//     sources: string;
//     userId: string;
// }

// interface RenewedFeedsData {
//     data: ParsedFeedsDataType[];
//     count: number;
// }

// export default function Index({ feeds, sources, userId }: IndexProps) {
//     const { getDataFrom } = new RequestControllers();
//     const [currentSort, setCurrentSort] = useState(0);
//     const [isFilterFavorite, setIsFilterFavorite] = useState<boolean>(false);
//     const [observerElement, setObserverElement] =
//         useState<HTMLDivElement | null>(null);
//     const [totalCount, setTotalCount] = useState<number>(0);
//     const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [formerFeedsList, setFormerFeedsList] = useState<any>({});
//     const [sourceDisplayState, setSourceDisplayState] = useFilters(
//         sources,
//         true
//     );
//     const [searchTexts, setSearchTexts] = useFilters(
//         JSON.stringify(Object.values(SEARCH_OPTIONS)),
//         ""
//     );
//     const newFeedsRequestResult = useQuery<AxiosResponse<RenewedFeedsData>>({
//         queryKey: [`/feeds/new?userId=${userId}`],
//         queryFn: () => getDataFrom(`/feeds/new?userId=${userId}`),
//     })?.data?.data;
//     const {
//         data: storedFeed,
//         refetch: refetchStoredFeeds,
//         fetchNextPage,
//         hasNextPage,
//     } = useInfiniteQuery({
//         queryKey: [`/feeds?userId=${userId}`, { isMobileLayout, currentPage }],
//         initialPageParam: currentPage,
//         queryFn: ({ pageParam }) =>
//             getDataFrom(`/feeds?userId=${userId}`, {
//                 params: {
//                     ...(isFilterFavorite && { favorites: isFilterFavorite }),
//                     ...(Object.values(sourceDisplayState).includes(false) && {
//                         displayOption: sourceDisplayState,
//                     }),
//                     ...(Object.values(searchTexts).some(
//                         (searchText: string) => searchText.length >= 2
//                     ) && { textOption: searchTexts }),
//                     ...(currentSort > 0 && { sortOption: currentSort }),
//                     page: pageParam,
//                 },
//             }),
//         getNextPageParam: (lastPage) => {
//             const totalCount = JSON.parse(lastPage.data).count;
//             if (currentPage >= Math.ceil(totalCount / 10)) return;
//             return currentPage + 1;
//         },
//         getPreviousPageParam: () => {
//             if (currentPage <= 0) return;
//             return currentPage - 1;
//         },
//     });
//     const feedsFromServer = isMobileLayout
//         ? (Object.values(formerFeedsList) as any[])
//               .filter((feedListPerPage: any[]) => feedListPerPage?.length > 0)
//               .reduce((acc, x) => acc?.concat(x), [])
//         : formerFeedsList[currentPage];

//     const updateFormerFeedsList = (feedsList: ParsedFeedsDataType[]) => {
//         setFormerFeedsList(
//             (previousObject: { [key in number]: ParsedFeedsDataType[] }) => {
//                 if (previousObject[currentPage] != null) {
//                     if (
//                         currentPage > 1 &&
//                         previousObject[currentPage - 1].length > 0 &&
//                         previousObject[currentPage - 1].every(
//                             (feed: ParsedFeedsDataType, index: number) =>
//                                 feed.id === feedsList[index]?.id
//                         )
//                     ) {
//                         return previousObject;
//                     }
//                     return {
//                         ...previousObject,
//                         [currentPage]: previousObject[currentPage]
//                             ?.slice(previousObject[currentPage].length)
//                             .concat(feedsList),
//                     };
//                 } else {
//                     return {
//                         [currentPage]: feedsList,
//                     };
//                 }
//             }
//         );
//     };

//     const setSortState = useCallback(
//         (stateStringArray: string[]) => (stateString: string) => {
//             if (stateStringArray.includes(stateString)) {
//                 setCurrentSort(stateStringArray.indexOf(stateString));
//             } else {
//                 setCurrentSort(0);
//             }
//         },
//         []
//     );

//     const filterFavorites = () => {
//         setIsFilterFavorite(!isFilterFavorite);
//         setCurrentPage(1);
//     };

//     const updateObserverElement = (element: HTMLDivElement) => {
//         setObserverElement(element);
//     };

//     const updateCurrentPage = (value: number | ((value: number) => number)) => {
//         setCurrentPage(value);
//     };

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const callback = () => {
//                 if (window.innerWidth > 768) {
//                     setIsMobileLayout(false);
//                 } else {
//                     setIsMobileLayout(true);
//                 }
//             };
//             callback();
//             window.addEventListener("resize", callback);
//             return () => window.removeEventListener("resize", callback);
//         }
//     }, []);

//     useEffect(() => {
//         if (feeds) {
//             const {
//                 data,
//                 count,
//             }: { data: ParsedFeedsDataType[]; count: number } =
//                 JSON.parse(feeds);
//             setTotalCount(count);
//             Array.from({ length: Math.ceil(count / 10) }, (v, k) =>
//                 setFormerFeedsList((previousObject: any) => ({
//                     ...previousObject,
//                     [k + 1]: [],
//                 }))
//             );
//             updateFormerFeedsList(data);
//         }
//     }, [feeds]);

//     useEffect(() => {
//         if (storedFeed && storedFeed.pages) {
//             const dataArray = JSON.parse(
//                 storedFeed.pages[storedFeed.pages.length - 1].data
//             );
//             setTotalCount(dataArray.count);
//             updateFormerFeedsList(dataArray.data);
//         }
//     }, [storedFeed, isMobileLayout]);

//     useEffect(() => {
//         if (
//             newFeedsRequestResult != null &&
//             typeof newFeedsRequestResult !== "string"
//         ) {
//             const { count, data } = newFeedsRequestResult;
//             if (count !== totalCount) setTotalCount(count);
//             updateFormerFeedsList(data);
//         }
//     }, [newFeedsRequestResult]);

//     useEffect(() => {
//         if (!isMobileLayout) {
//             refetchStoredFeeds();
//         }
//     }, [
//         isFilterFavorite,
//         searchTexts,
//         currentPage,
//         isMobileLayout,
//         currentSort,
//     ]);

//     useEffect(() => {
//         if (isMobileLayout) {
//             const firstEmptyPageIndex = (
//                 Object.values(formerFeedsList) as any[]
//             ).findIndex((value: any[]) => value?.length === 0);
//             setCurrentPage(firstEmptyPageIndex);
//             Object.keys(formerFeedsList).forEach((key: string, index) => {
//                 if (index > firstEmptyPageIndex) {
//                     setFormerFeedsList((previousObject: any) => ({
//                         ...previousObject,
//                         [key]: [],
//                     }));
//                 }
//             });
//         } else {
//             const fetchedPages = (
//                 Object.values(formerFeedsList) as any[]
//             ).reduce(
//                 (totalNumber: number, currentDataArray: any[]) =>
//                     currentDataArray?.length > 0
//                         ? (totalNumber += 1)
//                         : totalNumber,
//                 0
//             );
//             setCurrentPage(fetchedPages > 0 ? fetchedPages : 1);
//         }
//     }, [isMobileLayout]);

//     useEffect(() => {
//         if (typeof window !== "undefined" && observerElement != null) {
//             const observerOption: IntersectionObserverInit = {
//                 threshold: 0.5,
//             };
//             const observerCallback: IntersectionObserverCallback = (
//                 entries: IntersectionObserverEntry[]
//             ) => {
//                 entries.forEach((entry: IntersectionObserverEntry) => {
//                     if (entry.isIntersecting) {
//                         if (hasNextPage) {
//                             fetchNextPage();
//                             setCurrentPage(
//                                 (previousValue) => previousValue + 1
//                             );
//                         }
//                     }
//                 });
//             };
//             const observer = new IntersectionObserver(
//                 observerCallback,
//                 observerOption
//             );
//             observer.observe(observerElement);
//             return () => observer.unobserve(observerElement);
//         }
//     }, [observerElement, hasNextPage]);

//     return (
//         <MainPage
//             feedsFromServer={feedsFromServer}
//             currentPage={currentPage}
//             setCurrentPage={updateCurrentPage}
//             setSortState={setSortState(SORT_STANDARD)}
//             totalCount={totalCount}
//             isMobileLayout={isMobileLayout}
//             sources={sources}
//             sourceDisplayState={sourceDisplayState}
//             setSourceDisplayState={setSourceDisplayState}
//             userId={userId}
//             updateObserverElement={updateObserverElement}
//             refetchStoredFeeds={refetchStoredFeeds}
//             setSearchTexts={setSearchTexts}
//             filterFavorites={filterFavorites}
//         />
//     );
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const { getDataFrom } = new RequestControllers();
//     try {
//         const token = await getToken({
//             req: context.req,
//             secret: process.env.NEXTAUTH_SECRET,
//         });
//         let userId: string = "";

//         if (token?.email != null) {
//             userId = encryptCookie({ userId: token?.email });
//         } else if (context.req.cookies.mw != null) {
//             userId = context.req.cookies.mw;
//         } else {
//             const newUserId = getNewUserId();
//             const encryptedId = encryptCookie({ userId: newUserId });
//             setCookie("mw", encryptedId, {
//                 req: context.req,
//                 res: context.res,
//                 maxAge: 60 * 60 * 24 * 30,
//             });
//         }

//         const { data: feeds } = await getDataFrom(`/feeds?userId=${userId}`);
//         const { data: sources } = await getDataFrom(
//             `/sources?userId=${userId}`
//         );

//         return {
//             props: {
//                 feeds,
//                 sources,
//                 userId,
//             },
//         };
//     } catch (error) {
//         if (error instanceof Error) throw new Error(error.message);
//     }
// }
