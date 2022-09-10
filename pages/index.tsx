import axios from 'axios';
import Search from 'components/search';
import React from 'react';

interface IndexProps {
  rssResponse: string;
}

export default function Index({ rssResponse }: IndexProps) {
  React.useEffect(() => {
    if (rssResponse) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssResponse, 'text/xml');
      console.log(xml);
    }
  }, [rssResponse]);

  return (
    <article className='flex-center w-full h-full bg-neutral-100 dark:bg-neutral-800 dark:text-white'>
      <section className='flex-center w-1/2 h-full'>
        <Search />
      </section>
    </article>
  );
}

export async function getServerSideProps() {
  try {
    const { data } = await axios.get('http://localhost:3000/rss');
    return {
      props: {
        rssResponse: data
      }
    };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};