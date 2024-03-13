import { ParsedFeedsDataType } from "app/main";
import { areEqual } from "common/capsuledConditions";
import Router from "next/router";

const URLS_RULE = /^http/;

export const extractInputValue = (element: Element) => {
    if (element instanceof HTMLInputElement) return element.value;
};

export const checkIfStringPassesRule = (
    target: string | undefined,
    rule = URLS_RULE
) => {
    if (target) return rule.test(target);
};

export const refreshPage = (flag: boolean) => {
    const condition = flag;

    if (condition) {
        alert("저장되었습니다.");
        Router.reload();
    }
};

export const parseClientXml = (rssResponse: string) => {
    const parser = new window.DOMParser();
    const xml = parser.parseFromString(rssResponse, "text/xml");
    const rawFeedsContainer = xml.children[0].children;
    const { feedOriginInfo, rssFeeds } =
        separateClientFeedsAndOriginInfo(rawFeedsContainer);
    const feedOriginName =
        findClientNode(feedOriginInfo, "title")?.textContent ?? "";
    const feedLinkNode = findClientNode(feedOriginInfo, "link");
    const feedOriginParsedLink = feedLinkNode?.textContent
        ? feedLinkNode?.textContent ?? ""
        : feedLinkNode?.attributes.getNamedItem("href")?.value ?? "";

    return { feedOriginName, feedOriginParsedLink, rssFeeds };
};

const separateClientFeedsAndOriginInfo = (xmlNodesArray: HTMLCollection) => {
    let feedOriginInfo: Element[] = [];
    let rssFeeds: Element[] = [];
    const rawFeedsContainer = xmlNodesArray;
    if (areEqual(rawFeedsContainer.length, 1)) {
        const parsedRawFeedsData = Array.from(rawFeedsContainer[0].children);
        feedOriginInfo = filterClientNode(parsedRawFeedsData, "item", true);
        rssFeeds = filterClientNode(parsedRawFeedsData, "item");
    } else {
        const parsedRawFeedsData = Array.from(rawFeedsContainer);
        feedOriginInfo = filterClientNode(parsedRawFeedsData, "entry", true);
        rssFeeds = filterClientNode(parsedRawFeedsData, "entry");
    }

    return { feedOriginInfo, rssFeeds };
};

const findClientNode = (xmlNodesArray: Element[], nodeName: string) => {
    return xmlNodesArray.find(
        (xmlNode: Element) => xmlNode.nodeName === nodeName
    );
};

const filterClientNode = (
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

export const makeClientFeedDataArray = (
    rawFeedsArray: Element[],
    feedOriginName: string | null,
    id: number
) => {
    return rawFeedsArray.map((feedData: Element) => {
        let feedIndex = id + Math.random();
        const feedDataArray = Array.from(feedData.children);
        const title =
            findClientNode(feedDataArray, "title")?.textContent ?? "무제";
        const content = findClientNode(feedDataArray, "content")
            ? findClientNode(feedDataArray, "content")?.textContent
            : findClientNode(feedDataArray, "content:encoded")?.textContent;
        const description = findClientNode(feedDataArray, "description")
            ? findClientNode(feedDataArray, "description")?.textContent ??
              "출처를 참조해주세요."
            : content ?? "출처를 참조해주세요.";
        const parsedDescription =
            description.length > 250
                ? stripClientTags(description)?.textContent?.slice(0, 247) +
                  "..."
                : stripClientTags(description)?.textContent ??
                  "출처를 참조해주세요.";
        const pubDate = findClientNode(feedDataArray, "pubDate")
            ? findClientNode(feedDataArray, "pubDate")?.textContent ?? "-"
            : findClientNode(feedDataArray, "updated")?.textContent ?? "-";
        const link = findClientNode(feedDataArray, "link")?.textContent
            ? findClientNode(feedDataArray, "link")?.textContent ?? "/"
            : findClientNode(feedDataArray, "link")?.attributes.getNamedItem(
                  "href"
              )?.value ?? "/";
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

const stripClientTags = (stringWithTags: string) => {
    const parseResult = new window.DOMParser().parseFromString(
        stringWithTags,
        "text/html"
    );
    return findClientNode(Array.from(parseResult.children[0].children), "BODY");
};
