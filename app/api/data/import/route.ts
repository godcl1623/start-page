import { initializeMongoDBWith, newExtractUserIdFrom } from 'controllers/common';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();

        return NextResponse.json('imported');
    } catch(error) {
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
