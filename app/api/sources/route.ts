import {
    defendDataEmptyException,
    initializeMongoDBWith,
    newExtractUserIdFrom,
} from "controllers/common";
import {
    CustomError,
    SourceData,
    SourceDataInput,
    checkIfDataExists,
} from "controllers/sources";
import { parseCookie } from "controllers/utils";
import { NextRequest, NextResponse } from "next/server";
import { CustomSession, authOptions } from "../auth/[...nextauth]/setting";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        const session = await getServerSession(authOptions);
        if (userId == null) throw NextResponse.error();
        // const { remoteData: sources, Schema: Sources } =
        //     await initializeMongoDBWith(userId, "sources");
        const fileId = (session as CustomSession)?.user?.fileId;
        /* defend data empty exception start */
        if (fileId == null) {
            const metadata = {
                name: "start-page-data.json",
                mimeType: "application/json",
            };
            const defaultFile = {
                sources: [],
                data: [],
            };
            const form = new FormData();
            form.append(
                "metadata",
                new Blob([JSON.stringify(metadata)], {
                    type: "application/json",
                })
            );
            form.append("file", JSON.stringify(defaultFile));
            const fetchResult = await (
                await fetch(
                    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                (session as CustomSession)?.user?.access_token
                            }`,
                        },
                        method: "POST",
                        body: form,
                    }
                )
            ).json();
            if (fetchResult.error) throw NextResponse.error();
            else return NextResponse.json(JSON.stringify(defaultFile));
        }
        /* defend data empty exception end */
        const rawFileContent = await (
            await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            (session as CustomSession)?.user?.access_token
                        }`,
                    },
                }
            )
        ).json();
        const remoteData = rawFileContent.sources;

        // defendDataEmptyException({
        //     condition: sources == null,
        //     userId,
        //     Schema: Sources,
        //     customProperty: "sources",
        // });

        return NextResponse.json(
            remoteData != null ? JSON.stringify(remoteData) : ""
        );
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest) {
    try {
        const [userId] = newExtractUserIdFrom(req);
        const session = await getServerSession(authOptions);
        if (userId == null) throw NextResponse.error();
        // const { remoteData: sources, Schema: Sources } =
        //     await initializeMongoDBWith(userId, "sources");
        const fileId = (session as CustomSession)?.user?.fileId;
        const rawFileContent = await (
            await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            (session as CustomSession)?.user?.access_token
                        }`,
                    },
                }
            )
        ).json();
        const remoteData = rawFileContent.sources;
        const sourceDataInput: SourceDataInput = await req.json();
        const urlsList = remoteData.map(
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

        // const updateResult = await Sources.updateOne(
        //     { _uuid: userId },
        //     { $push: { sources: sourceDataInput } }
        // );
        // if (updateResult.acknowledged) {
        //     return NextResponse.json(
        //         JSON.stringify({ message: "success", status: 201 }),
        //         { status: 201 }
        //     );
        // } else {
        //     return NextResponse.json(
        //         JSON.stringify({
        //             message: "update failed",
        //             status: 400,
        //         }),
        //         {
        //             statusText: "update failed",
        //             status: 400,
        //         }
        //     );
        // }
        const metadata = {
            name: "start-page-data.json",
            mimeType: "application/json",
        };
        const form = new FormData();
        form.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], {
                type: "application/json",
            })
        );
        form.append(
            "file",
            JSON.stringify({
                ...rawFileContent,
                sources: rawFileContent.sources.concat([sourceDataInput]),
            })
        );
        const updateResult = await (
            await fetch(
                `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            (session as CustomSession)?.user?.access_token
                        }`,
                    },
                    method: "PATCH",
                    body: form,
                }
            )
        ).json();
        if (updateResult?.id === fileId) {
            return NextResponse.json(
                JSON.stringify({ message: "success", status: 201 }),
                { status: 201 }
            );
        } else {
            return NextResponse.error();
        }
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
