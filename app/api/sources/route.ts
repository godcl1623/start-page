import { defendDataEmptyException, initializeMongoDBWith, newExtractUserIdFrom } from "controllers/common";
import { SourceDataInput } from 'controllers/sources';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData: sources, Schema: Sources } =
            await initializeMongoDBWith(userId, "sources");
        const response = NextResponse;

        defendDataEmptyException({
            condition: sources == null,
            userId,
            Schema: Sources,
            customProperty: "sources",
        });

        return response.json(sources != null ? JSON.stringify(sources) : '');
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        // const { remoteData: sources, Schema: Sources } =
        //     await initializeMongoDBWith(userId, "sources");
        const sourceDataInput: SourceDataInput = await req.json();
        return NextResponse.json({ sourceDataInput });
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
