import { NextApiRequest, NextApiResponse } from "next";
import { areEqual } from "common/capsuledConditions";
import { ParseResultType } from "pages";
import { handleSort, checkShouldSortByReverse } from "common/helpers";
import {
    initializeMongoDBWith,
    extractUserIdFrom,
    defendDataEmptyException,
} from "controllers/common";
import { SORT_STANDARD_STATE } from "common/constants";
import {
    getPaginationIndexes,
    filterFavorites,
    replaceOriginalWith,
    filterSpecificSources,
    filterByTexts,
    reduceFeedSetsToFeeds,
} from "controllers/feeds";

export default async function feedsHandler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const userId = extractUserIdFrom(request);
    const { remoteData, Schema } = await initializeMongoDBWith(userId, "feeds");

    defendDataEmptyException({
        condition: remoteData == null,
        userId,
        Schema,
        customProperty: "data",
    });

    if (areEqual(request.method, "GET")) {
        try {
            const parsedContents: ParseResultType[] = remoteData;
            const {
                favorites,
                displayOption,
                textOption,
                page,
                per_page,
                sortOption,
            } = request.query;

            const [paginationStartIndex, paginationEndIndex, sortIndex] =
                getPaginationIndexes(page, per_page, sortOption);

            let filteredContents: ParseResultType[] = parsedContents;

            const isFavoriteFilterNeeded = favorites === "true" ? true : false;
            if (isFavoriteFilterNeeded) {
                filteredContents = replaceOriginalWith(
                    filteredContents,
                    filterFavorites(filteredContents)
                );
            }

            const displayState =
                displayOption != null && typeof displayOption === "string"
                    ? JSON.parse(displayOption)
                    : null;
            if (displayState != null && Object.keys(displayState).length > 0) {
                const feedsToDisplay = Object.keys(displayState).filter(
                    (feedSource: string) => displayState[feedSource]
                );
                filteredContents = replaceOriginalWith(
                    filteredContents,
                    filterSpecificSources(filteredContents, feedsToDisplay)
                );
            }

            const textState =
                textOption != null && typeof textOption === "string"
                    ? JSON.parse(textOption)
                    : null;
            if (textState != null && Object.keys(textState).length > 0) {
                const dataSet = Object.entries<string>(textState).filter(
                    (dataSet: string | unknown[]) => dataSet[1] !== ""
                )[0];
                if (dataSet != null) {
                    const [standard, value] = dataSet;
                    filteredContents = replaceOriginalWith(
                        filteredContents,
                        filterByTexts(filteredContents, standard, value)
                    );
                }
            }

            const totalFeedsList = reduceFeedSetsToFeeds(filteredContents);
            const responseBody = {
                data: totalFeedsList
                    ?.sort(
                        handleSort(
                            SORT_STANDARD_STATE[sortIndex],
                            checkShouldSortByReverse(sortIndex)
                        )
                    )
                    .slice(paginationStartIndex, paginationEndIndex),
                count: totalFeedsList?.length,
            };
            response.status(200).json(JSON.stringify(responseBody));
        } catch (error) {
            console.log(error);
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
