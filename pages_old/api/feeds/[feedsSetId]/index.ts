import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { checkIfDataExists, CustomError } from "controllers/sources";
import { ParseResultType } from "app/main";
import { extractUserIdFrom, initializeMongoDBWith } from "controllers/common";
import { extractStoredFeedsFromRemote } from "controllers/feeds/new";

export default async function feedsSetIdHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const [userId] = extractUserIdFrom(request);
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
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        try {
            const { feedsSetId } = request.query;
            const data = extractStoredFeedsFromRemote(remoteData);
            const idList = data.map((feedsSet: ParseResultType) => feedsSet.id);

            if (!checkIfDataExists(idList, Number(feedsSetId))) {
                throw new CustomError(404, "feedsSet not exists");
            }

            const filteredList = data.filter(
                (feedsSet: ParseResultType) =>
                    feedsSet.id !== Number(feedsSetId)
            );

            const updateResult = await Feeds?.updateOne(
                { _uuid: userId },
                { $set: { data: filteredList } }
            );

            if (updateResult?.acknowledged) {
                response.status(204).send("success");
            } else {
                throw new CustomError(400, "update failed");
            }
        } catch (error) {
            response.status(400).send(error);
        }
    }
}
