import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { getPaginationIndexes } from "controllers/feeds";
import { parseCookie } from "controllers/utils";
import { NextRequest, NextResponse } from "next/server";
import { SourceData } from "controllers/sources";
import { getRssResponses } from "controllers/feeds/new/utils";
import { AxiosResponse } from "axios";
import {
    differentiateArrays,
    extractFeedsFromSources,
    extractStoredFeedsFromRemote,
    makeUpdatedFeedsLists,
    parseFeedsFromSources,
    updateFeedSetsDataBy,
} from "controllers/feeds/new";
import { ParseResultType } from "app/main";
import { getServerSession } from 'next-auth';
import { CustomSession, authOptions } from 'app/api/auth/[...nextauth]/setting';

export async function GET(req: NextRequest) {
    try {
        const [userId, rawId] = newExtractUserIdFrom(req);
        const session = await getServerSession(authOptions);
        if (userId == null) throw NextResponse.error();
        // const { remoteData } = await initializeMongoDBWith(userId, "feeds");
        const fileId = (session as CustomSession)?.user?.fileId;
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

            const updatedFeedSets = updateFeedSetsDataBy(
                parseResult,
                storedFeeds
            );

            const totalFeedsList = makeUpdatedFeedsLists(updatedFeedSets);
            const responseBody = {
                data: totalFeedsList.slice(
                    paginationStartIndex,
                    paginationEndIndex
                ),
                count: totalFeedsList.length,
            };

            const differentiateResult = differentiateArrays(
                updatedFeedSets,
                storedFeeds
            );

            if (storedFeeds.length === 0 || differentiateResult.length > 0) {
                fetch(
                    `${process.env.NEXT_PUBLIC_REQUEST_API}/feeds/new?userId=${rawId}`,
                    {
                        body: JSON.stringify(updatedFeedSets),
                        method: "POST",
                    }
                );
                return NextResponse.json(responseBody);
            } else {
                return NextResponse.json("no new feeds available");
            }
        } else {
            return NextResponse.error();
        }
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        // const { Schema: Feeds } = await initializeMongoDBWith(userId, "feeds");
        const dataToWrite: ParseResultType[] = await req.json();
        // const updateResult = await Feeds?.updateOne(
        //     { _uuid: userId },
        //     { $set: { data: dataToWrite } }
        // );
        // if (updateResult?.acknowledged) {
        //     return NextResponse.json("success");
        // } else {
        //     return NextResponse.error();
        // }
    } catch (error) {
        return NextResponse.error();
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
