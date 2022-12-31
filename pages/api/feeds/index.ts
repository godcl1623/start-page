import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from "common/constants";
import { SourceStateType } from "hooks/useSourceFilters";
import { ParseResultType, ParsedFeedsDataType } from "types/global";

export default async function feedsHandler(
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
        const parsedContents: ParseResultType[] = JSON.parse(fileContents).data;
        try {
            const { favorites, displayOption } = request.query;
            const isFavoriteFilterNeeded = favorites === "true" ? true : false;
            const displayState =
                displayOption != null && typeof displayOption === "string"
                    ? JSON.parse(displayOption)
                    : null;
            if (isFavoriteFilterNeeded) {
                const favoriteFilteredContents = parsedContents.map(
                    (parsedContent: ParseResultType) => {
                        const originalFeeds = parsedContent.feeds;
                        const filteredFeeds = originalFeeds?.filter(
                            (feed: ParsedFeedsDataType) => feed.isFavorite
                        );
                        return {
                            ...parsedContent,
                            feeds: filteredFeeds,
                        };
                    }
                );
                const responseBody = {
                    data: favoriteFilteredContents,
                };
                response.status(200).json(JSON.stringify(responseBody));
                return;
            }
            response.status(200).json(fileContents);
        } catch (error) {
            response.status(400).send(error);
        }
    } else if (areEqual(request.method, "POST")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PUT")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "PATCH")) {
        response.status(405).send("Method Not Allowed");
    } else if (areEqual(request.method, "DELETE")) {
        response.status(405).send("Method Not Allowed");
    }
}
