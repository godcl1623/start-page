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
import RequestControllers from 'controllers';
import { parseCookie } from 'controllers/utils';
import MongoDB from 'controllers/mongodb';

export default async function sourceNameHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const { userId, mw } = request.query;
    const id = userId ?? parseCookie(mw);
    const Sources = MongoDB.getSourcesModel();
    const remoteContents = await Sources.find({ _uuid: id }).lean();
    const fileContents = await fs.readFile(
        `${JSON_DIRECTORY}/sources.json`,
        "utf8"
    );
    const { sources } = remoteContents[0];
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
        const { sourceId } = request.query;
        try {
            if (!checkIfDataExists(idList, Number(sourceId))) {
                throw new CustomError(404, 'source not exists');
            }
            const listAfterDelete = sources.filter(
                (_: any, index: number) => index !== Number(sourceId)
            );
            const updateResult = await Sources.updateOne(
                { _uuid: id },
                { $set: { sources: listAfterDelete } }
            );
            if (updateResult.acknowledged) {
                const result = await deleteDataOf(`/feeds/${sourceId}?userId=${id}`);
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
