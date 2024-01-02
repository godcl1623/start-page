import { ParsedFeedsDataType, ParseResultType } from "app/main";

export const getPaginationIndexes = (
    page: string | string[] | null,
    perPage: string | string[] | null,
    sortOption?: string | string[] | null
) => {
    let pageValue =
        page != null && typeof page === "string" ? parseInt(page) : 1;
    let perPageValue =
        perPage != null && typeof perPage === "string" ? parseInt(perPage) : 10;
    let sortIndex =
        sortOption != null && typeof sortOption === "string"
            ? parseInt(sortOption)
            : 0;
    const paginationStartIndex = perPageValue * (pageValue - 1);
    const paginationEndIndex = perPageValue * pageValue;
    return [paginationStartIndex, paginationEndIndex, sortIndex] as const;
};

export const sortFeedSets = (
    a: ParsedFeedsDataType,
    b: ParsedFeedsDataType
) => {
    if (a.pubDate && b.pubDate) {
        const previousDate: Date = new Date(a.pubDate);
        const nextDate = new Date(b.pubDate);
        return previousDate > nextDate ? -1 : 1;
    } else {
        return -1;
    }
};

export const filterFavorites = (feedParseResultArray: ParseResultType[]) =>
    feedParseResultArray.map((parsedContent: ParseResultType) => {
        const originalFeeds = parsedContent.feeds;
        const filteredFeeds = originalFeeds?.filter(
            (feed: ParsedFeedsDataType) => feed.isFavorite
        );
        return {
            ...parsedContent,
            feeds: filteredFeeds,
        };
    });

export const replaceOriginalWith = (
    originalArray: any[],
    arrayToConcat: any[]
) => originalArray.slice(originalArray.length).concat(arrayToConcat);

export const filterSpecificSources = (
    feedParseResultArray: ParseResultType[],
    displayList: string[]
) =>
    feedParseResultArray.filter((parsedContent: ParseResultType) => {
        const feedSource = parsedContent.originName ?? "";
        return displayList.includes(feedSource);
    });

export const filterByTexts = (
    feedParseResultArray: ParseResultType[],
    standard: string,
    value: string
) =>
    feedParseResultArray.map((parsedContent: ParseResultType) => {
        const originalFeeds = parsedContent.feeds;
        const filteredFeeds = originalFeeds?.filter(
            (feed: ParsedFeedsDataType) => {
                if (standard === "title") {
                    return feed.title?.includes(value);
                } else {
                    return feed.description?.includes(value);
                }
            }
        );
        return {
            ...parsedContent,
            feeds: filteredFeeds,
        };
    });

export const reduceFeedSetsToFeeds = (
    feedParseResultArray: ParseResultType[]
) =>
    feedParseResultArray
        ?.reduce(
            (
                totalArray: ParsedFeedsDataType[],
                currentData: ParseResultType
            ) => {
                if (currentData.feeds) {
                    return totalArray.concat(currentData.feeds);
                } else {
                    return totalArray;
                }
            },
            []
        )
        .sort(sortFeedSets);
