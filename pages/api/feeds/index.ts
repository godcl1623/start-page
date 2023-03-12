import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { ParseResultType, ParsedFeedsDataType } from "types/global";
import { decryptCookie, parseCookie } from "controllers/utils";
import MongoDB from "controllers/mongodb";
import { handleSort, checkShouldSortByReverse } from "common/helpers";
import { SORT_STANDARD_STATE } from "common/constants";

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { userId, mw } = request.query;
    const id = userId ?? parseCookie(mw);
    const Feeds = MongoDB.getFeedsModel();
    const remoteData = await Feeds.find({ _uuid: id }).lean();

    if (remoteData.length === 0 && typeof id === "string" && id.length > 0) {
        await Feeds.insertMany({ _uuid: id, data: [] });
    }
    if (areEqual(request.method, "GET")) {
        const parsedContents: ParseResultType[] = remoteData[0]?.data;
        try {
            const {
                favorites,
                displayOption,
                textOption,
                page,
                per_page,
                sortOption,
            } = request.query;
            let pageValue =
                page != null && typeof page === "string" ? parseInt(page) : 1;
            let perPageValue =
                per_page != null && typeof per_page === "string"
                    ? parseInt(per_page)
                    : 10;
            let sortIndex =
                sortOption != null && typeof sortOption === "string"
                    ? parseInt(sortOption)
                    : 0;
            const paginationStartIndex = perPageValue * (pageValue - 1);
            const paginationEndIndex = perPageValue * pageValue;
            const isFavoriteFilterNeeded = favorites === "true" ? true : false;
            const displayState =
                displayOption != null && typeof displayOption === "string"
                    ? JSON.parse(displayOption)
                    : null;
            const textState =
                textOption != null && typeof textOption === "string"
                    ? JSON.parse(textOption)
                    : null;
            let filteredContents: ParseResultType[] = parsedContents;
            if (isFavoriteFilterNeeded) {
                const favoriteFilteredContents = filteredContents.map(
                    (parsedContent: ParseResultType) => {
                        const originalFeeds = parsedContent.feeds;
                        const filteredFeeds = originalFeeds?.filter(
                            (feed: ParsedFeedsDataType) => feed.isFavorite
                        );
                        return {
                            ...parsedContent,
                            feeds: filteredFeeds,
                        };
                    }
                );
                filteredContents = filteredContents
                    .slice(filteredContents.length)
                    .concat(favoriteFilteredContents);
            }
            if (displayState != null && Object.keys(displayState).length > 0) {
                const feedsToDisplay = Object.keys(displayState).filter(
                    (feedSource: string) => displayState[feedSource]
                );
                const displayFilteredContents = filteredContents.filter(
                    (parsedContent: ParseResultType) => {
                        const feedSource = parsedContent.originName ?? "";
                        return feedsToDisplay.includes(feedSource);
                    }
                );
                filteredContents = filteredContents
                    .slice(filteredContents.length)
                    .concat(displayFilteredContents);
            }
            if (textState != null && Object.keys(textState).length > 0) {
                const dataSet = Object.entries<string>(textState).filter(
                    (dataSet: string | unknown[]) => dataSet[1] !== ""
                )[0];
                if (dataSet != null) {
                    const [standard, value] = dataSet;
                    const textFilteredContents = filteredContents.map(
                        (parsedContent: ParseResultType) => {
                            const originalFeeds = parsedContent.feeds;
                            const filteredFeeds = originalFeeds?.filter(
                                (feed: ParsedFeedsDataType) => {
                                    if (standard === "title") {
                                        return feed.title?.includes(value);
                                    } else {
                                        return feed.description?.includes(
                                            value
                                        );
                                    }
                                }
                            );
                            return {
                                ...parsedContent,
                                feeds: filteredFeeds,
                            };
                        }
                    );
                    filteredContents = filteredContents
                        .slice(filteredContents.length)
                        .concat(textFilteredContents);
                }
            }
            const totalFeedsList = filteredContents
                ?.reduce(
                    (
                        totalArray: ParsedFeedsDataType[],
                        currentData: ParseResultType
                    ) => {
                        if (currentData.feeds) {
                            return totalArray.concat(currentData.feeds);
                        } else {
                            return totalArray;
                        }
                    },
                    []
                )
                .sort((a, b) => {
                    if (a.pubDate && b.pubDate) {
                        const previousDate: Date = new Date(a.pubDate);
                        const nextDate = new Date(b.pubDate);
                        return previousDate > nextDate ? -1 : 1;
                    } else {
                        return -1;
                    }
                });
            const responseBody = {
                data: totalFeedsList
                    ?.sort(
                        handleSort(
                            SORT_STANDARD_STATE[sortIndex],
                            checkShouldSortByReverse(sortIndex)
                        )
                    )
                    .slice(paginationStartIndex, paginationEndIndex),
                count: totalFeedsList?.length,
            };
            response.status(200).json(JSON.stringify(responseBody));
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
