import React from 'react';
import axios from 'axios';
import { AiFillStar as FavoriteIcon, AiFillRead as CheckIcon } from 'react-icons/ai';
import { ParsedFeedsDataType } from 'types/global';
import { isTodayLessThanExtraDay } from 'common/helpers';
import useDerivedStateFromProps from './hooks/useDerivedStateFromProps';
import Checkbox from './Checkbox';

type CardProps = {
  cardData: ParsedFeedsDataType;
};

type CallbackType = (value: any) => void;

export default function Card({ cardData }: CardProps) {
  const { title, description, link, pubDate, origin, isRead, isFavorite } = cardData;
  const parsedPubDate = new Date(pubDate as string).toDateString();
  const [readState, setReadState] = useDerivedStateFromProps<boolean>(isRead);
  const [favoriteState, setFavoriteState] = useDerivedStateFromProps<boolean>(isFavorite);
  const [dateState, setDateState] = React.useState(false);

  function handleCard(event: React.MouseEvent) {
    if (!(event.target instanceof SVGElement)) {
      const newData = {
        ...cardData,
        isRead: true,
        isFavorite: favoriteState,
      };
      axios.patch('/api/feed', newData);
      // if (link) window.location.assign(link);
    }
  }

  function handleFavorite<T>(originalState: boolean, callback: CallbackType) {
    return function (event: React.MouseEvent<T>) {
      callback(!originalState);
      const newData = {
        ...cardData,
        isFavorite: !originalState,
      };
      axios.patch('/api/feed', newData);
    };
  }

  function handleRead<T>(originalState: boolean, callback: CallbackType) {
    return function (event: React.MouseEvent<T>) {
      callback(!originalState);
      const newData = {
        ...cardData,
        isRead: !originalState,
      };
      axios.patch('/api/feed', newData);
    };
  }

  const returnReadStyle = (booleanA: boolean, booleanB: boolean) => {
    if (booleanA) {
      if (booleanB) return 'brightness-75 dark:opacity-50';
      else return 'brightness-100 dark:opacity-100';
    } else {
      if (booleanB) return 'brightness-75 dark:opacity-50';
      else return 'brightness-100 dark:opacity-100';
    }
  };

  // hydration 오류 수정용
  React.useEffect(() => {
    const dateFlag = isTodayLessThanExtraDay(pubDate);
    if (dateFlag) {
      setDateState(dateFlag);
    }
  }, [pubDate]);

  return (
    <section
      className={`flex rounded-md shadow-lg mb-8 px-6 py-4 bg-neutral-100 text-neutral-700 cursor-pointer select-none dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 ${returnReadStyle(
        isRead,
        readState
      )}`}
      onClick={handleCard}
    >
      <div className='mr-4 py-1'>
        <Checkbox
          targetState={favoriteState}
          buttonIcon={FavoriteIcon}
          handleCheckbox={handleFavorite(favoriteState, setFavoriteState)}
        />
        {dateState && (
          <span className='text-xs text-yellow-500 font-bold dark:text-yellow-300'>New</span>
        )}
      </div>
      <div className='w-full'>
        <div className='flex justify-between w-full'>
          <h2 className='text-lg'>{title}</h2>
          <Checkbox
            targetState={readState}
            buttonIcon={CheckIcon}
            handleCheckbox={handleRead(readState, setReadState)}
          />
        </div>
        <p className='my-3'>{description}</p>
        <div className='flex justify-between w-full'>
          <p>{parsedPubDate}</p>
          <p>{origin}</p>
        </div>
      </div>
      <style jsx>{`
        p {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      `}</style>
    </section>
  );
}
