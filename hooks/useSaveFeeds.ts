import React from 'react';
import { FeedsObjectType } from 'types/global';
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
      const parsedFeeds = feedsList ? JSON.parse(feedsList).feeds : [];
      const parsedOrigins = feedsList ? JSON.parse(feedsList).origins : [];
      let id = parsedFeeds.length;
      let originId = parsedOrigins.length;
      rawRssArray.forEach((rawRss: string) => {
        const { feedOriginName, feedOriginParsedLink, rssFeeds } = parseXml(rawRss);
        const feedsObjectArray = makeFeedDataArray(rssFeeds, feedOriginName, id);
        const latestFeed: FeedsObjectType = feedsObjectArray[0];
        const feedsSourceArray = [
          {
            id: originId,
            originName: feedOriginName,
            originLink: feedOriginParsedLink,
            lastFeedsLength: feedsObjectArray.length,
            latestFeedTitle: latestFeed.title,
          },
        ];
        const feedsParseResult = {
          feedsObjectArray,
          feedsSourceArray,
        };
  
        postRSSParseResult(feedsParseResult);
        originId += 1;
      });
    }
  }, [rawRssArray, feedsList]);
};

export default useSaveFeeds;
