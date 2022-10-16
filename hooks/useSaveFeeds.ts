import React from 'react';
import { ParseResultType, ParsedFeedsDataType } from 'types/global';
import { parseXml, makeFeedDataArray, postRSSParseResult } from './helpers';

const useSaveFeeds = (responseArray: string[], feeds: string) => {
  const [rawRssArray, setRawRssArray] = React.useState<string[]>([]);
  const [feedsList, setFeedsList] = React.useState<string>('');

  React.useEffect(() => {
    if (responseArray) setRawRssArray(responseArray);
  }, [responseArray]);

  React.useEffect(() => {
    if (feeds) setFeedsList(feeds);
  }, [feeds]);

  React.useEffect(() => {
    if (rawRssArray) {
      const totalFeeds = feedsList ? JSON.parse(feedsList).data : [];
      let originId = totalFeeds.length;
      const parseResult = rawRssArray.map((rawRss: string, index: number) => {
        const id = totalFeeds[index] ? totalFeeds[index].feeds.length : 0;
        const { feedOriginName, feedOriginParsedLink, rssFeeds } = parseXml(rawRss);
        const parsedFeedsArray = makeFeedDataArray(rssFeeds, feedOriginName, id);
        const latestFeed: ParsedFeedsDataType = parsedFeedsArray[0];
        if (feedOriginName !== totalFeeds[index]?.originName) {
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
      postRSSParseResult(parseResult);
    }
  }, [rawRssArray, feedsList]);
};

export default useSaveFeeds;
