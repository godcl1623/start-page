import { newExtractUserIdFrom } from 'controllers/common';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const userId = newExtractUserIdFrom(req);
        if (userId == null) return NextResponse.error();
        return NextResponse.json({ userId });
    } catch (error) {
        return NextResponse.error();
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
