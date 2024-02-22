import { NextRequest, NextResponse } from "next/server";
import {
    filterRSSLinks,
    processLinkExceptions,
    processRSSLinks,
} from "controllers/sources/helpers";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        const rawUrlTestResponse = await (await fetch(url)).text();
        if (rawUrlTestResponse.startsWith("<?xml")) {
            return NextResponse.json({
                result: true,
                data: rawUrlTestResponse,
                rssUrl: url,
            });
        }

        let processedLink;
        const filteredLink = filterRSSLinks(rawUrlTestResponse);
        processedLink =
            processRSSLinks(url, filteredLink) ?? processLinkExceptions(url);
        if (processedLink != null) {
            const processedTestResponse = await (
                await fetch(processedLink)
            ).text();
            if (processedTestResponse.startsWith("<?xml")) {
                return NextResponse.json({
                    result: true,
                    data: processedTestResponse,
                    rssUrl: processedLink,
                });
            }
        }

        return NextResponse.json({
            result: false,
            data: null,
            rssUrl: null,
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
