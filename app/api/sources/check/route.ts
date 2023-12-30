import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        const fetchResponse = await (await fetch(url)).text();
        const checkResult = fetchResponse.startsWith("<?xml");
        return NextResponse.json({
            result: checkResult,
            data: checkResult ? fetchResponse : null,
        });
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
    forbiddenRequest as DELETE,
    forbiddenRequest as PATCH,
};
