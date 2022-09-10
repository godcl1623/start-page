import React from 'react';
import axios from 'axios';
import Search from 'components/search';
import { HttpRequest } from 'api';
import { FeedsObjectType, FeedsSourceType } from 'types/global';

interface IndexProps {
  rssResponse: string;
  feeds: string;
}

export default function Index({ rssResponse, feeds }: IndexProps) {
  const httpRequest = new HttpRequest();

  React.useEffect(() => {
    if (rssResponse && feeds) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssResponse, 'text/xml');
      const parsedRawFeedData = Array.from(xml.children[0].children[0].children);
      const [feedOrigin, , feedOriginLink] = parsedRawFeedData.slice(0, 5);
      const feedOriginName = feedOrigin.textContent;
      const feedOriginParsedLink = feedOriginLink.textContent;
      const rssFeeds = parsedRawFeedData.slice(5);
      const parsedFeeds = JSON.parse(feeds).feeds;
      const parsedOrigins = JSON.parse(feeds).origins;
      let id = parsedFeeds.length;
      let originId = parsedOrigins.length;
      const feedsObject = rssFeeds.map((feedData: Element) => {
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
      const feedsSource: FeedsSourceType = {
        id: originId,
        originName: feedOriginName,
        originLink: feedOriginParsedLink
      };
      const feedsParseResult = {
        feedsObject,
        feedsSource
      };
      axios.post('/feed', feedsParseResult);
    }
  }, [rssResponse, feeds]);

  return (
    <article className='flex-center w-full h-full bg-neutral-100 dark:bg-neutral-800 dark:text-white'>
      <section className='flex-center w-1/2 h-full'>
        <Search />
      </section>
    </article>
  );
}

export async function getServerSideProps() {
  const httpRequest = new HttpRequest();
  try {
    const { data: rssResponse } = await httpRequest.get('http://localhost:3000/rss');
    const { data: feeds } = await httpRequest.get('http://localhost:3000/feed');
    return {
      props: {
        rssResponse,
        feeds,
      },
    };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
