import React from 'react';
import axios from 'axios';
import Search from 'components/search';
import { HttpRequest } from 'api';

interface IndexProps {
  rssResponse: string;
  foo: string;
}

export default function Index({ rssResponse, foo }: IndexProps) {
  React.useEffect(() => {
    if (rssResponse) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssResponse, 'text/xml');
      const parsedRawFeedData = Array.from(xml.children[0].children[0].children);
      const [feedOrigin, , feedOriginLink] = parsedRawFeedData.slice(0, 5);
      const rssFeeds = parsedRawFeedData.slice(5);
    }
  }, [rssResponse]);

  React.useEffect(() => {
    const foo = {
      id: 1,
      title: 'test2',
      description: 'lorem ipsum dolor amet',
      link: 'http://www.naver.com',
      pubDate: '2022-09-11',
      origin: 'bar',
      isRead: true,
      isFavorite: true,
    };
    // axios.get('/api/staticdata').then((res) => console.log(JSON.parse(res.data)))
    // axios.post('/feed', foo).then(res => console.log(res));
  }, []);

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
    const { data } = await httpRequest.get('http://localhost:3000/rss');
    const { data: foo } = await httpRequest.get('http://localhost:3000/feed');
    return {
      props: {
        rssResponse: data,
        foo
      },
    };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
