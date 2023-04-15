import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { ParsedFeedsDataType, ParseResultType } from "pages";
import { CustomError } from "controllers/sources";
import { extractUserIdFrom, initializeMongoDBWith } from "controllers/common";
import { extractStoredFeedsFromRemote } from "controllers/feeds/new";
import {
    copyArray,
    findFeedToChange,
    findRequestedFeedSetIndex,
} from "controllers/feeds/feedsSetId/feedId";

export default async function feedsSetIdHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const userId = extractUserIdFrom(request);
    const { remoteData, Schema: Feeds } = await initializeMongoDBWith(
        userId,
        "feeds"
    );

    if (areEqual(request.method, "GET")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "POST")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        try {
            const dataToChange: ParsedFeedsDataType = request.body;
            const { id, origin } = dataToChange;

            const storedFeeds = extractStoredFeedsFromRemote(remoteData);
            const feedsSetRelatedToRequest = storedFeeds.find(
                (storedFeed: ParseResultType) =>
                    storedFeed.originName === origin
            );

            if (
                feedsSetRelatedToRequest != null &&
                feedsSetRelatedToRequest.feeds
            ) {
                const feedSetIndex = findRequestedFeedSetIndex(
                    storedFeeds,
                    feedsSetRelatedToRequest
                );

                const totalFeeds = copyArray(feedsSetRelatedToRequest.feeds);

                const oldFeed = findFeedToChange(totalFeeds, id);
                if (oldFeed != null) {
                    const oldFeedIndex = totalFeeds.indexOf(oldFeed);
                    totalFeeds[oldFeedIndex] = dataToChange;
                }

                const newFeedsSetRelatedToRequest = {
                    ...feedsSetRelatedToRequest,
                    feeds: totalFeeds,
                };

                storedFeeds[feedSetIndex] = newFeedsSetRelatedToRequest;
                const updateResult = await Feeds?.updateOne(
                    { _uuid: userId },
                    { $set: { data: storedFeeds } }
                );
                if (updateResult?.acknowledged) {
                    response.status(200).send("success");
                } else {
                    throw new CustomError(400, "update failed");
                }
            } else {
                response.status(404).send("feed not found");
            }
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
