import React from 'react';
import useHandleFeedOrigin from './hooks/useHandleFeedOrigin';
import {
  refreshPage,
  extractInputValue,
  checkIfStringPassesRule,
} from './utils/helpers';

export default function SubscribeNew() {
  const [inputUrl, setInputUrl] = React.useState<string>('/');
  const [ruleCheckResult, setRuleCheckResult] = React.useState<boolean>(false);
  const [isFeedOriginValid, setIsFeedOriginValid] = React.useState<boolean>(false);
  const [postResult, setPostResult] = React.useState<boolean>(false);
  const checkIfFeedOriginValid = useHandleFeedOrigin('/urls', 'test');
  const postNewFeedOrigin = useHandleFeedOrigin('/urls', 'post');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = event.currentTarget['0'];
    const url = extractInputValue(input);
    const ruleCheckResult = checkIfStringPassesRule(url);

    if (url) setInputUrl(url);
    if (ruleCheckResult) setRuleCheckResult(ruleCheckResult);
    else alert('URL 형식을 확인해주세요.');
  };

  React.useEffect(() => {
    if (inputUrl !== '/' && ruleCheckResult) {
      checkIfFeedOriginValid(inputUrl).then(({ data }) => setIsFeedOriginValid(data));
    }

    if (inputUrl !== '/' && isFeedOriginValid) {
      postNewFeedOrigin(inputUrl).then(({ data }) => setPostResult(data));
    }
  }, [inputUrl, ruleCheckResult, isFeedOriginValid]);

  React.useEffect(() => {
    if (postResult) {
      refreshPage(postResult);
    }
  }, [postResult]);

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
