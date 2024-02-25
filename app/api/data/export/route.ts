import {
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) {
            return NextResponse.json(
                { error: "사용자 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }
        const { remoteData: sources } = await initializeMongoDBWith(
            userId,
            "sources"
        );
        const { remoteData: feeds } = await initializeMongoDBWith(
            userId,
            "feeds"
        );
        const { remoteData: searchEngines } = await initializeMongoDBWith(
            userId,
            "searchEngines"
        );

        const result = {
            sources: sources ?? [],
            feeds: feeds ?? [],
            searchEngines: searchEngines ?? [],
        };

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                error: "파일 내보내기에 실패했습니다.",
            },
            {
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
