import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import RequestControllers from "controllers";
import { parseCookie } from "controllers/utils";
import {
    SourceData,
    FileContentsInterface,
    CustomError,
} from "controllers/sources";
import {
    getRssResponses,
    parseXml,
    makeFeedDataArray,
} from "controllers/feeds/new";
import { AxiosResponse } from "axios";
import { ParsedFeedsDataType, ParseResultType } from "pages";
import MongoDB from "controllers/mongodb";

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { userId, mw } = request.query;
    const id = userId ?? parseCookie(mw);
    const Feeds = MongoDB.getFeedsModel();
    const remoteData = await Feeds.find({ _uuid: id }).lean();
    const { getDataFrom, postDataTo } = new RequestControllers();
    if (areEqual(request.method, "GET")) {
        try {
            const pageValue = 1;
            const perPageValue = 10;
            const paginationStartIndex = perPageValue * (pageValue - 1);
            const paginationEndIndex = perPageValue * pageValue;
            const { data } = await getDataFrom(`/sources?userId=${id}`);
            const { sources }: FileContentsInterface = JSON.parse(data);
            const urlList = sources
                ? sources.map((sourceData: SourceData) => sourceData.url)
                : [];
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
                const storedFeeds: ParseResultType[] = remoteData[0]
                    ? remoteData[0].data
                    : [];
                let originId = sources?.length > 0 ? storedFeeds.length : 0;
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
                const updatedFeedSets = parseResult.map(
                    (newFeedSet: ParseResultType, feedSetIndex: number) => {
                        const newFeedsList = newFeedSet.feeds;
                        const correspondFeeds = storedFeeds[feedSetIndex]
                            ? storedFeeds[feedSetIndex].feeds ?? []
                            : [];
                        const updatedFeed =
                            newFeedsList?.filter(
                                (newFeed) =>
                                    !correspondFeeds
                                        .map(
                                            (correspondFeed) =>
                                                correspondFeed.title
                                        )
                                        .includes(newFeed.title)
                            ) ?? [];
                        const newFeedsListWithUserStates =
                            correspondFeeds.concat(updatedFeed);
                        return {
                            ...newFeedSet,
                            lastFeedsLength: newFeedsListWithUserStates.length,
                            latestFeedTitle:
                                newFeedsListWithUserStates[0].title,
                            feeds: newFeedsListWithUserStates,
                        };
                    }
                );
                const differentiateArray = parseResult.filter(
                    (resultData: ParseResultType, index: number) =>
                        resultData.lastFeedsLength !==
                            updatedFeedSets[index]?.lastFeedsLength ||
                        resultData.latestFeedTitle !==
                            updatedFeedSets[index]?.latestFeedTitle
                );
                const totalFeedsList = updatedFeedSets
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
                            const previousDate: Date = new Date(a.pubDate);
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
                    postDataTo(`/feeds/new?userId=${id}`, updatedFeedSets);
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
            const updateResult = await Feeds.updateOne(
                { _uuid: id },
                { $set: { data: dataToWrite } }
            );
            if (updateResult.acknowledged) {
                response.status(201).send("success");
            } else {
                throw new CustomError(400, "update failed");
            }
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
