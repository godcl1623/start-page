import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from "common/constants";
import RequestControllers from "controllers";
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
            const { data } = await getDataFrom("/sources");
            const { sources }: FileContentsInterface = JSON.parse(data);
            const urlList = sources.map(
                (sourceData: SourceData) => sourceData.url
            );
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
                let originId = storedFeeds.length;
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
                                id: originId,
                                originName: feedOriginName,
                                originLink: feedOriginParsedLink,
                                lastFeedsLength: parsedFeedsArray.length,
                                latestFeedTitle: latestFeed.title,
                                feeds: parsedFeedsArray,
                            };
                            originId += 1;
                            return result;
                        } else {
                            return {
                                ...storedFeeds[index],
                                lastFeedsLength: parsedFeedsArray.length,
                                latestFeedTitle: latestFeed.title,
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
                if (differentiateArray.length > 0) {
                    postDataTo("/feeds/new", parseResult);
                    response.status(200).json(parseResult);
                } else {
                    response.status(204).send("no new feeds available");
                }
            } else {
                response.status(408).send("new feeds request timeout");
            }
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        try {
            const dataToWrite: ParseResultType[] = request.body;
            const newData = {
                data: dataToWrite,
            };
            fs.writeFile(`${JSON_DIRECTORY}/feeds.json`, JSON.stringify(newData));
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
