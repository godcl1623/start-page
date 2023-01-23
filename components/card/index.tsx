import { MouseEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    AiFillStar as FavoriteIcon,
    AiFillRead as CheckIcon,
} from "react-icons/ai";

import { ParsedFeedsDataType } from "types/global";

import { isTodayLessThanExtraDay } from "common/helpers";
import RequestControllers from "controllers";
import useDerivedStateFromProps from "./hooks/useDerivedStateFromProps";

import Checkbox from "./Checkbox";

interface CardProps {
    cardData: ParsedFeedsDataType;
    refetchFeeds: any;
}

type CallbackType = (value: any) => void;

export default function Card({ cardData, refetchFeeds }: CardProps) {
    const {
        title,
        description,
        link,
        pubDate,
        origin,
        isRead,
        isFavorite,
        id,
    } = cardData;
    const [readState, setReadState] = useDerivedStateFromProps<boolean>(
        isRead ?? false
    );
    const [favoriteState, setFavoriteState] = useDerivedStateFromProps<boolean>(
        isFavorite ?? false
    );
    const [pubDateState] = useDerivedStateFromProps<string>(pubDate ?? '');
    const [dateState, setDateState] = useState(false);
    const parsedPubDate = new Date(pubDateState).toDateString();
    const { patchDataTo } = new RequestControllers();
    const mutationFn = (newData: ParsedFeedsDataType) =>
        patchDataTo(`/feeds/${origin}/${id}`, newData);
    const { mutate, isSuccess } = useMutation({
        mutationFn,
    });

    const handleCard = (event: MouseEvent) => {
        if (!(event.target instanceof SVGElement)) {
            const newData = {
                ...cardData,
                isRead: true,
                isFavorite: favoriteState,
            };
            mutate(newData);
            if (link) window.location.assign(link);
        }
    };

    const handleFavorite =
        (originalState: boolean, callback: CallbackType) => () => {
            callback(!originalState);
            const newData = {
                ...cardData,
                isFavorite: !originalState,
                isRead: readState,
            };
            mutate(newData);
        };

    const handleRead =
        (originalState: boolean, callback: CallbackType) => () => {
            callback(!originalState);
            const newData = {
                ...cardData,
                isRead: !originalState,
                isFavorite: favoriteState,
            };
            mutate(newData);
        };

    const returnReadStyle = (flag: boolean) => {
        if (flag) return "brightness-75 dark:opacity-50";
        return "brightness-100 dark:opacity-100";
    };

    // hydration 오류 수정용
    useEffect(() => {
        const dateFlag = isTodayLessThanExtraDay(pubDate);
        if (dateFlag) {
            setDateState(dateFlag);
        }
    }, [pubDate]);

    useEffect(() => {
        if (isSuccess && favoriteState) {
            refetchFeeds();
        }
    }, [isSuccess, favoriteState]);

    return (
        <section
            className={`flex rounded-md shadow-lg mb-8 px-6 py-4 bg-neutral-100 text-neutral-700 cursor-pointer select-none dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 ${returnReadStyle(
                readState
            )}`}
            onClick={handleCard}
        >
            <div className="mr-4 py-1">
                <Checkbox
                    targetState={favoriteState}
                    buttonIcon={FavoriteIcon}
                    handleCheckbox={handleFavorite(
                        favoriteState,
                        setFavoriteState
                    )}
                />
                {dateState && (
                    <span className="text-xs text-yellow-500 font-bold dark:text-yellow-300">
                        New
                    </span>
                )}
            </div>
            <div className="w-full">
                <div className="flex justify-between w-full">
                    <h2 className="text-lg">{title}</h2>
                    <Checkbox
                        targetState={readState}
                        buttonIcon={CheckIcon}
                        handleCheckbox={handleRead(readState, setReadState)}
                    />
                </div>
                <p className="my-3">{description}</p>
                <div className="flex justify-between w-full">
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
