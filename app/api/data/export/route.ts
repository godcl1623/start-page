import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData: sources, Schema: Sources } =
            await initializeMongoDBWith(userId, "sources");
        const { remoteData: feeds, Schema: Feeds } =
            await initializeMongoDBWith(userId, "feeds");
        const { remoteData: searchEngines, Schema: SearchEngines } =
            await initializeMongoDBWith(userId, "searchEngines");

        const result = {
            sources: sources ?? [],
            feeds: feeds ?? [],
            searchEngines: searchEngines ?? [],
        };

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            JSON.stringify({
                message: "download failed",
                status: 400,
            }),
            {
                statusText: "download failed",
                status: 400,
            }
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
    forbiddenRequest as DELETE,
};
