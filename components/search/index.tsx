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
    switch (selectedSearchEngine) {
      case 'Google':
        window.open(`https://www.google.com/search?q=${inputValue}`, '_newtab');
        break;
      case 'Naver':
        window.open(`https://search.naver.com/search.naver?query=${inputValue}`, '_newtab');
        break;
      case 'Daum':
        window.open(`https://search.daum.net/search?q=${inputValue}`, '_newtab');
        break;
      case 'MDN':
        window.open(`https://developer.mozilla.org/ko/search?q=${inputValue}`, '_newtab');
        break;
      case 'CanIUse':
        window.open(`https://caniuse.com/?search=${inputValue}`, '_newtab');
        break;
        case 'GitHub':
        window.open(`https://github.com/search?q=${inputValue}`, '_newtab');
        break;
      default:
        window.open(`https://www.google.com/search?q=${inputValue}`, '_newtab');
        break;
    }
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
