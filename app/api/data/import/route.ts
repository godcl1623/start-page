import { ParseResultType } from "app/main";
import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import { SearchEnginesData } from "controllers/searchEngines";
import { SourceData } from "controllers/sources/helpers";
import { NextRequest, NextResponse } from "next/server";

export interface UploadFileType {
    sources: SourceData[];
    feeds: ParseResultType[];
    searchEngines: SearchEnginesData[];
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
        const uploadedFile: UploadFileType = await req.json();

        if (
            Object.keys(uploadedFile).length < 3 ||
            !("sources" in uploadedFile)
        ) {
            return NextResponse.json(
                {
                    error: "올바르지 않은 파일입니다.",
                },
                { status: 400 }
            );
        }

        const { remoteData: sourceData, Schema: Sources } =
            await initializeMongoDBWith(userId, "sources");
        const { remoteData: feedsData, Schema: Feeds } =
            await initializeMongoDBWith(userId, "feeds");
        const { remoteData: enginesData, Schema: SearchEngines } =
            await initializeMongoDBWith(userId, "searchEngines");
        const userIdUploadForm = { _uuid: userId };

        if (sourceData == null) {
            defendDataEmptyException({
                condition: sourceData == null,
                userId,
                Schema: Sources,
                customProperty: "sources",
            });
        }
        const sourceUploadForm = { sources: uploadedFile.sources };
        const sourceUpdateResult = await Sources.updateOne(
            userIdUploadForm,
            sourceData == null
                ? { $push: sourceUploadForm }
                : { $set: sourceUploadForm }
        );

        if (feedsData == null) {
            defendDataEmptyException({
                condition: feedsData == null,
                userId,
                Schema: Feeds,
                customProperty: "data",
            });
        }
        const feedsUploadForm = { data: uploadedFile.feeds };
        const feedsUpdateResult = await Feeds.updateOne(
            userIdUploadForm,
            feedsData == null
                ? { $push: feedsUploadForm }
                : { $set: feedsUploadForm }
        );

        if (enginesData == null) {
            defendDataEmptyException({
                condition: enginesData == null,
                userId,
                Schema: SearchEngines,
                customProperty: "engines_list",
            });
        }
        const enginesUpdateForm = { engines_list: uploadedFile.searchEngines };
        const enginesUpdateResult = await SearchEngines.updateOne(
            userIdUploadForm,
            enginesData == null
                ? { $push: enginesUpdateForm }
                : { $set: enginesUpdateForm }
        );

        if (
            sourceUpdateResult.acknowledged &&
            feedsUpdateResult.acknowledged &&
            enginesUpdateResult.acknowledged
        ) {
            return NextResponse.json(
                { result: "파일을 성공적으로 불러왔습니다." },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                {
                    error: `파일 업로드에 실패했습니다. (출처: ${sourceUpdateResult.acknowledged}, 피드: ${feedsUpdateResult.acknowledged}, 검색엔진: ${enginesUpdateResult.acknowledged})`,
                },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                error: "파일을 불러올 수 없습니다.",
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
    forbiddenRequest as GET,
    forbiddenRequest as PATCH,
    forbiddenRequest as DELETE,
};
