import { ParseResultType, ParsedFeedsDataType } from "app/main";
import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import {
    copyArray,
    findFeedToChange,
    findRequestedFeedSetIndex,
} from "controllers/feeds/feedsSetId/feedId";
import { extractStoredFeedsFromRemote } from "controllers/feeds/new";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) return NextResponse.error();
        // const { remoteData, Schema: Feeds } = await initializeMongoDBWith(
        //     userId,
        //     "feeds"
        // );
        const dataToChange: ParsedFeedsDataType = await req.json();
        const { id, origin } = dataToChange;
        const remoteData: ParseResultType[] = [];

        const storedFeeds = extractStoredFeedsFromRemote(remoteData);
        const feedsSetRelatedToRequest = storedFeeds.find(
            (storedFeed: ParseResultType) => storedFeed.originName === origin
        );

        if (feedsSetRelatedToRequest?.feeds) {
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
            // const updateResult = await Feeds?.updateOne(
            //     { _uuid: userId },
            //     { $set: { data: storedFeeds } }
            // );
            // if (updateResult?.acknowledged) {
            //     return NextResponse.json(
            //         JSON.stringify({ status: 200, message: "success" }),
            //         { status: 200, statusText: "success" }
            //     );
            // } else {
            //     return NextResponse.json(
            //         JSON.stringify({ status: 400, message: "update failed" }),
            //         { status: 400, statusText: "update failed" }
            //     );
            // }
        } else {
            return NextResponse.json(
                JSON.stringify({ status: 404, message: "feed not found" }),
                { status: 404, statusText: "feed not found" }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            JSON.stringify({ status: 400, message: "update failed" }),
            { status: 400, statusText: "update failed" }
        );
    }
}

function forbiddenRequest() {
    return NextResponse.json({ status: 405, cause: "Method Not Allowed" });
}

export {
    forbiddenRequest as POST,
    forbiddenRequest as PUT,
    forbiddenRequest as DELETE,
    forbiddenRequest as GET,
};
