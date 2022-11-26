import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import {
    CustomError,
    checkIfDataValid,
    checkIfDataExists,
    updateData,
    FileContentsInterface,
    SourceData,
    SourceDataToModify,
    deleteData,
} from "controllers/sources";
import { JSON_DIRECTORY } from 'common/constants';

export default async function sourceNameHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const fileContents = await fs.readFile(
        `${JSON_DIRECTORY}/sources.json`,
        "utf8"
    );
    if (fileContents == null) {
        response.status(404).send("file not exists.");
    }
    const { sources }: FileContentsInterface = JSON.parse(fileContents);
    const idList = sources?.map((sourceData: SourceData) => sourceData.id);
    if (areEqual(request.method, "GET")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "POST")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PUT")) {
        try {
            const { sourceId } = request.query;
            const putDataInput: SourceData = request.body;
            if (!checkIfDataValid(putDataInput, 2, "string")) {
                throw new CustomError(403, "wrong data input");
            }
            if (!checkIfDataExists(idList, Number(sourceId))) {
                throw new CustomError(404, 'source not exists');
            }
            const updateResult = updateData(sources, putDataInput, { originalId: Number(sourceId) });
            if (updateResult) {
                response.status(200).send("success");
            } else {
                throw new CustomError(400, 'update failed');
            }
        } catch (error) {
            if (error instanceof CustomError) {
                response.status(error.code).send(error.message);
            } else {
                response.status(400).send(error);
            }
        }
    } else if (areEqual(request.method, "PATCH")) {
        try {
            const { sourceId } = request.query;
            const putDataInput: SourceDataToModify = request.body;
            if (!checkIfDataValid(putDataInput, 1, "string")) {
                throw new CustomError(403, "wrong data input");
            }
            if (!checkIfDataExists(idList, Number(sourceId))) {
                throw new CustomError(404, 'source not exists');
            }
            const updateResult = updateData(sources, putDataInput, { originalId: Number(sourceId) });
            if (updateResult) {
                response.status(200).send("success");
            } else {
                throw new CustomError(400, 'update failed');
            }
        } catch (error) {
            if (error instanceof CustomError) {
                response.status(error.code).send(error.message);
            } else {
                response.status(400).send(error);
            }
        }
    } else if (areEqual(request.method, "DELETE")) {
        const { sourceId } = request.query;
        try {
            if (!checkIfDataExists(idList, Number(sourceId))) {
                throw new CustomError(404, 'source not exists');
            }
            const deleteResult = deleteData(sources, Number(sourceId));
            if (deleteResult) {
                response.status(204).send("success");
            } else {
                throw new CustomError(400, 'update failed');
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
