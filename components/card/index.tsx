import React from 'react';
import { AiFillStar as FavoriteIcon, AiFillRead as CheckIcon } from 'react-icons/ai';
import { FeedsObjectType } from 'types/global';
import useDerivedStateFromProps from './hooks/useDerivedStateFromProps';
import Checkbox from './Checkbox';

type CardProps = {
  cardData: FeedsObjectType;
};

type CallbackType = (value: any) => void;

export default function Card({ cardData }: CardProps) {
  const { id, title, description, link, pubDate, origin, isRead, isFavorite } = cardData;
  const parsedPubDate = new Date(pubDate as string).toDateString();
  const [readState, setReadState] = useDerivedStateFromProps<boolean>(isRead);
  const [favoriteState, setFavoriteState] = useDerivedStateFromProps<boolean>(isFavorite);

  function handleCard(event: React.MouseEvent) {
    if (!(event.target instanceof SVGElement)) {
      if (link) window.location.assign(link);
      setReadState(true);
    }
  }

  function handleCheckbox<T>(originalState: boolean, callback: CallbackType) {
    return function (event: React.MouseEvent<T>) {
      callback(!originalState);
    };
  }

  return (
    <section
      className={`flex rounded-md shadow-lg px-6 py-4 bg-neutral-100 text-black cursor-pointer select-none dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 ${(isRead || readState) ? 'brightness-75 dark:opacity-50' : 'brightness-100 dark:opacity-100'}`}
      onClick={handleCard}
    >
      <div className='mr-4 py-1'>
        <Checkbox
          targetState={favoriteState}
          buttonIcon={FavoriteIcon}
          handleCheckbox={handleCheckbox(favoriteState, setFavoriteState)}
        />
      </div>
      <div>
        <div className='flex justify-between w-full'>
          <h2 className='text-lg'>{title}</h2>
          <Checkbox
            targetState={readState}
            buttonIcon={CheckIcon}
            handleCheckbox={handleCheckbox(readState, setReadState)}
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
