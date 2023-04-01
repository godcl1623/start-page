import { checkIfTodayLessThan } from "common/helpers";
import { memo, MouseEvent, useEffect, useState } from "react";
import { CallbackType } from ".";
import Checkbox from "./Checkbox";
import {
    AiFillStar as FavoriteIcon,
    AiFillRead as CheckIcon,
} from "react-icons/ai";
import useDerivedStateFromProps from "./hooks/useDerivedStateFromProps";
import useClientSideDate from './hooks/useClientSideDate';
import useCheckIfDataIsNew from './hooks/useCheckIfDataIsNew';
import { ParsedFeedsDataType } from "pages";

interface Props {
    cardData: ParsedFeedsDataType;
    handleCard: (favoriteState: boolean) => (event: MouseEvent) => void;
    handleFavorite: (
        originalState: boolean,
        readState: boolean,
        callback: CallbackType
    ) => () => void;
    handleRead: (
        originalState: boolean,
        readState: boolean,
        callback: CallbackType
    ) => () => void;
}

export default memo(function CardContent({
    cardData,
    handleCard,
    handleFavorite,
    handleRead,
}: Props) {
    const { title, description, pubDate, isRead, isFavorite, origin } =
        cardData ?? {};

    const [readState, setReadState] = useDerivedStateFromProps<boolean>(
        isRead ?? false
    );
    const [favoriteState, setFavoriteState] = useDerivedStateFromProps<boolean>(
        isFavorite ?? false
    );

    const clientSideDate = useClientSideDate(pubDate);
    const isDataNew = useCheckIfDataIsNew(clientSideDate);

    const returnReadStyle = (flag: boolean) => {
        if (flag) return "brightness-75 dark:opacity-50";
        return "brightness-100 dark:opacity-100";
    };

    return (
        <section
            className={`flex rounded-md shadow-lg mb-8 px-6 py-4 bg-neutral-100 text-neutral-700 cursor-pointer select-none dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 ${returnReadStyle(
                readState
            )}`}
            onClick={handleCard(favoriteState)}
        >
            <div className="mr-4 py-1">
                <Checkbox
                    targetState={favoriteState}
                    buttonIcon={FavoriteIcon}
                    handleCheckbox={handleFavorite(
                        favoriteState,
                        readState,
                        setFavoriteState
                    )}
                />
                {isDataNew && (
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
                        handleCheckbox={handleRead(
                            readState,
                            favoriteState,
                            setReadState
                        )}
                    />
                </div>
                <p className="my-3">{description}</p>
                <div className="flex justify-between w-full">
                    <p>{clientSideDate}</p>
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
});
