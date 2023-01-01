import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { areEqual } from "common/capsuledConditions";
import { JSON_DIRECTORY } from "common/constants";
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
            const { favorites, displayOption, textOption } = request.query;
            const isFavoriteFilterNeeded = favorites === "true" ? true : false;
            const displayState =
                displayOption != null && typeof displayOption === "string"
                    ? JSON.parse(displayOption)
                    : null;
            const textState =
                textOption != null && typeof textOption === "string"
                    ? JSON.parse(textOption)
                    : null;
            let filteredContents: ParseResultType[] = parsedContents;
            if (isFavoriteFilterNeeded) {
                const favoriteFilteredContents = filteredContents.map(
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
                filteredContents = filteredContents
                    .slice(filteredContents.length)
                    .concat(favoriteFilteredContents);
            }
            if (displayState != null && Object.keys(displayState).length > 0) {
                const feedsToDisplay = Object.keys(displayState).filter(
                    (feedSource: string) => displayState[feedSource]
                );
                const displayFilteredContents = filteredContents.filter(
                    (parsedContent: ParseResultType) => {
                        const feedSource = parsedContent.originName ?? "";
                        return feedsToDisplay.includes(feedSource);
                    }
                );
                filteredContents = filteredContents
                    .slice(filteredContents.length)
                    .concat(displayFilteredContents);
            }
            if (textState != null && Object.keys(textState).length > 0) {
                const dataSet = Object.entries<string>(textState).filter(
                    (dataSet: string | unknown[]) => dataSet[1] !== ""
                )[0];
                if (dataSet != null) {
                    const [standard, value] = dataSet;
                    const textFilteredContents = filteredContents.map(
                        (parsedContent: ParseResultType) => {
                            const originalFeeds = parsedContent.feeds;
                            const filteredFeeds = originalFeeds?.filter(
                                (feed: ParsedFeedsDataType) => {
                                    if (standard === "title") {
                                        return feed.title?.includes(value);
                                    } else {
                                        return feed.description?.includes(value);
                                    }
                                }
                            );
                            return {
                                ...parsedContent,
                                feeds: filteredFeeds,
                            };
                        }
                    );
                    filteredContents = filteredContents
                        .slice(filteredContents.length)
                        .concat(textFilteredContents);
                }
            }
            const responseBody = {
                data: filteredContents,
            };
            response.status(200).json(JSON.stringify(responseBody));
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
