import React from 'react';
import { parseXml, makeFeedDataArray, postRSSParseResult } from './helpers';

const useSaveFeeds = (rssResponse: string, feeds: string) => {
  const [rawRss, setRawRss] = React.useState<string>('');
  const [feedsList, setFeedsList] = React.useState<string>('');

  React.useEffect(() => {
    if (rssResponse) setRawRss(rssResponse);
  }, [rssResponse]);

  React.useEffect(() => {
    if (feeds) setFeedsList(feeds);
  }, [feeds]);

  React.useEffect(() => {
    if (rawRss && feedsList) {
      const parsedFeeds = JSON.parse(feedsList).feeds;
      const parsedOrigins = JSON.parse(feedsList).origins;
      let id = parsedFeeds.length;
      let originId = parsedOrigins.length;
      const { feedOriginName, feedOriginParsedLink, rssFeeds } = parseXml(rawRss);
      const feedsObjectArray = makeFeedDataArray(rssFeeds, feedOriginName, id);
      const feedsSourceArray = [
        {
          id: originId,
          originName: feedOriginName,
          originLink: feedOriginParsedLink,
        },
      ];
      const feedsParseResult = {
        feedsObjectArray,
        feedsSourceArray,
      };

      postRSSParseResult(feedsParseResult);
    }
  }, [rawRss, feedsList]);
};

export default useSaveFeeds;
