import Link from 'next/link';
import React from 'react';
import Search from 'components/search';
import { HttpRequest } from 'api';
import useSaveRSS from 'hooks/useSaveRSS';
import Card from 'components/card';
import { FeedsObjectType } from 'types/global';
import { handleSort } from 'common/helpers';
import { SORT_STANDARD, SORT_STANDARD_STATE } from 'common/constants';
import SelectBox from 'components/common/SelectBox';

interface IndexProps {
  rssResponse: string;
  feeds: string;
}

export default function Index({ rssResponse, feeds }: IndexProps) {
  const [currentSort, setCurrentSort] = React.useState(0);
  useSaveRSS(rssResponse, feeds);

  const checkShouldSortByReverse = (sortState: number) => sortState === 1;

  const setSortState = (stateString: string, stateStringArray: string[]) => {
    if (stateStringArray.includes(stateString)) {
      setCurrentSort(stateStringArray.indexOf(stateString));
    } else {
      setCurrentSort(0);
    }
  };

  const feedsToDisplay = JSON.parse(feeds)
    .feeds.sort(handleSort(SORT_STANDARD_STATE[currentSort], checkShouldSortByReverse(currentSort)))
    .map((feed: FeedsObjectType) => <Card cardData={feed} key={feed.id} />);

  return (
    <article className='flex-center flex-col w-full h-max min-h-full bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 overflow-auto'>
      <section className='flex-center w-1/2 h-1/3 my-[10%]'>
        <Search />
      </section>
      <section className='w-1/2 h-max'>
        <section>
          <section className='flex justify-between h-8 mb-4'>
            <section>
              <button className='mr-4 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200'>
                구독 추가
              </button>
              <button className='mr-4 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200'>
                구독 취소
              </button>
              <Link href='/favorites'>
                <a className='mr-4 px-3 py-2 rounded-md shadow-md bg-neutral-100 text-xs text-neutral-700 dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200'>
                  즐겨찾기
                </a>
              </Link>
            </section>
            <SelectBox
              optionValues={SORT_STANDARD}
              customStyles='rounded-md shadow-md text-xs dark:shadow-zinc-600'
              setSortState={setSortState}
            />
          </section>
        </section>
        <section>{feedsToDisplay}</section>
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
