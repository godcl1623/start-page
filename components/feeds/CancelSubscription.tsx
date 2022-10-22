import React from 'react';
import Button from './Button';

interface Props {
  urls: string[];
  originNames: (string | null)[];
}

export default function CancelSubscription({ urls, originNames }: Props) {
  const [subscriptionList, setSubscriptionList] = React.useState<string[]>([]);
  const [originsList, setOriginsList] = React.useState<(string | null)[]>([]);

  React.useEffect(() => {
    if (urls.length > 0) {
      setSubscriptionList(previousArray => previousArray.slice(previousArray.length).concat(urls));
    }
  }, [urls]);

  React.useEffect(() => {
    if (originNames.length > 0) {
      setOriginsList(previousArray =>
        previousArray.slice(previousArray.length).concat(originNames)
      );
    }
  }, [originNames]);

  const subscriptionOptions = subscriptionList.map((url: string, index: number) => (
    <li key={url} className='flex w-full py-2 px-4 list-none'>
      <input type='checkbox' className='mr-2' />
      <label>{originsList[index]}</label>
    </li>
  ));

  return (
    <section className='h-full'>
      <form className='w-full h-full'>
        <h1 className='mb-4 text-xl'>
          구독을 취소할 블로그 / 사이트를
          <br />
          선택해주세요.
        </h1>
        <ul className='flex-center flex-col w-full h-full mb-4'>{subscriptionOptions}</ul>
        <Button type='submit' customStyle={`bg-sky-400 dark:bg-sky-800`}>
          저장
        </Button>
        <Button type='button' customStyle={`dark:bg-neutral-500`}>
          취소
        </Button>
      </form>
    </section>
  );
}
