import axios from 'axios';
import { FeedsObjectType, ParseResultType } from 'types/global';

export const parseXml = (rssResponse: string) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rssResponse, 'text/xml');
  const parsedRawFeedData = Array.from(xml.children[0].children[0].children);
  const [feedOrigin, , feedOriginLink] = parsedRawFeedData.slice(0, 5);
  const feedOriginName = feedOrigin.textContent;
  const feedOriginParsedLink = feedOriginLink.textContent;
  const rssFeeds = parsedRawFeedData.slice(5);

  return { feedOriginName, feedOriginParsedLink, rssFeeds };
};

export const makeFeedDataArray = (
  rawFeedsArray: Element[],
  feedOriginName: string | null,
  id: number
) => {
  return rawFeedsArray.map((feedData: Element) => {
    const [title, description, link, , , pubDate] = feedData.children;
    const result: FeedsObjectType = {
      id,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      pubDate: pubDate.textContent,
      origin: feedOriginName,
      isRead: false,
      isFavorite: false,
    };
    id += 1;
    return result;
  });
};

export const postRSSParseResult = async (feedsParseResult: ParseResultType) => {
  try {
    const response = await axios.post('/feed', feedsParseResult);
    return response;
  } catch (error) {
    console.log('새로운 피드가 없습니다');
  }
};
