import { memo, MouseEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { ParsedFeedsDataType } from "app/main";
import RequestControllers from "controllers/requestControllers";

import CardView from "./CardView";

interface CardProps {
    cardData: ParsedFeedsDataType;
    userId: string;
    patchCachedData: (newData: ParsedFeedsDataType) => void;
}

export type CallbackType = (value: any) => void;

export default memo(function Card({
    cardData,
    userId,
    patchCachedData
}: CardProps) {
    const { link, origin, isFavorite, id } = cardData ?? {};
    const { patchDataTo } = new RequestControllers();
    const mutationFn = (newData: ParsedFeedsDataType) =>
        patchDataTo(`/feeds/${origin}/${id}?userId=${userId}`, newData);
    const { mutateAsync, isSuccess } = useMutation({
        mutationFn,
    });

    const handleCard =
        (favoriteState: boolean) => async (event: MouseEvent) => {
            try {
                event.preventDefault();
                if (!(event.target instanceof SVGElement)) {
                    const newData = {
                        ...cardData,
                        isRead: true,
                        isFavorite: favoriteState,
                    };
                    patchCachedData(newData);
                    await mutateAsync(newData);
                    if (link) window.location.assign(link);
                }
            } catch (error) {
                console.error(error);
            }
        };

    const handleFavorite =
        (originalState: boolean, readState: boolean, callback: CallbackType) =>
        async (event: MouseEvent) => {
            try {
                event.preventDefault();
                callback(!originalState);
                const newData = {
                    ...cardData,
                    isFavorite: !originalState,
                    isRead: readState,
                };
                patchCachedData(newData);
                await mutateAsync(newData);
            } catch (error) {
                console.error(error);
            }
        };

    const handleRead =
        (
            originalState: boolean,
            favoriteState: boolean,
            callback: CallbackType
        ) =>
        async (event: MouseEvent) => {
            try {
                event.preventDefault();
                callback(!originalState);
                const newData = {
                    ...cardData,
                    isRead: !originalState,
                    isFavorite: favoriteState,
                };
                patchCachedData(newData);
                await mutateAsync(newData);
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <CardView
            cardData={cardData}
            handleCard={handleCard}
            handleFavorite={handleFavorite}
            handleRead={handleRead}
        />
    );
});
