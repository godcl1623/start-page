import React from 'react';
import SelectBox from './SelectBox';

export default function Search() {
  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(event);
  }
  return (
    <form className='flex-center w-full h-12 shadow-lg' onSubmit={submitHandler}>
      <SelectBox />
      <input
        name='searchInput'
        type='text'
        placeholder='검색어를 입력해주세요'
        className='w-[calc(100%-6rem)] h-full p-4'
      />
      <input
        name='submit'
        type='submit'
        value='검색'
        className='w-24 h-full rounded-r-md bg-sky-400 text-white'
      />
    </form>
  );
}
