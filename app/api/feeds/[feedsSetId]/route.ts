import { RouteContext } from "app/api/sources/[sourceId]/route";
import { ParseResultType } from "app/main";
import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { extractStoredFeedsFromRemote } from "controllers/feeds/new";
import { checkIfDataExists } from "controllers/sources";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) return NextResponse.error();
        // const { remoteData, Schema: Feeds } = await initializeMongoDBWith(
        //     userId,
        //     "feeds"
        // );
        const remoteData: ParseResultType[] = [];
        const { feedsSetId } = context.params;
        const data = extractStoredFeedsFromRemote(remoteData);
        const idList = data.map((feedsSet: ParseResultType) => feedsSet.id);

        if (!checkIfDataExists(idList, Number(feedsSetId))) {
            return NextResponse.json(
                JSON.stringify({ status: 404, message: "feedsSet not exists" }),
                { status: 404, statusText: "feedsSet not exists" }
            );
        }

        const filteredList = data.filter(
            (feedsSet: ParseResultType) => feedsSet.id !== Number(feedsSetId)
        );

        // const updateResult = await Feeds?.updateOne(
        //     { _uuid: userId },
        //     { $set: { data: filteredList } }
        // );

        // if (updateResult?.acknowledged) {
        //     return NextResponse.json(
        //         JSON.stringify({ status: 200, message: "success" }),
        //         { status: 200, statusText: "success" }
        //     );
        // } else {
        //     return NextResponse.json(
        //         JSON.stringify({ status: 400, message: "update failed" }),
        //         { status: 400, statusText: "update failed" }
        //     );
        // }
    } catch (error) {
        // console.error(error);
        return NextResponse.json(
            JSON.stringify({ status: 400, message: "update failed" }),
            { status: 400, statusText: "update failed" }
        );
    }
}

function forbiddenRequest() {
    return NextResponse.json({ status: 405, cause: "Method Not Allowed" });
}

export {
    forbiddenRequest as POST,
    forbiddenRequest as PUT,
    forbiddenRequest as PATCH,
    forbiddenRequest as GET,
};
