import React from 'react';
import axios from 'axios';
import { extractFormValues, openSearchResult } from './utils/helpers';
import SelectBox from './SelectBox';

export default function Search() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { selectedSearchEngine, inputValue } = extractFormValues(event);
    openSearchResult(selectedSearchEngine, inputValue);
  }

  React.useEffect(() => {
    const foo = async () => {
      try {
        const bar = await getServerSideProps();
        console.log(bar);
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    };
    foo();
  }, []);

  return (
    <form className='flex-center w-full h-12 shadow-lg dark:shadow-zinc-600' onSubmit={handleSubmit}>
      <SelectBox />
      <input
        name='searchInput'
        type='text'
        placeholder='검색어를 입력해주세요'
        className='w-[calc(100%-6rem)] h-full p-4 dark:focus:outline-sky-600'
      />
      <input
        name='submit'
        type='submit'
        value='검색'
        className='w-24 h-full rounded-r-md bg-sky-400 text-white dark:bg-sky-800 dark:text-gray-300 cursor-pointer'
      />
    </form>
  );
}

const getServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:3001/rss');
    return response;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
