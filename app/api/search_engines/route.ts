import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData, Schema } = await initializeMongoDBWith(
            userId,
            "searchEngines"
        );

        defendDataEmptyException({
            condition: remoteData == null,
            userId,
            Schema,
            customProperty: "engines_list",
        });

        return NextResponse.json(remoteData);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "err_search_engines_req_failed", status: 400 },
            { status: 400 }
        );
    }
}
