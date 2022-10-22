import { areEqual } from 'common/capsuledConditions';
import React from 'react';
import { ParsedFeedsDataType, ParseResultType } from 'types/global';
import { parseXml, makeFeedDataArray, postRSSParseResult } from './helpers';

const useSaveFeeds = (responseArray: string[], feeds: string) => {
  const [rawRssArray, setRawRssArray] = React.useState<string[]>([]);
  const [feedsList, setFeedsList] = React.useState<string>('');
  const [newFeeds, setNewFeeds] = React.useState<ParseResultType[]>([]);

  React.useEffect(() => {
    if (responseArray)
      setRawRssArray((oldArray: string[]) => oldArray.slice(oldArray.length).concat(responseArray));
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
          setNewFeeds(result?.data.data);
        }
      });
    }
  }, [rawRssArray, feedsList]);

  return newFeeds;
};

export default useSaveFeeds;
