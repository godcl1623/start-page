import React from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export default function SubscribeNew() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget['0'];
    const urlsRule = /^http/;
    let body = {};
    if (input instanceof HTMLInputElement) {
      if (urlsRule.test(input.value)) {
        try {
          body = {
            mode: 'test',
            url: input.value,
          };
          const urlTestResult = await axios.post('/api/urls', body);
          if (urlTestResult) {
            body = {
              ...body,
              mode: 'post',
            };
            const postResult = await axios.post('/api/urls', body);
            if (postResult) {
              alert('저장되었습니다.');
              router.reload();
            }
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) alert('올바르지 않은 피드 주소입니다.');
            else if (error.response?.status === 502) alert('이미 존재하는 주소입니다.');
          } else if (error instanceof Error) {
            throw new Error(error.message);
          }
        }
      } else {
        alert('URL 형식을 확인해주세요.');
      }
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
