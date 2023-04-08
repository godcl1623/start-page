import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import {
    CustomError,
    checkIfDataExists,
    SourceDataInput,
    FileContentsInterface,
    SourceData,
} from "controllers/sources";
import { decryptCookie, parseCookie } from "controllers/utils";
import MongoDB from "controllers/mongodb";

export default async function sourceHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // TODO: MongoDB 초기화 함수 분리(범용) - start
    const { userId, mw } = request.query;
    const id = userId ?? parseCookie(mw);
    const Sources = MongoDB.getSourcesModel();
    const remoteContents = await Sources.find({ _uuid: id }).lean();
    // MongoDB 초기화 함수 분리(범용) - end

    // TODO: 빈 데이터 방어 코드 함수 분리(기본 api) - start
    if (
        remoteContents.length === 0 &&
        typeof id === "string" &&
        id.length > 0
    ) {
        await Sources.insertMany({ _uuid: id, sources: [] });
    }
    // 빈 데이터 방어 코드 함수 분리(기본 api) - end

    if (areEqual(request.method, "GET")) {
        try {
            response.status(200).json(JSON.stringify(remoteContents[0]));
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        try {
            const sourceDataInput: SourceDataInput = request.body;
            const { sources } = remoteContents[0];
            const urlsList = sources.map(
                (sourceData: SourceData) => sourceData.url
            );
            if (checkIfDataExists(urlsList, sourceDataInput.url)) {
                throw new CustomError(409, "source already exists.");
            }
            const updateResult = await Sources.updateOne(
                { _uuid: id },
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
