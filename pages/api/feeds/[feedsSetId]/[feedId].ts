import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from "common/constants";
import { ParsedFeedsDataType, ParseResultType } from "types/global";

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
        try {
            const parsedFile: ParseResultType[] = JSON.parse(fileContents).data;
            const dataToChange: ParsedFeedsDataType = request.body;
            const { id, origin } = dataToChange;
            const feedsSetRelatedToRequest = parsedFile.find(
                (storedFeed: ParseResultType) =>
                    storedFeed.originName === origin
            );
            if (feedsSetRelatedToRequest != null && feedsSetRelatedToRequest.feeds) {
                const totalFeeds = [...feedsSetRelatedToRequest.feeds];
                const oldFeed = totalFeeds.find((feed: ParsedFeedsDataType) => feed.id === id);
                if (oldFeed != null) {
                    const oldFeedIndex = totalFeeds.indexOf(oldFeed);
                    totalFeeds[oldFeedIndex] = dataToChange;
                }
                const newData = {
                    data: totalFeeds,
                };
                fs.writeFile(`${JSON_DIRECTORY}/feeds.json`, JSON.stringify(newData));
            } else {
                response.status(404).send('feed not found');
            }
            response.status(200).send("success");
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
