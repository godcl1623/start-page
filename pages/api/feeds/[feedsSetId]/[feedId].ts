import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { ParsedFeedsDataType, ParseResultType } from "pages";
import MongoDB from "controllers/mongodb";
import { parseCookie } from "controllers/utils";
import { CustomError } from "controllers/sources";

export default async function feedsSetIdHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // TODO: MongoDB 초기화 함수 분리(범용) - start
    const { mw } = request.query;
    const userId = parseCookie(mw);
    const Feeds = MongoDB.getFeedsModel();
    const remoteData = await Feeds.find({ _uuid: userId }).lean();
    // MongoDB 초기화 함수 분리(범용) - end
    if (areEqual(request.method, "GET")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "POST")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        try {
            // TODO: feeds/new 2번 함수 참조
            const storedFeeds: ParseResultType[] = remoteData[0]
                ? remoteData[0].data
                : [];
            const dataToChange: ParsedFeedsDataType = request.body;
            const { id, origin } = dataToChange;
            const feedsSetRelatedToRequest = storedFeeds.find(
                (storedFeed: ParseResultType) =>
                    storedFeed.originName === origin
            );
            if (
                feedsSetRelatedToRequest != null &&
                feedsSetRelatedToRequest.feeds
            ) {
                // TODO: 통째로 함수로 분리? - start
                const feedSetIndex = storedFeeds.indexOf(
                    feedsSetRelatedToRequest
                );
                const totalFeeds = [...feedsSetRelatedToRequest.feeds];
                const oldFeed = totalFeeds.find(
                    (feed: ParsedFeedsDataType) => feed.id === id
                );
                if (oldFeed != null) {
                    const oldFeedIndex = totalFeeds.indexOf(oldFeed);
                    totalFeeds[oldFeedIndex] = dataToChange;
                }
                const newFeedsSetRelatedToRequest = {
                    ...feedsSetRelatedToRequest,
                    feeds: totalFeeds,
                };
                // 통째로 함수로 분리? - end?
                storedFeeds[feedSetIndex] = newFeedsSetRelatedToRequest;
                const updateResult = await Feeds.updateOne(
                    { _uuid: userId },
                    { $set: { data: storedFeeds } }
                );
                if (updateResult.acknowledged) {
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
