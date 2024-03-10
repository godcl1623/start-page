import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import {
    SourceData,
    SourceDataInput,
    checkIfDataExists,
} from "controllers/sources/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData: sources, Schema: Sources } =
            await initializeMongoDBWith(userId, "sources");

        defendDataEmptyException({
            condition: sources == null,
            userId,
            Schema: Sources,
            customProperty: "sources",
        });

        return NextResponse.json(
            sources != null ? JSON.stringify(sources) : "[]"
        );
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) throw NextResponse.error();
        const { remoteData: sources, Schema: Sources } =
            await initializeMongoDBWith(userId, "sources");
        const sourceDataInput: SourceDataInput = await req.json();
        const urlsList = sources.map(
            (sourceData: SourceData) => sourceData.url
        );
        if (checkIfDataExists(urlsList, sourceDataInput.url)) {
            return NextResponse.json(
                JSON.stringify({
                    message: "source already exists.",
                    status: 409,
                }),
                {
                    statusText: "source already exists.",
                    status: 409,
                }
            );
        }

        const updateResult = await Sources.updateOne(
            { _uuid: userId },
            { $push: { sources: sourceDataInput } }
        );
        if (updateResult.acknowledged) {
            return NextResponse.json(
                JSON.stringify({ message: "success", status: 201 }),
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                JSON.stringify({
                    message: "update failed",
                    status: 400,
                }),
                {
                    statusText: "update failed",
                    status: 400,
                }
            );
        }
    } catch (error) {
        return NextResponse.error();
    }
}

export async function PUT(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        if (userId == null) {
            return NextResponse.json(
                { error: "사용자 정보를 찾을 수 없습니다." },
                { status: 404 }
            );
        }
        const { remoteData: sourceData, Schema: Sources } = await initializeMongoDBWith(
            userId,
            "sources"
        );
        const sourceDataInput: SourceDataInput = await req.json();
        const sourceUpdateResult = await Sources.updateOne(
            { _uuid: userId },
            { $set: { sources: sourceDataInput } }
        );
        if (sourceUpdateResult.acknowledged) {
            return NextResponse.json(
                {
                    result: "success",
                },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                JSON.stringify({
                    message: "update failed",
                    status: 400,
                }),
                {
                    statusText: "update failed",
                    status: 400,
                }
            );
        }
    } catch (error) {
        return NextResponse.json(
            JSON.stringify({
                message: "update failed",
                status: 400,
            }),
            {
                statusText: "update failed",
                status: 400,
            }
        );
    }
}

function forbiddenRequest() {
    return NextResponse.json({ status: 405, cause: "Method Not Allowed" });
}

export { forbiddenRequest as PATCH, forbiddenRequest as DELETE };
