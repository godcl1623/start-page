import React from 'react';
import Search from 'components/search';
import { HttpRequest } from 'api';
import useSaveRSS from 'hooks/useSaveRSS';
import Card from 'components/card';
import { FeedsObjectType } from 'types/global';

interface IndexProps {
  rssResponse: string;
  feeds: string;
}

export default function Index({ rssResponse, feeds }: IndexProps) {
  // useSaveRSS(rssResponse, feeds);
  const sortByPubDate = (prev: FeedsObjectType, next: FeedsObjectType) => {
    if (prev.pubDate && next.pubDate) {
      const prevPubDate = new Date(prev.pubDate);
      const nextPubDate = new Date(next.pubDate);
      if (prevPubDate > nextPubDate) return -1;
      else return 1;
    }
  };
  const feedsToDisplay = JSON.parse(feeds)
    .feeds.sort(sortByPubDate)
    .map((feed: FeedsObjectType) => <Card cardData={feed} key={feed.id} />);

  return (
    <article className='flex-center flex-col w-full h-max min-h-full bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 overflow-auto'>
      <section className='flex-center w-1/2 h-1/3 my-[10%]'>
        <Search />
      </section>
      <section className='w-1/2 h-max'>{feedsToDisplay}</section>
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
