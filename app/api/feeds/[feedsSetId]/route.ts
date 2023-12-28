import { initializeMongoDBWith, newExtractUserIdFrom } from 'controllers/common';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const userId = newExtractUserIdFrom(req);
        if (userId == null) return NextResponse.error();
        // const { remoteData, Schema: Feeds } = await initializeMongoDBWith(
        //     userId,
        //     "feeds"
        // );

        return NextResponse.json({ userId });
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
    forbiddenRequest as GET,
};
