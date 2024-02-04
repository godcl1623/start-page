import { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";

import { ParsedFeedsDataType } from "app/main";

import RequestControllers from "controllers/requestControllers";
import { areEqual } from "common/capsuledConditions";

export const getRssResponses = async (
    feedsUrls: string[]
): Promise<PromiseSettledResult<string>[] | undefined> => {
    const { getDataFrom } = new RequestControllers();
    try {
        const rssRequests = feedsUrls.map((feedUrl: string) =>
            getDataFrom<Promise<string>>(feedUrl)
        );
        const result = await Promise.allSettled(rssRequests);
        return result;
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
    }
};

const findNode = (xmlNodesArray: Element[], nodeName: string) => {
    return xmlNodesArray.find(
        (xmlNode: Element) => xmlNode.nodeName === nodeName
    );
};

const filterNode = (
    xmlNodesArray: Element[],
    nodeName: string,
    isNegative = false
) => {
    const flag = isNegative;
    return xmlNodesArray.filter((xmlNode: Element) => {
        if (flag) return xmlNode.nodeName !== nodeName;
        else return xmlNode.nodeName === nodeName;
    });
};

const separateFeedsAndOriginInfo = (xmlNodesArray: HTMLCollection) => {
    let feedOriginInfo: Element[] = [];
    let rssFeeds: Element[] = [];
    const rawFeedsContainer = xmlNodesArray;
    if (areEqual(rawFeedsContainer.length, 1)) {
        const parsedRawFeedsData = Array.from(rawFeedsContainer[0].children);
        feedOriginInfo = filterNode(parsedRawFeedsData, "item", true);
        rssFeeds = filterNode(parsedRawFeedsData, "item");
    } else {
        const parsedRawFeedsData = Array.from(rawFeedsContainer);
        feedOriginInfo = filterNode(parsedRawFeedsData, "entry", true);
        rssFeeds = filterNode(parsedRawFeedsData, "entry");
    }

    return { feedOriginInfo, rssFeeds };
};

export const parseXml = (rssResponse: string) => {
    const { window } = new JSDOM();
    const parser = new window.DOMParser();
    const xml = parser.parseFromString(rssResponse, "text/xml");
    const rawFeedsContainer = xml.children[0].children;
    const { feedOriginInfo, rssFeeds } =
        separateFeedsAndOriginInfo(rawFeedsContainer);
    const feedOriginName = findNode(feedOriginInfo, "title")?.textContent || "";
    const feedLinkNode = findNode(feedOriginInfo, "link");
    const feedOriginParsedLink = feedLinkNode?.textContent
        ? feedLinkNode?.textContent || ""
        : feedLinkNode?.attributes.getNamedItem("href")?.value || "";

    return { feedOriginName, feedOriginParsedLink, rssFeeds };
};

const stripTags = (stringWithTags: string) => {
    const { window } = new JSDOM();
    const parseResult = new window.DOMParser().parseFromString(
        stringWithTags,
        "text/html"
    );
    return findNode(Array.from(parseResult.children[0].children), "BODY");
};

export const makeFeedDataArray = (
    rawFeedsArray: Element[],
    feedOriginName: string | null,
    id: number
) => {
    return rawFeedsArray.map((feedData: Element) => {
        let feedIndex = id + Math.random();
        const feedDataArray = Array.from(feedData.children);
        const title = findNode(feedDataArray, "title")?.textContent || "무제";
        const content = findNode(feedDataArray, "content")
            ? findNode(feedDataArray, "content")?.textContent
            : findNode(feedDataArray, "content:encoded")?.textContent;
        const description = findNode(feedDataArray, "description")
            ? findNode(feedDataArray, "description")?.textContent ||
              "출처를 참조해주세요."
            : content || "출처를 참조해주세요.";
        const parsedDescription =
            description.length > 250
                ? stripTags(description)?.textContent?.slice(0, 247) + "..."
                : stripTags(description)?.textContent || "출처를 참조해주세요.";
        const pubDate = findNode(feedDataArray, "pubDate")
            ? findNode(feedDataArray, "pubDate")?.textContent || "-"
            : findNode(feedDataArray, "updated")?.textContent || "-";
        const link = findNode(feedDataArray, "link")?.textContent
            ? findNode(feedDataArray, "link")?.textContent || "/"
            : findNode(feedDataArray, "link")?.attributes.getNamedItem("href")
                  ?.value || "/";
        const result: ParsedFeedsDataType = {
            id: `${feedOriginName}_${feedIndex}`,
            title,
            description: parsedDescription,
            link,
            pubDate,
            origin: feedOriginName,
            isRead: false,
            isFavorite: false,
        };
        return result;
    });
};
