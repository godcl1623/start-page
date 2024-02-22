import { ParseResultType, ParsedFeedsDataType } from "app/main";

export const findRequestedFeedSetIndex = (
    storedFeeds: ParseResultType[],
    feedsSetRelatedToRequest: ParseResultType
) => storedFeeds.indexOf(feedsSetRelatedToRequest);

export const findFeedToChange = (
    totalFeeds: ParsedFeedsDataType[],
    targetId: string
) => totalFeeds.find((feed: ParsedFeedsDataType) => feed.id === targetId);

export const copyArray = <T>(targetArray: T[]) => [...targetArray];
