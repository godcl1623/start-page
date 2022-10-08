import axios from 'axios';
import { FeedsObjectType, ParseResultType } from 'types/global';

const findNode = (xmlNodesArray: Element[], nodeName: string) => {
  return xmlNodesArray.find((xmlNode: Element) => xmlNode.nodeName === nodeName);
};

const filterNode = (xmlNodesArray: Element[], nodeName: string, isNegative = false) => {
  const flag = isNegative;
  return xmlNodesArray.filter((xmlNode: Element) => {
    if (flag) return xmlNode.nodeName !== nodeName;
    else return xmlNode.nodeName === nodeName;
  });
};

const separateFeedsAndOriginInfo = (xmlNodesArray: HTMLCollection) => {
  let feedOriginInfo: Element[] = [];
  let rssFeeds: Element[] = [];
  const rawFeedsContainer = xmlNodesArray;
  if (rawFeedsContainer.length === 1) {
    const parsedRawFeedsData = Array.from(rawFeedsContainer[0].children);
    feedOriginInfo = filterNode(parsedRawFeedsData, 'item', true);
    rssFeeds = filterNode(parsedRawFeedsData, 'item');
  } else {
    const parsedRawFeedsData = Array.from(rawFeedsContainer);
    feedOriginInfo = filterNode(parsedRawFeedsData, 'entry', true);
    rssFeeds = filterNode(parsedRawFeedsData, 'entry');
  }

  return { feedOriginInfo, rssFeeds };
};

export const parseXml = (rssResponse: string) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rssResponse, 'text/xml');
  const rawFeedsContainer = xml.children[0].children;
  const { feedOriginInfo, rssFeeds } = separateFeedsAndOriginInfo(rawFeedsContainer);
  const feedOriginName = findNode(feedOriginInfo, 'title')?.textContent || '';
  const feedLinkNode = findNode(feedOriginInfo, 'link');
  const feedOriginParsedLink = feedLinkNode?.textContent
    ? feedLinkNode?.textContent || ''
    : feedLinkNode?.attributes.getNamedItem('href')?.value || '';

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
    const response = await axios.post('/api/feed', feedsParseResult);
    return response;
  } catch (error) {
    console.log('새로운 피드가 없습니다');
  }
};
