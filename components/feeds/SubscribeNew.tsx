import React from 'react';
import {
  checkIfFeedOriginValid,
  postNewFeedOrigin,
  refreshPage,
  extractInputValue,
  checkIfStringPassesRule,
} from './utils/helpers';

export default function SubscribeNew() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = event.currentTarget['0'];
    const url = extractInputValue(input);
    const ruleCheckResult = checkIfStringPassesRule(url);

    let isFeedOriginValid = false;
    let postResult = false;

    if (url && ruleCheckResult) {
      isFeedOriginValid = await checkIfFeedOriginValid(ruleCheckResult, url);
    } else {
      alert('URL 형식을 확인해주세요.');
    }

    if (url && isFeedOriginValid) {
      postResult = await postNewFeedOrigin(isFeedOriginValid, url);
    }

    if (postResult) {
      refreshPage(postResult);
    }
  };

  return (
    <section className='w-full h-full'>
      <form
        className='flex flex-col justify-center items-center w-full h-full'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          name='feed_address'
          placeholder='새 피드 주소를 입력해주세요.'
          className='w-full mt-8 mb-4 rounded-md shadow-lg py-2 px-4 text-neutral-700 dark:shadow-zinc-600 dark:focus:outline-sky-600 dark:text-neutral-200'
        />
        <button
          type='submit'
          className='w-20 rounded-md p-1 bg-sky-400 text-neutral-100 dark:bg-sky-800 dark:text-gray-300'
        >
          추가
        </button>
      </form>
    </section>
  );
}
