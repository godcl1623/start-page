import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from 'common/constants';
import { checkIfDataExists, CustomError } from 'controllers/sources';
import { ParseResultType } from 'types/global';
import { parseCookie } from 'controllers/utils';
import MongoDB from 'controllers/mongodb';

export default async function feedsSetIdHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { userId, mw } = request.query;
    const id = userId ?? parseCookie(mw);
    const Feeds = MongoDB.getFeedsModel();
    const remoteData = await Feeds.find({ _uuid: id }).lean();

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
            const data: ParseResultType[] = remoteData[0]
                ? remoteData[0].data
                : [];
            const idList = data.map((feedsSet: ParseResultType) => feedsSet.id);
            if(!checkIfDataExists(idList, Number(feedsSetId))) {
                throw new CustomError(404, 'feedsSet not exists');
            }
            const filteredList = data.filter((feedsSet: ParseResultType) => feedsSet.id !== Number(feedsSetId));
            const updateResult = await Feeds.updateOne(
                { _uuid: userId },
                { $set: { data: filteredList } }
            );
            if (updateResult.acknowledged) {
                response.status(204).send("success");
            } else {
                throw new CustomError(400, "update failed");
            }
        } catch (error) {
            response.status(400).send(error);
        }
    }
}
