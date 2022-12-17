import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from 'common/constants';
import { checkIfDataExists, CustomError } from 'controllers/sources';
import { ParseResultType } from 'types/global';

export default async function feedsSetIdHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const fileContents = await fs.readFile(
        `${JSON_DIRECTORY}/feeds.json`,
        "utf8"
    );
    if (fileContents == null) {
        response.status(404).send("file not exists.");
    }
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
            const { data } = JSON.parse(fileContents);
            const idList = data.map((feedsSet: ParseResultType) => feedsSet.id);
            if(!checkIfDataExists(idList, Number(feedsSetId))) {
                throw new CustomError(404, 'feedsSet not exists');
            }
            const filteredList = data.filter((feedsSet: ParseResultType) => feedsSet.id !== Number(feedsSetId));
            const body = {
                data: filteredList,
            };
            fs.writeFile(`${JSON_DIRECTORY}/feeds.json`, JSON.stringify(body));
            response.status(204).send("success");
        } catch (error) {
            response.status(400).send(error);
        }
    }
}
