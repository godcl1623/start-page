import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import NewRequestControllers from "controllers/newRequestControllers";
import { SourceData, checkIfDataExists } from "controllers/sources";
import { parseCookie } from "controllers/utils";
import { NextRequest, NextResponse } from "next/server";

export interface RouteContext {
    params: {
        [key: string]: string;
    };
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    const { deleteDataOf } = new NewRequestControllers();
    try {
        const userId = newExtractUserIdFrom(req);
        if (userId == null) return NextResponse.error();
        const rawId = parseCookie(userId);
        const { remoteData: sources, Schema: Sources } =
            await initializeMongoDBWith(rawId, "sources");
        const idList = sources?.map((sourceData: SourceData) => sourceData.id);
        const { sourceId } = context.params;

        if (!checkIfDataExists(idList, Number(sourceId))) {
            return NextResponse.json(
                JSON.stringify({ status: 404, message: "source not exists" }),
                { status: 404, statusText: "source not exists" }
            );
        }

        const deleteTargetCurrentIndex = sources
            .map((sourceData: SourceData) => sourceData.id)
            .indexOf(Number(sourceId));
        const listAfterDelete = sources
            .slice(0, deleteTargetCurrentIndex)
            .concat(sources.slice(deleteTargetCurrentIndex + 1));

        const updateResult = await Sources?.updateOne(
            { _uuid: rawId },
            { $set: { sources: listAfterDelete } }
        );
        if (updateResult?.acknowledged) {
            const deleteResult = await deleteDataOf<string>(
                `/feeds/${sourceId}?userId=${userId}`
            );
            const { status } = JSON.parse(deleteResult);
            if (status === 200) {
                return NextResponse.json(
                    JSON.stringify({ status: 200, message: "success" }),
                    { status: 200, statusText: "success" }
                );
            } else {
                return NextResponse.json(
                    JSON.stringify({ status: 400, message: "update failed" }),
                    { status: 400, statusText: "update failed" }
                );
            }
        } else {
            return NextResponse.json(
                JSON.stringify({ status: 400, message: "update failed" }),
                { status: 400, statusText: "update failed" }
            );
        }
    } catch (error) {
        console.error(error);
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
    forbiddenRequest as GET,
    forbiddenRequest as PUT,
    forbiddenRequest as POST,
    forbiddenRequest as PATCH,
};
