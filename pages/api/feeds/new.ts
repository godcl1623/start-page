import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import RequestControllers from "controllers/requestControllers";
import { extractUserIdFrom, initializeMongoDBWith } from "controllers/common";
import {
    SourceData,
    FileContentsInterface,
    CustomError,
} from "controllers/sources";
import {
    getRssResponses,
    parseXml,
    makeFeedDataArray,
    sortFeedSets,
} from "controllers/feeds/new";
import { AxiosResponse } from "axios";
import { ParsedFeedsDataType, ParseResultType } from "pages";
import { getPaginationIndexes } from "controllers/feeds";

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const userId = extractUserIdFrom(request);
    const { remoteData, Schema: Feeds } = await initializeMongoDBWith(
        userId,
        "feeds"
    );

    const { getDataFrom, postDataTo } = new RequestControllers();

    if (areEqual(request.method, "GET")) {
        try {
            const [paginationStartIndex, paginationEndIndex] =
                getPaginationIndexes("1", "10");

            // TODO: source 파싱 함수로 분리 - 아래 sources.length 포함 - start
            const { data } = await getDataFrom(`/sources?userId=${userId}`);
            const { sources }: FileContentsInterface = JSON.parse(data);
            const urlList = sources
                ? sources.map((sourceData: SourceData) => sourceData.url)
                : [];
            const result: PromiseSettledResult<AxiosResponse>[] | undefined =
                await getRssResponses(urlList);
            // source 파싱 함수로 분리 - end

            if (result != null) {
                // TODO: 1. source 파싱 결과 반환 함수
                const totalFeedsFromSources: string[] = result.map(
                    (resultData: PromiseSettledResult<AxiosResponse>) => {
                        if (resultData.status === "fulfilled") {
                            return resultData.value.data;
                        }
                    }
                );
                // TODO: 2. 스토리지 목록 반환 함수
                const storedFeeds: ParseResultType[] =
                    remoteData != null && remoteData[0] ? remoteData : [];
                // TODO: 3. source 파싱 결과 가공 함수 - storedFeeds 파라미터로
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
                // TODO: 4. 스토리지 목록 업데이트 함수
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
                        const newFeedsListWithUserStates = correspondFeeds
                            .concat(updatedFeed)
                            .sort(sortFeedSets);
                        return {
                            ...newFeedSet,
                            lastFeedsLength: newFeedsListWithUserStates.length,
                            latestFeedTitle:
                                newFeedsListWithUserStates[0].title,
                            feeds: newFeedsListWithUserStates,
                        };
                    }
                );
                // TODO: 5. 파싱 결과, 업데이트 목록 차이점 비교 함수
                const differentiateArray = parseResult.filter(
                    (resultData: ParseResultType, index: number) =>
                        resultData.lastFeedsLength !==
                            updatedFeedSets[index]?.lastFeedsLength ||
                        resultData.latestFeedTitle !==
                            updatedFeedSets[index]?.latestFeedTitle
                );
                // TODO: 6. 최종 업데이트 피드 목록 반환 함수
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
                    .sort(sortFeedSets);
                const responseBody = {
                    data: totalFeedsList.slice(
                        paginationStartIndex,
                        paginationEndIndex
                    ),
                    count: totalFeedsList.length,
                };
                if (differentiateArray.length > 0) {
                    postDataTo(`/feeds/new?userId=${userId}`, updatedFeedSets);
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
            const updateResult = await Feeds?.updateOne(
                { _uuid: userId },
                { $set: { data: dataToWrite } }
            );
            if (updateResult?.acknowledged) {
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
