import { NextApiRequest } from 'next';
import { ParsedFeedsDataType, NewParseResultType } from 'types/global';
import {
  returnMutationRequestKeys,
  concatOverlayWithNewData,
  concatNewDataByReplaceOldElement,
} from './helpers';

export const handlePOSTRequest = (request: NextApiRequest, fileContents: string) => {
  const parseResult = request.body;
  if (parseResult.length > 0) {
    const { data } = fileContents ? JSON.parse(fileContents) : { data: [] };
    let newData: NewParseResultType[];
    if (data.length === 0) {
      newData = [...parseResult];
    } else {
      newData = data.map((storedFeedsData: NewParseResultType, index: number) => {
        if (storedFeedsData.originName === parseResult[index]?.originName) {
          const { lastFeedsLength, latestFeedTitle } = storedFeedsData;
          if (
            lastFeedsLength < parseResult[index].lastFeedsLength ||
            latestFeedTitle !== parseResult[index].latestFeedTitle
          ) {
            return {
              ...storedFeedsData,
              lastFeedsLength: parseResult[index].lastFeedsLength,
              latestFeedTitle: parseResult[index].latestFeedTitle,
              feeds: storedFeedsData.feeds
                ?.slice(storedFeedsData.feeds?.length)
                .concat(parseResult[index].feeds),
            };
          } else {
            return storedFeedsData;
          }
        }
      });
    }
    if (data.length >= parseResult.length) {
      return newData;
    } else {
      return newData.concat(parseResult.slice(newData.length));
    }
  } else {
    return JSON.parse(fileContents).data;
  }
};

export const handlePATCHRequest = (request: NextApiRequest, fileContents: string) => {
  const newData = request.body;
  if (newData && newData.id) {
    const { data } = fileContents ? JSON.parse(fileContents) : { data: [] };
    if (!data) return null;
    const dataContainsChangeNeededFeed = data.find((storedFeeds: NewParseResultType) =>
      storedFeeds.feeds?.find((feed: ParsedFeedsDataType) => feed.id === newData.id)
    );
    const newFeeds = dataContainsChangeNeededFeed.feeds.map((feed: ParsedFeedsDataType) => {
      if (feed.id === newData.id) return newData;
      else return feed;
    });
    const newFeedsData = {
      ...dataContainsChangeNeededFeed,
      feeds: newFeeds,
    };
    const newFile = data
      .filter((bar: NewParseResultType) => bar.originName !== newFeedsData.originName)
      .concat([newFeedsData])
      .sort((prev: NewParseResultType, next: NewParseResultType) => prev.id - next.id);
    return newFile;
  } else {
    return false;
  }
};
