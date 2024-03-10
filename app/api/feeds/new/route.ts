import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { getPaginationIndexes } from "controllers/feeds";
import { parseCookie } from "controllers/utils";
import { NextRequest, NextResponse } from "next/server";
import { SourceData } from "controllers/sources/helpers";
import { getRssResponses } from "controllers/feeds/new/utils";
import {
    differentiateArrays,
    extractFeedsFromSources,
    extractStoredFeedsFromRemote,
    makeUpdatedFeedsLists,
    parseFeedsFromSources,
    updateFeedSetsDataBy,
} from "controllers/feeds/new";
import { ParseResultType } from "app/main";

export async function GET(req: NextRequest) {
    try {
        const [userId, rawId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData } = await initializeMongoDBWith(userId, "feeds");

        const [paginationStartIndex, paginationEndIndex] = getPaginationIndexes(
            "1",
            "10"
        );
        const sourceResponse = await fetch(
            `${process.env.NEXT_PUBLIC_REQUEST_API}/sources?userId=${rawId}`
        );

        const sources: SourceData[] = JSON.parse(await sourceResponse.json());
        const urlsToGetFeeds = sources
            ? sources.map((sourceData: SourceData) => sourceData.url)
            : [];
        const result: PromiseSettledResult<string>[] | undefined =
            await getRssResponses(urlsToGetFeeds);

        if (result != null) {
            const totalFeedsFromSources = extractFeedsFromSources(result);

            const storedFeeds = extractStoredFeedsFromRemote(remoteData);

            let originId = sources?.length > 0 ? storedFeeds.length : 0;
            const parseResult = parseFeedsFromSources({
                totalFeedsFromSources,
                storedFeeds,
                sources,
                originId,
            });

            const sourceNameList = sources.map((sources) => sources.name);
            const parsedNameList = parseResult.map((data) => data.originName);
            const areNamesSame = sourceNameList.every((sourceName) =>
                parsedNameList.includes(sourceName)
            );
            if (!areNamesSame) {
                const newSourceList = sources.map((sourceData, index) => ({
                    ...sourceData,
                    name: parsedNameList[index],
                }));
                const result = await fetch(
                    `${process.env.NEXT_PUBLIC_REQUEST_API}/sources?userId=${rawId}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(newSourceList)
                    }
                );
            }

            const updatedFeedSets = updateFeedSetsDataBy(
                parseResult,
                storedFeeds
            );

            const totalFeedsList = makeUpdatedFeedsLists(updatedFeedSets);

            const differentiateResult = differentiateArrays(
                updatedFeedSets,
                storedFeeds
            );

            const responseBody = {
                data: totalFeedsList.slice(
                    paginationStartIndex,
                    paginationEndIndex
                ),
                count: totalFeedsList.length,
                updated: differentiateResult,
            };

            if (storedFeeds.length === 0 || differentiateResult > 0) {
                const postResult = await (
                    await fetch(
                        `${process.env.NEXT_PUBLIC_REQUEST_API}/feeds/new?userId=${rawId}`,
                        {
                            body: JSON.stringify(updatedFeedSets),
                            method: "POST",
                        }
                    )
                ).json();
                if (postResult === "success") {
                    return NextResponse.json(responseBody);
                } else {
                    return NextResponse.json(postResult);
                }
            } else {
                return NextResponse.json({ result: "no new feeds available" });
            }
        } else {
            return NextResponse.json(
                { error: "err_no_source", status: 400 },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "err_renew_req_failed", status: 400 },
            { status: 400 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { Schema: Feeds } = await initializeMongoDBWith(userId, "feeds");
        const dataToWrite: ParseResultType[] = await req.json();
        const updateResult = await Feeds?.updateOne(
            { _uuid: userId },
            { $set: { data: dataToWrite } }
        );
        if (updateResult?.acknowledged) {
            return NextResponse.json("success");
        } else {
            return NextResponse.json(
                { error: "update failed", status: 400 },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "err_renew_req_failed", status: 400 },
            { status: 400 }
        );
    }
}

function forbiddenRequest() {
    return NextResponse.json({ status: 405, cause: "Method Not Allowed" });
}

export {
    forbiddenRequest as PUT,
    forbiddenRequest as PATCH,
    forbiddenRequest as DELETE,
};
