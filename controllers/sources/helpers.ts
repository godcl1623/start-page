import { JSDOM } from "jsdom";

export interface SourceDataInput {
    name: string;
    url: string;
}

export interface SourceData extends SourceDataInput {
    id: number;
}

export type SourceDataToModify = Partial<SourceDataInput>;

export interface FileContentsInterface {
    sources: SourceData[];
}

export interface UpdateDataOptions {
    originalId?: number;
}

export class CustomError {
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

const RSS_TYPES = [
    "application/rss+xml",
    "application/atom+xml",
    "application/rdf+xml",
    "application/rss",
    "application/atom",
    "application/rdf",
    "text/rss+xml",
    "text/atom+xml",
    "text/rdf+xml",
    "text/rss",
    "text/atom",
    "text/rdf",
];

const RSS_EXCEPTIONS = {
    velog: (username: string) => `https://v2.velog.io/rss/${username}`,
    postype: (url: string) => `${url}/rss`
};

export const checkIfDataValid = (
    dataToCheck: unknown,
    valuesCount: number,
    typeStandard: string
) => {
    if (!dataToCheck || typeof dataToCheck !== "object") {
        return false;
    }
    if (
        Object.values(dataToCheck).length < valuesCount ||
        Object.values(dataToCheck).some(
            (objectValue: unknown) =>
                typeof objectValue !== typeStandard || objectValue === ""
        )
    ) {
        return false;
    }
    return true;
};

export const checkIfDataExists = (
    storedList: unknown[],
    dataToCheck: unknown
) => {
    if (storedList.includes(dataToCheck)) return true;
    return false;
};

export const filterRSSLinks = (rawDocument: string) => {
    const jsdom = new JSDOM(rawDocument);
    const filteredLinks = Array.from(
        jsdom.window.document.querySelectorAll("link")
    )
        ?.filter(
            (linkNode) =>
                linkNode.type != null && RSS_TYPES.includes(linkNode.type)
        )
        .map((rssNode) => rssNode.href)[0];
    return filteredLinks;
};

export const processRSSLinks = (
    originalUrl: string,
    rssLink: string | undefined
) => {
    if (rssLink == null) return null;

    let processedUrl = originalUrl;
    if (originalUrl.endsWith('/')) {
        processedUrl = processedUrl.slice(0, processedUrl.length - 1);
    }

    if (!rssLink.startsWith("http")) {
        if (processedUrl.endsWith(rssLink.slice(0, 3))) {
            return processedUrl + rssLink.slice(3);
        }
        return processedUrl + rssLink;
    } else if (
        rssLink.endsWith("feed", rssLink.length - 1) ||
        rssLink.endsWith("rss", rssLink.length - 1) ||
        rssLink.endsWith("xml", rssLink.length - 1) ||
        rssLink.includes("feed/") ||
        rssLink.includes('rss/')
    ) {
        return rssLink;
    } else if (processedUrl === rssLink) {
        return processedUrl + "/feed";
    } else {
        return null;
    }
};

export const processLinkExceptions = (url: string) => {
    switch (true) {
        case url.includes("velog"):
            const username = url.split("@")[1].split("/")[0];
            return RSS_EXCEPTIONS.velog(username);
        case url.includes('postype'):
            return RSS_EXCEPTIONS.postype(url);
        default:
            return null;
    }
};
