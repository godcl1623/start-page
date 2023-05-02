import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import RequestControllers from "controllers/requestControllers";
import { extractUserIdFrom, initializeMongoDBWith } from "controllers/common";
import {
    SourceData,
    FileContentsInterface,
    CustomError,
} from "controllers/sources";
import { getRssResponses } from "controllers/feeds/new/utils";
import { AxiosResponse } from "axios";
import { ParseResultType } from "pages";
import { getPaginationIndexes } from "controllers/feeds";
import {
    differentiateArrays,
    extractStoredFeedsFromRemote,
    makeUpdatedFeedsLists,
    parseFeedsFromSources,
    extractFeedsFromSources,
    updateFeedSetsDataBy,
} from "controllers/feeds/new";

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
            const { data } = await getDataFrom(`/sources?userId=${userId}`);

            const sources: SourceData[] = JSON.parse(data);
            const urlsToGetFeeds = sources
                ? sources.map((sourceData: SourceData) => sourceData.url)
                : [];
            const result: PromiseSettledResult<AxiosResponse>[] | undefined =
                await getRssResponses(urlsToGetFeeds);

            if (result != null) {
                const totalFeedsFromSources = extractFeedsFromSources(result);

                const storedFeeds = extractStoredFeedsFromRemote(remoteData);

                let originId = sources?.length > 0 ? storedFeeds.length : 0;
                const parseResult = parseFeedsFromSources({
                    totalFeedsFromSources,
                    storedFeeds,
                    sources,
                    originId,
                });

                const updatedFeedSets = updateFeedSetsDataBy(
                    parseResult,
                    storedFeeds
                );

                const totalFeedsList = makeUpdatedFeedsLists(updatedFeedSets);
                const responseBody = {
                    data: totalFeedsList.slice(
                        paginationStartIndex,
                        paginationEndIndex
                    ),
                    count: totalFeedsList.length,
                };

                const differentiateResult = differentiateArrays(
                    parseResult,
                    updatedFeedSets
                );
                if (differentiateResult.length > 0) {
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
