import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from "common/constants";
import RequestControllers, { decryptCookie } from "controllers";
import { SourceData, FileContentsInterface } from "controllers/sources";
import {
    getRssResponses,
    parseXml,
    makeFeedDataArray,
} from "controllers/feeds/new";
import { AxiosResponse } from "axios";
import { ParsedFeedsDataType, ParseResultType } from "types/global";

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { mw } = request.query;
    let id = "";
    if (typeof mw === "string" && mw.length > 0) {
        const { userId } = JSON.parse(decryptCookie(mw.replaceAll(" ", "+")));
        id = userId;
    }
    const { getDataFrom, postDataTo } = new RequestControllers();
    const fileContents = await fs.readFile(
        `${JSON_DIRECTORY}/feeds.json`,
        "utf8"
    );
    if (fileContents == null) {
        response.status(404).send("file not exists.");
    }
    if (areEqual(request.method, "GET")) {
        try {
            const pageValue = 1;
            const perPageValue = 10;
            const paginationStartIndex = perPageValue * (pageValue - 1);
            const paginationEndIndex = perPageValue * pageValue;
            const { data } = await getDataFrom(`/sources?userId=${id}`);
            const { sources }: FileContentsInterface =
                typeof data === "object" ? JSON.parse(data) : {};
            const urlList = sources ? sources.map(
                (sourceData: SourceData) => sourceData.url
            ) : [];
            const result: PromiseSettledResult<AxiosResponse>[] | undefined =
                await getRssResponses(urlList);
            if (result != null) {
                const totalFeedsFromSources: string[] = result.map(
                    (resultData: PromiseSettledResult<AxiosResponse>) => {
                        if (resultData.status === "fulfilled") {
                            return resultData.value.data;
                        }
                    }
                );
                const storedFeeds: ParseResultType[] = fileContents
                    ? JSON.parse(fileContents).data
                    : [];
                let originId = sources?.length > 0 ? storedFeeds.length + 1 : 0;
                const parseResult = totalFeedsFromSources.map(
                    (rawRss: string, index: number) => {
                        const indexedFeed =
                            storedFeeds[index] != null
                                ? storedFeeds[index].feeds
                                : [];
                        const id = indexedFeed != null ? indexedFeed.length : 0;
                        const {
                            feedOriginName,
                            feedOriginParsedLink,
                            rssFeeds,
                        } = parseXml(rawRss);
                        const parsedFeedsArray = makeFeedDataArray(
                            rssFeeds,
                            feedOriginName,
                            id
                        );
                        const latestFeed: ParsedFeedsDataType =
                            parsedFeedsArray[0];
                        if (
                            !areEqual(
                                feedOriginName,
                                storedFeeds[index]?.originName
                            )
                        ) {
                            const result: ParseResultType = {
                                id: sources[index].id
                                    ? sources[index].id
                                    : originId,
                                originName: feedOriginName,
                                originLink: feedOriginParsedLink,
                                lastFeedsLength: parsedFeedsArray.length,
                                latestFeedTitle: latestFeed?.title,
                                feeds: parsedFeedsArray,
                            };
                            originId += 1;
                            return result;
                        } else {
                            return {
                                ...storedFeeds[index],
                                lastFeedsLength: parsedFeedsArray.length,
                                latestFeedTitle: latestFeed?.title,
                                feeds: parsedFeedsArray,
                            };
                        }
                    }
                );
                const differentiateArray = parseResult.filter(
                    (resultData: ParseResultType, index: number) =>
                        resultData.lastFeedsLength !==
                            storedFeeds[index]?.lastFeedsLength ||
                        resultData.latestFeedTitle !==
                            storedFeeds[index]?.latestFeedTitle
                );
                const totalFeedsList = parseResult
                    .reduce(
                        (
                            totalArray: ParsedFeedsDataType[],
                            currenetData: ParseResultType
                        ) => {
                            if (currenetData.feeds) {
                                return totalArray.concat(currenetData.feeds);
                            } else {
                                return totalArray;
                            }
                        },
                        []
                    )
                    .sort((a, b) => {
                        if (a.pubDate && b.pubDate) {
                            const previousDate = new Date(a.pubDate);
                            const nextDate = new Date(b.pubDate);
                            return previousDate > nextDate ? -1 : 1;
                        } else {
                            return -1;
                        }
                    });
                const responseBody = {
                    data: totalFeedsList.slice(
                        paginationStartIndex,
                        paginationEndIndex
                    ),
                    count: totalFeedsList.length,
                };
                if (differentiateArray.length > 0) {
                    postDataTo("/feeds/new", parseResult);
                    response.status(200).json(responseBody);
                } else {
                    response.status(204).send("no new feeds available");
                }
            } else {
                response.status(408).send("new feeds request timeout");
            }
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        try {
            const dataToWrite: ParseResultType[] = request.body;
            const storedFeeds: ParseResultType[] = fileContents
                ? JSON.parse(fileContents).data
                : [];
            const newFeedSets = dataToWrite.map(
                (newFeedSet: ParseResultType, feedSetIndex: number) => {
                    const newFeedsList = newFeedSet.feeds;
                    const newFeedsListWithUserStates = newFeedsList?.map(
                        (newFeeds: ParsedFeedsDataType, feedIndex: number) => {
                            const correspondFeed = storedFeeds[feedSetIndex]
                                ? storedFeeds[feedSetIndex].feeds ?? []
                                : [];
                            return {
                                ...newFeeds,
                                isRead: correspondFeed[feedIndex]
                                    ? correspondFeed[feedIndex].isRead
                                    : false,
                                isFavorite: correspondFeed[feedIndex]
                                    ? correspondFeed[feedIndex].isFavorite
                                    : false,
                            };
                        }
                    );
                    return {
                        ...newFeedSet,
                        feeds: newFeedsListWithUserStates,
                    };
                }
            );
            const newData = {
                data: newFeedSets,
            };
            fs.writeFile(
                `${JSON_DIRECTORY}/feeds.json`,
                JSON.stringify(newData)
            );
            response.status(201).send("success");
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
