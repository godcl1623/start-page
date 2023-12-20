import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import {
    CustomError,
    checkIfDataExists,
    SourceDataInput,
    SourceData,
} from "controllers/sources";
import {
    extractUserIdFrom,
    initializeMongoDBWith,
    defendDataEmptyException,
} from "controllers/common";

export default async function sourceHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const [userId] = extractUserIdFrom(request);
    const { remoteData: sources, Schema: Sources } =
        await initializeMongoDBWith(userId, "sources");

    defendDataEmptyException({
        condition: sources == null,
        userId,
        Schema: Sources,
        customProperty: "sources",
    });

    if (areEqual(request.method, "GET")) {
        try {
            response.status(200).json(sources != null ? JSON.stringify(sources) : '');
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        try {
            const sourceDataInput: SourceDataInput = request.body;

            const urlsList = sources.map(
                (sourceData: SourceData) => sourceData.url
            );

            if (checkIfDataExists(urlsList, sourceDataInput.url)) {
                throw new CustomError(409, "source already exists.");
            }

            const updateResult = await Sources.updateOne(
                { _uuid: userId },
                { $push: { sources: sourceDataInput } }
            );
            if (updateResult.acknowledged) {
                response.status(201).send("success");
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
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    } else {
        response.status(404).send("Not Found");
    }
}
