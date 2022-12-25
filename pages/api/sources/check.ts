import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import axios from 'axios';

interface RequestBody {
    url: string;
}

export default async function sourceCheckHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (areEqual(request.method, "GET")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "POST")) {
        try {
            const { url }: RequestBody = request.body;
            const { data } = await axios.get(url);
            response.status(200).json(data);
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
