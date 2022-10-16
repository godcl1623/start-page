import { NextApiRequest } from 'next';
import { ParsedFeedsDataType, ParseResultType } from 'types/global';
import { isRearBiggerThanFront, areEqual, aOrB } from 'common/capsuledConditions';

export const handlePOSTRequest = (request: NextApiRequest, fileContents: string) => {
  const parseResult: ParseResultType[] = request.body;
  const { data } = fileContents ? JSON.parse(fileContents) : { data: [] };
  if (areEqual(parseResult.length, 0)) return data;
  if (areEqual(data.length, 0)) return [...parseResult];
  const newData = data.map((storedFeedsData: ParseResultType, index: number) => {
    const {
      lastFeedsLength: storedLastFeedsLength,
      latestFeedTitle: storedLatestFeedTitle,
      feeds: storedFeeds,
    } = storedFeedsData;
    const { lastFeedsLength, latestFeedTitle, feeds } = parseResult[index];
    if (
      aOrB(
        isRearBiggerThanFront(storedLastFeedsLength, lastFeedsLength),
        !areEqual(storedLatestFeedTitle, latestFeedTitle)
      )
    ) {
      return {
        ...storedFeedsData,
        lastFeedsLength,
        latestFeedTitle,
        feeds: storedFeeds?.slice(storedFeeds?.length).concat(feeds || []),
      };
    } else {
      return storedFeedsData;
    }
  });
  if (data.length >= parseResult.length) {
    return newData;
  } else {
    return newData.concat(parseResult.slice(newData.length));
  }
};

export const handlePATCHRequest = (request: NextApiRequest, fileContents: string) => {
  const newData = request.body;
  if (!newData) return false;
  const { data } = fileContents ? JSON.parse(fileContents) : { data: [] };
  if (!data) return null;
  const dataContainsChangeNeededFeed = data.find((storedFeeds: ParseResultType) =>
    storedFeeds.feeds?.find((feed: ParsedFeedsDataType) => feed.id === newData.id)
  );
  const newFeeds = dataContainsChangeNeededFeed.feeds.map((feed: ParsedFeedsDataType) => {
    if (areEqual(feed.id, newData.id)) return newData;
    else return feed;
  });
  const newFeedsData = {
    ...dataContainsChangeNeededFeed,
    feeds: newFeeds,
  };
  const newFile = data
    .filter((storedFeeds: ParseResultType) => storedFeeds.originName !== newFeedsData.originName)
    .concat([newFeedsData])
    .sort((prev: ParseResultType, next: ParseResultType) => prev.id - next.id);
  return newFile;
};
