import React from 'react';
import { parseXml, makeFeedDataArray, postRSSParseResult } from './helpers';

const useSaveFeeds = (rssResponse: string, feeds: string) => {
  React.useEffect(() => {
    if (rssResponse && feeds) {
      const parsedFeeds = JSON.parse(feeds).feeds;
      const parsedOrigins = JSON.parse(feeds).origins;
      let id = parsedFeeds.length;
      let originId = parsedOrigins.length;
      const { feedOriginName, feedOriginParsedLink, rssFeeds } = parseXml(rssResponse);
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
  }, [rssResponse, feeds]);
};

export default useSaveFeeds;
