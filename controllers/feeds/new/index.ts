import { AxiosResponse } from "axios";
import { areEqual } from "common/capsuledConditions";
import { FileContentsInterface, SourceData } from "controllers/sources";
import { ParseResultType, ParsedFeedsDataType } from "pages";
import { sortFeedSets } from "..";
import { getRssResponses, makeFeedDataArray, parseXml } from "./utils";

export const processGetSourceResult = (
    rawArray: PromiseSettledResult<AxiosResponse>[]
): string[] =>
    rawArray.map((resultData: PromiseSettledResult<AxiosResponse>) => {
        if (resultData.status === "fulfilled") {
            return resultData.value.data;
        }
    });

export const getStoredFeedsFromRemote = (
    remoteData: ParseResultType[]
): ParseResultType[] => (remoteData != null && remoteData[0] ? remoteData : []);

interface ParseFeedsFromSourcesParameters {
    totalFeedsFromSources: string[];
    storedFeeds: ParseResultType[];
    sources: SourceData[];
    originId: number;
}

export const parseFeedsFromSources = ({
    totalFeedsFromSources,
    storedFeeds,
    sources,
    originId,
}: ParseFeedsFromSourcesParameters) =>
    totalFeedsFromSources.map((rawRss: string, index: number) => {
        const indexedFeed =
            storedFeeds[index] != null ? storedFeeds[index].feeds : [];
        const id = indexedFeed != null ? indexedFeed.length : 0;
        const { feedOriginName, feedOriginParsedLink, rssFeeds } =
            parseXml(rawRss);
        const parsedFeedsArray = makeFeedDataArray(
            rssFeeds,
            feedOriginName,
            id
        );
        const latestFeed: ParsedFeedsDataType = parsedFeedsArray[0];
        if (!areEqual(feedOriginName, storedFeeds[index]?.originName)) {
            const result: ParseResultType = {
                id: sources[index].id ? sources[index].id : originId,
                originName: feedOriginName,
                originLink: feedOriginParsedLink,
                lastFeedsLength: parsedFeedsArray.length,
                latestFeedTitle: latestFeed?.title,
                feeds: parsedFeedsArray,
            };
            originId += 1;
            return result;
        } else {
            return {
                ...storedFeeds[index],
                lastFeedsLength: parsedFeedsArray.length,
                latestFeedTitle: latestFeed?.title,
                feeds: parsedFeedsArray,
            };
        }
    });

export const updateFeedSets = (
    parseResult: ParseResultType[],
    storedFeeds: ParseResultType[]
) =>
    parseResult.map((newFeedSet: ParseResultType, feedSetIndex: number) => {
        const { feeds: newFeedsList } = newFeedSet;
        const correspondFeeds = storedFeeds[feedSetIndex]
            ? storedFeeds[feedSetIndex].feeds ?? []
            : [];
        const updatedFeed =
            newFeedsList?.filter(
                (newFeed) =>
                    !correspondFeeds
                        .map((correspondFeed) => correspondFeed.title)
                        .includes(newFeed.title)
            ) ?? [];
        const newFeedsListWithUserStates = correspondFeeds
            .concat(updatedFeed)
            .sort(sortFeedSets);
        return {
            ...newFeedSet,
            lastFeedsLength: newFeedsListWithUserStates.length,
            latestFeedTitle: newFeedsListWithUserStates[0].title,
            feeds: newFeedsListWithUserStates,
        };
    });

export const differentiateArrays = (
    parseResult: ParseResultType[],
    updatedFeedSets: ParseResultType[]
) =>
    parseResult.filter(
        (resultData: ParseResultType, index: number) =>
            resultData.lastFeedsLength !==
                updatedFeedSets[index]?.lastFeedsLength ||
            resultData.latestFeedTitle !==
                updatedFeedSets[index]?.latestFeedTitle
    );

export const makeUpdatedFeedsLists = (updatedFeedSets: ParseResultType[]) =>
    updatedFeedSets
        .reduce(
            (
                totalArray: ParsedFeedsDataType[],
                currenetData: ParseResultType
            ) =>
                currenetData.feeds
                    ? totalArray.concat(currenetData.feeds)
                    : totalArray,
            []
        )
        .sort(sortFeedSets);
