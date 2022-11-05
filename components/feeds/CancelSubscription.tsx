import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Button from './Button';

interface Props {
  urls: string[];
  originNames: (string | null)[];
  closeModal: () => void;
}

interface CheckboxValue {
  [key: string]: string | boolean;
}

interface SubscriptionCheckboxes {
  [key: string]: CheckboxValue;
}

export default function CancelSubscription({ urls, originNames, closeModal }: Props) {
  const [subscriptionList, setSubscriptionList] = React.useState<string[]>([]);
  const [originsList, setOriginsList] = React.useState<(string | null)[]>([]);
  const [subscriptionCheckboxes, setSubscriptionCheckboxes] =
    React.useState<SubscriptionCheckboxes>({});
  const router = useRouter();

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

  React.useEffect(() => {
    if (subscriptionList.length > 0 && originsList.length > 0) {
      const valueContainer: SubscriptionCheckboxes = {};
      const objectMadeBySubscriptions = originsList.reduce((acc, curr, index) => {
        let keyText: string;
        if (curr) keyText = curr;
        else keyText = `blog_${index}`;
        acc[keyText] = {
          value: subscriptionList[index],
          checked: false,
          deleteFeeds: false,
        };
        return acc;
      }, valueContainer);
      setSubscriptionCheckboxes(previousObject => ({
        ...previousObject,
        ...objectMadeBySubscriptions,
      }));
    }
  }, [subscriptionList, originsList]);

  const changeSubscriptionState = (target: string, status: boolean) => () => {
    setSubscriptionCheckboxes((previousObject: SubscriptionCheckboxes) => {
      return {
        ...previousObject,
        [target]: {
          ...previousObject[target],
          checked: status,
        },
      };
    });
  };

  const changeDeleteFeedsState = (target: string, status: boolean) => () => {
    setSubscriptionCheckboxes((previousObject: SubscriptionCheckboxes) => {
      return {
        ...previousObject,
        [target]: {
          ...previousObject[target],
          deleteFeeds: status,
        },
      };
    });
  };

  const subscriptionOptions = Object.keys(subscriptionCheckboxes).map(
    (origins: string, index: number) => {
      const { value, checked, deleteFeeds } = subscriptionCheckboxes[origins];
      const inputValue = typeof value === 'string' ? value : '';
      const inputChecked = typeof checked === 'boolean' ? checked : false;
      const deleteFeedsChecked = typeof deleteFeeds === 'boolean' ? deleteFeeds : false;
      return (
        <li key={origins} className='flex justify-between w-full py-2 px-4 list-none cursor-pointer'>
          <div onClick={changeSubscriptionState(origins, !checked)}>
            <input
              name='url'
              type='checkbox'
              className='mr-2 cursor-pointer'
              value={inputValue}
              checked={inputChecked}
              onChange={changeSubscriptionState(origins, !checked)}
            />
            <label className='cursor-pointer'>{originsList[index] || `blog_${index}`}</label>
          </div>
          <input
            name='deleteFeeds'
            type='checkbox'
            className='mr-2 cursor-pointer'
            value={String(deleteFeedsChecked)}
            checked={deleteFeedsChecked}
            onChange={changeDeleteFeedsState(origins, !deleteFeedsChecked)}
          />
        </li>
      );
    }
  );

  const sendChangeUrlsListRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formInputs = event.currentTarget.querySelectorAll('input');
    const checkedInputs = Array.from(formInputs)
      .reduce((resultArray: CheckboxValue[], input, index) => {
        if (input.name === 'url') {
          resultArray.push({
            ...resultArray[index / 2],
            url: input.value,
            unsubscribe: input.checked,
          });
        } else if (input.name === 'deleteFeeds') {
          resultArray[(index - 1) / 2] = {
            ...resultArray[(index - 1) / 2],
            deleteFeeds: input.checked,
          };
        }
        return resultArray;
      }, []);
    try {
      const result = await axios.patch('/api/urls', checkedInputs);
      if (result.data) {
        window.alert('저장되었습니다.');
        router.reload();
      }
    } catch (error) {
      window.alert('오류가 발생했습니다.');
      if (axios.isAxiosError(error)) return Promise.reject(error);
      else if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <section className='h-full'>
      <form className='w-full h-full' onSubmit={sendChangeUrlsListRequest}>
        <h1 className='mb-4 text-xl'>
          구독을 취소할 블로그 / 사이트를
          <br />
          선택해주세요.
        </h1>
        <ul className='relative flex-center flex-col w-full h-full mb-4'>
          {subscriptionOptions}
          <div className='absolute -top-5 right-1 text-sm'>
            피드 삭제
          </div>
        </ul>
        <Button type='submit' customStyle={`bg-sky-400 dark:bg-sky-800`}>
          저장
        </Button>
        <Button type='button' customStyle={`dark:bg-neutral-500`} clickHandler={closeModal}>
          취소
        </Button>
      </form>
    </section>
  );
}
