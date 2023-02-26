import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { ParseResultType, ParsedFeedsDataType } from "types/global";
import mongoose, { Schema } from "mongoose";
import { decryptCookie } from 'controllers';

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { userId, mw } = request.query;
    let id = userId;
    if (userId == null && typeof mw === "string" && mw.length > 0) {
        const { userId } = JSON.parse(decryptCookie(mw.replaceAll(" ", "+")));
        id = userId;
    }
    await mongoose.connect(
        `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_KEY}@${process.env.MONGO_DB_URI}/?retryWrites=true&w=majority`,
        {
            dbName: "start-page",
        }
    );
    const Feeds = mongoose.models.Feeds || mongoose.model("Feeds", feedsSchema);
    const remoteData = await Feeds.find({ _uuid: id });

    if (
        remoteData.length === 0 &&
        typeof id === "string" &&
        id.length > 0
    ) {
        await Feeds.insertMany({ _uuid: id, data: [] });
    }
    if (areEqual(request.method, "GET")) {
        const parsedContents: ParseResultType[] = remoteData[0]?.data;
        try {
            const { favorites, displayOption, textOption, page, per_page } =
                request.query;
            let pageValue =
                page != null && typeof page === "string" ? parseInt(page) : 1;
            let perPageValue =
                per_page != null && typeof per_page === "string"
                    ? parseInt(per_page)
                    : 10;
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
                console.log(totalFeedsList.map((foo) => foo.title))
            const responseBody = {
                data: totalFeedsList?.slice(paginationStartIndex, paginationEndIndex),
                count: totalFeedsList?.length,
            };
            response.status(200).json(JSON.stringify(responseBody));
        } catch (error) {
            console.log(error)
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

export const feedsSchema = new Schema({
    _uuid: String,
    data: [{
        id: Number,
        originName: String,
        originLink: String,
        lastFeedsLength: Number,
        latestFeedTitle: String,
        feeds: [{
            id: String,
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
            pubDate: {
                type: String,
                required: true,
            },
            origin: {
                type: String,
                required: true,
            },
            isRead: Boolean,
            isFavorite: Boolean,
        }],
    }],
});
