import React from 'react';
import Search from 'components/search';
import { HttpRequest } from 'api';
import useSaveRSS from 'hooks/useSaveRSS';
import Card from 'components/card';

interface IndexProps {
  rssResponse: string;
  feeds: string;
}

export default function Index({ rssResponse, feeds }: IndexProps) {
  useSaveRSS(rssResponse, feeds);
  const dummy = JSON.parse(feeds).feeds[0];

  return (
    <article className='flex-center flex-col w-full h-full bg-neutral-100 dark:bg-neutral-800 dark:text-white'>
      <section className='flex-center w-1/2 h-[30%]'>
        <Search />
      </section>
      <section className='flex-center w-1/2 h-[70%]'>
        <Card cardData={dummy} />
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
