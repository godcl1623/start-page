import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import {
    CustomError,
    checkIfDataExists,
    SourceData,
} from "controllers/sources";
import RequestControllers from "controllers/requestControllers";
import { extractUserIdFrom, initializeMongoDBWith } from "controllers/common";

export default async function sourceNameHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const userId = extractUserIdFrom(request);
    const { remoteData: sources, Schema: Sources } = await initializeMongoDBWith(
        userId,
        "sources"
    );

    const idList = sources?.map((sourceData: SourceData) => sourceData.id);
    const { deleteDataOf } = new RequestControllers();
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
            const { sourceId } = request.query;
            if (!checkIfDataExists(idList, Number(sourceId))) {
                throw new CustomError(404, "source not exists");
            }

            const listAfterDelete = sources.filter(
                (_: any, index: number) => index !== Number(sourceId)
            );

            const updateResult = await Sources?.updateOne(
                { _uuid: userId },
                { $set: { sources: listAfterDelete } }
            );
            if (updateResult?.acknowledged) {
                const result = await deleteDataOf(
                    `/feeds/${sourceId}?userId=${userId}`
                );
                if (result.status === 204) {
                    response.status(204).send("success");
                } else {
                    throw new CustomError(400, "update failed");
                }
            } else {
                throw new CustomError(400, "update failed");
            }
        } catch (error) {
            if (error instanceof CustomError) {
                response.status(error.code).send(error.message);
            } else {
                response.status(400).send(error);
            }
        }
    } else {
        response.status(404).send("Not Found");
    }
}
