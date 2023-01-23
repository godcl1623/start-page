import { ParsedFeedsDataType } from "types/global";

import {
    areEqual,
    isSatisfyingBothAAndB,
    isFrontBiggerThanRear,
} from "./capsuledConditions";

const extractObjectData = <T extends ParsedFeedsDataType>(
    targetObject: T,
    targetProperty: string
) => {
    if (areEqual(targetProperty, "pubDate") && targetObject["pubDate"])
        return new Date(targetObject["pubDate"]);
    else return targetObject[targetProperty];
};

export const handleSort = <T extends ParsedFeedsDataType>(
    targetProperty: string,
    reverse = false
) => {
    return (prev: T, next: T) => {
        if (
            !isSatisfyingBothAAndB(
                isFrontBiggerThanRear(Object.keys(prev).length, 0),
                isFrontBiggerThanRear(Object.keys(next).length, 0)
            )
        ) {
            return reverse ? -1 : 1;
        }
        const prevData = extractObjectData(prev, targetProperty);
        const nextData = extractObjectData(next, targetProperty);
        if (
            !isSatisfyingBothAAndB(
                isSatisfyingBothAAndB(prevData, nextData),
                isFrontBiggerThanRear(prevData, nextData)
            )
        ) {
            return reverse ? -1 : 1;
        }
        return reverse ? 1 : -1;
    };
};

const returnDaysAddedDate = (dateString: string, daysToAdd: number) => {
    const dateToAddDays = new Date(Date.parse(dateString));
    dateToAddDays.setHours(0);
    dateToAddDays.setDate(dateToAddDays.getDate() + daysToAdd);
    return dateToAddDays;
};

export const isTodayLessThanExtraDay = (
    pubDateString: string | null,
    extraDay = 3
) => {
    if (pubDateString == null) return; 
    const pubDate = new Date(Date.parse(pubDateString));
    pubDate.setHours(0);
    const pubDateWithExtraDay = returnDaysAddedDate(
        pubDateString,
        extraDay
    );
    pubDateWithExtraDay.setHours(0);
    const today = new Date();
    const isTodayMoreThanPubDate = pubDate <= today;
    const isTodayLessThanExtraDay = today <= pubDateWithExtraDay;
    return isTodayLessThanExtraDay && isTodayMoreThanPubDate;
};
