import { FeedsObjectType } from 'types/global';

export const sortByPubDate = (prev: FeedsObjectType, next: FeedsObjectType) => {
  if (prev.pubDate && next.pubDate) {
    const prevPubDate = new Date(prev.pubDate);
    const nextPubDate = new Date(next.pubDate);
    if (prevPubDate > nextPubDate) return -1;
    else return 1;
  } else {
    return -1;
  }
};

const returnDaysAddedDate = (dateString: string, daysToAdd: number) => {
  const dateToAddDays = new Date(Date.parse(dateString));
  dateToAddDays.setHours(0);
  dateToAddDays.setDate(dateToAddDays.getDate() + daysToAdd);
  return dateToAddDays;
};

export const isTodayLessThanExtraDay = (pubDateString: string | null, extraDay = 3) => {
  if (pubDateString) {
    const pubDate = new Date(Date.parse(pubDateString));
    pubDate.setHours(0);
    const pubDateWithExtraDay = returnDaysAddedDate(pubDateString, extraDay);
    pubDateWithExtraDay.setHours(0);
    const today = new Date();
    const isTodayMoreThanPubDate = pubDate <= today;
    const isTodayLessThanExtraDay = today <= pubDateWithExtraDay;
    return isTodayLessThanExtraDay && isTodayMoreThanPubDate;
  }
};
