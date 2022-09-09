import React from 'react';
import SelectBox from './SelectBox';
import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchEngineSelectBox = event.currentTarget[0];
    const searchInput = event.currentTarget[1];
    let selectedSearchEngine = '';
    let inputValue = '';
    if (searchEngineSelectBox instanceof HTMLSelectElement) selectedSearchEngine = searchEngineSelectBox.value;
    if (searchInput instanceof HTMLInputElement) inputValue = searchInput.value;
    window.open(`https://www.google.com/search?q=${inputValue}`, '_newtab');
  }

  return (
    <form className='flex-center w-full h-12 shadow-lg dark:shadow-zinc-600' onSubmit={submitHandler}>
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
