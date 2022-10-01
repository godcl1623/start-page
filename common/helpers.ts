import { FeedsObjectType } from 'types/global';

const extractObjectData = <T extends FeedsObjectType>(
  targetObject: T,
  targetProperty: string
) => {
  if (targetProperty === 'pubDate' && targetObject['pubDate']) return new Date(targetObject['pubDate']);
  else return targetObject[targetProperty];
};

export const handleSort = <T extends FeedsObjectType>(targetProperty: string, reverse = false) => {
  return (prev: T, next: T) => {
    if (Object.keys(prev).length > 0 && Object.keys(next).length > 0) {
      const prevData = extractObjectData(prev, targetProperty);
      const nextData = extractObjectData(next, targetProperty);
      if ((prevData && nextData) && prevData > nextData) return reverse ? 1 : -1;
      else return reverse ? -1 : 1;
    } else {
      return reverse ? -1 : 1;
    }
  };
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
