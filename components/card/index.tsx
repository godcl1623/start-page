import { memo, MouseEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { ParsedFeedsDataType } from "pages";

import RequestControllers from "controllers";

import useGetRawCookie from "hooks/useGetRawCookie";
import CardView from './CardView';

interface CardProps {
    cardData: ParsedFeedsDataType;
    refetchFeeds: any;
}

export type CallbackType = (value: any) => void;

export default memo(function Card({ cardData, refetchFeeds }: CardProps) {
    const {
        link,
        origin,
        isFavorite,
        id,
    } = cardData ?? {};
    const { patchDataTo } = new RequestControllers();
    const rawCookie = useGetRawCookie();
    const mutationFn = (newData: ParsedFeedsDataType) =>
        patchDataTo(`/feeds/${origin}/${id}?mw=${rawCookie}`, newData);
    const { mutate, isSuccess } = useMutation({
        mutationFn,
    });

    const handleCard = (favoriteState: boolean) => (event: MouseEvent) => {
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
        (originalState: boolean, readState: boolean, callback: CallbackType) => () => {
            callback(!originalState);
            const newData = {
                ...cardData,
                isFavorite: !originalState,
                isRead: readState,
            };
            mutate(newData);
        };

    const handleRead =
        (originalState: boolean, favoriteState: boolean, callback: CallbackType) => () => {
            callback(!originalState);
            const newData = {
                ...cardData,
                isRead: !originalState,
                isFavorite: favoriteState,
            };
            mutate(newData);
        };

    useEffect(() => {
        if (isSuccess && isFavorite) {
            refetchFeeds();
        }
    }, [isSuccess, isFavorite]);

    return (
        <CardView
            cardData={cardData}
            handleCard={handleCard}
            handleFavorite={handleFavorite}
            handleRead={handleRead}
        />
    );
});
