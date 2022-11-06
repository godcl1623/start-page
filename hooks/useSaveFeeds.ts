import { areEqual } from 'common/capsuledConditions';
import React from 'react';
import { ParsedFeedsDataType, ParseResultType } from 'types/global';
import { parseXml, makeFeedDataArray, postRSSParseResult } from './helpers';

interface OptionTypes {
  isFilterFavorite?: boolean;
}

const useSaveFeeds = (responseArray: string[], feeds: string, options?: OptionTypes) => {
  const [rawRssArray, setRawRssArray] = React.useState<string[]>([]);
  const [feedsList, setFeedsList] = React.useState<string>('');
  const [newFeeds, setNewFeeds] = React.useState<ParseResultType[]>([]);
  const [isFilterFavorite, setIsFilterFavorite] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (responseArray)
      setRawRssArray((oldArray: string[]) => oldArray.slice(oldArray.length).concat(responseArray));
  }, [responseArray]);

  React.useEffect(() => {
    if (feeds) setFeedsList(feeds);
  }, [feeds]);

  React.useEffect(() => {
    if (options && options.isFilterFavorite != null) {
      setIsFilterFavorite(options.isFilterFavorite);
    }
  }, [options, options?.isFilterFavorite]);

  React.useEffect(() => {
    if (rawRssArray) {
      const totalFeeds = feedsList ? JSON.parse(feedsList).data : [];
      let originId = totalFeeds.length;
      const parseResult = rawRssArray.map((rawRss: string, index: number) => {
        const id = totalFeeds[index] ? totalFeeds[index].feeds.length : 0;
        const { feedOriginName, feedOriginParsedLink, rssFeeds } = parseXml(rawRss);
        const parsedFeedsArray = makeFeedDataArray(rssFeeds, feedOriginName, id);
        const latestFeed: ParsedFeedsDataType = parsedFeedsArray[0];
        if (!areEqual(feedOriginName, totalFeeds[index]?.originName)) {
          const result = {
            id: originId,
            originName: feedOriginName,
            originLink: feedOriginParsedLink,
            lastFeedsLength: parsedFeedsArray.length,
            latestFeedTitle: latestFeed.title,
            feeds: parsedFeedsArray,
          };
          originId += 1;
          return result;
        } else {
          return {
            ...totalFeeds[index],
            lastFeedsLength: parsedFeedsArray.length,
            latestFeedTitle: latestFeed.title,
            feeds: parsedFeedsArray,
          };
        }
      });
      postRSSParseResult(parseResult).then(result => {
        if (result) {
          setNewFeeds(previousFeeds =>
            previousFeeds.slice(previousFeeds.length).concat(result?.data.data)
          );
        }
      });
    }
  }, [rawRssArray, feedsList, isFilterFavorite]);

  if (isFilterFavorite) {
    return newFeeds.map((feedData: ParseResultType) => {
      const filteredFeeds = feedData.feeds?.filter((feed: ParsedFeedsDataType) => feed.isFavorite);
      return {
        ...feedData,
        feeds: filteredFeeds,
      };
    });
  }

  return newFeeds;
};

export default useSaveFeeds;
