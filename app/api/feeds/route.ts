import { NextRequest, NextResponse } from "next/server";
import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { ParseResultType } from "app/main";
import {
    filterByTexts,
    filterFavorites,
    filterSpecificSources,
    getPaginationIndexes,
    reduceFeedSetsToFeeds,
    replaceOriginalWith,
} from "controllers/feeds";
import { checkShouldSortByReverse, handleSort } from "common/helpers";
import { SORT_STANDARD_STATE } from "common/constants";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/setting";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        const session = await getServerSession(authOptions);
        if (userId == null) throw NextResponse.error();
        // const { remoteData, Schema } = await initializeMongoDBWith(
        //     userId,
        //     "feeds"
        // );
        const fileId = (session as CustomSession)?.user?.fileId;
        /* defend data empty exception start */
        if (fileId == null) {
            const metadata = {
                name: "start-page-data.json",
                mimeType: "application/json",
            };
            const defaultFile = {
                sources: [],
                data: [],
            };
            const form = new FormData();
            form.append(
                "metadata",
                new Blob([JSON.stringify(metadata)], {
                    type: "application/json",
                })
            );
            form.append("file", JSON.stringify(defaultFile));
            const fetchResult = await (
                await fetch(
                    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                (session as CustomSession)?.user?.access_token
                            }`,
                        },
                        method: "POST",
                        body: form,
                    }
                )
            ).json();
            if (fetchResult.error) throw NextResponse.error();
            else return NextResponse.json(JSON.stringify(defaultFile));
        }
        /* defend data empty exception end */

        const rawFileContent = await (
            await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: {
                    Authorization: `Bearer ${
                        (session as CustomSession)?.user?.access_token
                    }`,
                },
            })
        ).json();
        const remoteData = rawFileContent.data;

        // defendDataEmptyException({
        //     condition: remoteData == null,
        //     userId,
        //     Schema,
        //     customProperty: "data",
        // });

        const parsedContents: ParseResultType[] = remoteData ?? [];
        const getFeedsSearchParams = (parameter: string) =>
            req.nextUrl.searchParams.get(parameter);
        const params = {
            favorites: getFeedsSearchParams("favorites") ?? null,
            displayOption: getFeedsSearchParams("displayOption") ?? null,
            textOption: getFeedsSearchParams("textOption") ?? null,
            page: getFeedsSearchParams("page") ?? null,
            per_page: getFeedsSearchParams("per_page") ?? null,
            sortOption: getFeedsSearchParams("sortOption") ?? null,
        };

        const [paginationStartIndex, paginationEndIndex, sortIndex] =
            getPaginationIndexes(
                params.page,
                params.per_page,
                params.sortOption
            );

        let filteredContents: ParseResultType[] = parsedContents;

        const isFavoriteFilterNeeded =
            params.favorites === "true" ? true : false;
        if (isFavoriteFilterNeeded) {
            filteredContents = replaceOriginalWith(
                filteredContents,
                filterFavorites(filteredContents)
            );
        }

        const displayState =
            params.displayOption != null &&
            typeof params.displayOption === "string"
                ? JSON.parse(params.displayOption)
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
            params.textOption != null && typeof params.textOption === "string"
                ? JSON.parse(params.textOption)
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

        return NextResponse.json(JSON.stringify(responseBody));
    } catch (error) {
        return NextResponse.error();
    }
}

function forbiddenRequest() {
    return NextResponse.json({ status: 405, cause: "Method Not Allowed" });
}

export {
    forbiddenRequest as POST,
    forbiddenRequest as PUT,
    forbiddenRequest as PATCH,
    forbiddenRequest as DELETE,
};
