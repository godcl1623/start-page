import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import {
    CustomError,
    checkIfDataExists,
    updateData,
    SourceDataInput,
    FileContentsInterface,
    SourceData,
} from "controllers/sources";
import { JSON_DIRECTORY } from 'common/constants';

export default async function sourceHandler(
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
    if (areEqual(request.method, "GET")) {
        try {
            response.status(200).json(fileContents);
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        try {
            const sourceDataInput: SourceDataInput = request.body;
            const { sources }: FileContentsInterface = JSON.parse(fileContents);
            const urlsList = sources.map(
                (sourceData: SourceData) => sourceData.url
            );
            if (checkIfDataExists(urlsList, sourceDataInput.url)) {
                throw new CustomError(409, "source already exists.");
            }
            const updateResult = updateData(sources, sourceDataInput);
            if (updateResult) {
                response.status(201).send("success");
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
