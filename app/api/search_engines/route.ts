import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { SearchEnginesData } from "controllers/searchEngines";
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

        return NextResponse.json(remoteData ?? []);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "err_search_engines_req_failed", status: 400 },
            { status: 400 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData, Schema: SearchEngines } =
            await initializeMongoDBWith(userId, "searchEngines");
        const searchEnginesInput: SearchEnginesData[] = await req.json();

        defendDataEmptyException({
            condition: remoteData == null,
            userId,
            Schema: SearchEngines,
            customProperty: "engines_list",
        });

        if (
            searchEnginesInput == null ||
            (Array.isArray(searchEnginesInput) &&
                searchEnginesInput.length === 0) ||
            (Array.isArray(searchEnginesInput) &&
                searchEnginesInput.length > 0 &&
                !("name" in searchEnginesInput[0]) &&
                !("url" in searchEnginesInput[0]))
        ) {
            return NextResponse.json(
                { error: "err_search_engines_wrong_data_input", status: 400 },
                { status: 400 }
            );
        }

        const updateResult = await SearchEngines.updateOne(
            { _uuid: userId },
            remoteData == null
                ? { $push: { engines_list: searchEnginesInput } }
                : { $set: { engines_list: searchEnginesInput } }
        );
        if (updateResult.acknowledged) {
            return NextResponse.json(
                JSON.stringify({ message: "success", status: 201 }),
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                { error: "update failed", status: 400 },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "update failed", status: 400 },
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
