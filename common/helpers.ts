import { getTimes } from 'suncalc';

import { ParsedFeedsDataType } from "app/main";

import {
    areEqual,
    isSatisfyingBothAAndB,
    isFrontBiggerThanRear,
    isNull,
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

export const checkShouldSortByReverse = (sortState: number) => sortState === 1;

const returnDaysAddedDate = (dateString: string, daysToAdd: number) => {
    const dateToAddDays = new Date(Date.parse(dateString));
    dateToAddDays.setHours(0);
    dateToAddDays.setDate(dateToAddDays.getDate() + daysToAdd);
    return dateToAddDays;
};

export const checkIfTodayLessThan = (
    dateString: string | null,
    extraDay = 3
) => {
    if (dateString == null) return;
    const dateToCheck = new Date(Date.parse(dateString));
    dateToCheck.setHours(0);
    const dateToCheckWithExtraDay = returnDaysAddedDate(dateString, extraDay);
    dateToCheckWithExtraDay.setHours(0);
    const now = new Date();
    const isTodayMoreThanDateToCheck = dateToCheck <= now;
    const isTodayLessThanExtraDay = now <= dateToCheckWithExtraDay;
    return isTodayLessThanExtraDay && isTodayMoreThanDateToCheck;
};

export const calculateSunsetSunrise = async () => {
    try {
        const { latitude, longitude } = (await (
            await fetch("https://geolocation-db.com/json")
        ).json()) ?? { latitude: 37.6564, longitude: 126.835 };
        const current = new Date();
        const { sunrise, sunset } = getTimes(current, latitude, longitude);
        const currentTime = current.getTime();
        const sunriseTime = sunrise.getTime();
        const sunsetTime = sunset.getTime();
        return {
            isSunset: (currentTime - sunsetTime) >= 0,
            isSunrise: (currentTime - sunsetTime) < 0 && (currentTime - sunriseTime) >= 0
        };
    } catch (error) {
        console.error(error);
        return {
            isSunset: undefined,
            isSunrise: undefined
        }
    }
};
