import { memo, MouseEvent, useCallback, useEffect, useState } from "react";
import { CallbackType } from ".";
import Checkbox from "./Checkbox";
import {
    AiFillStar as FavoriteIcon,
    AiFillRead as CheckIcon,
} from "react-icons/ai";
import useDerivedStateFromProps from "./hooks/useDerivedStateFromProps";
import useClientSideDate from "./hooks/useClientSideDate";
import useCheckIfDataIsNew from "./hooks/useCheckIfDataIsNew";
import { ParsedFeedsDataType } from "app/main";
import { SvgSpinners90RingWithBg } from "components/common/Spinner";
import useResizeEvent from 'hooks/useResizeEvent';

interface Props {
    cardData: ParsedFeedsDataType;
    handleCard: (favoriteState: boolean) => (event: MouseEvent) => void;
    handleFavorite: (
        originalState: boolean,
        readState: boolean,
        callback: CallbackType
    ) => (event: MouseEvent) => void;
    handleRead: (
        originalState: boolean,
        readState: boolean,
        callback: CallbackType
    ) => (event: MouseEvent) => void;
}

export default memo(function CardView({
    cardData,
    handleCard,
    handleFavorite,
    handleRead,
}: Props) {
    const { title, description, pubDate, isRead, isFavorite, origin } =
        cardData ?? {};

    const [feedDescription, setFeedDescription] = useState(description);
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

    const adjustFeedLengthOnResize = useCallback(() => {
        if (description != null) {
            if (document.documentElement.offsetWidth < 360) {
                setFeedDescription(description.slice(0, 48) + "...");
            } else if (
                document.documentElement.offsetWidth >= 360 &&
                document.documentElement.offsetWidth < 768
            ) {
                setFeedDescription(description.slice(0, 98) + "...");
            } else {
                setFeedDescription(description);
            }
        }
    }, [description]);

    useResizeEvent(adjustFeedLengthOnResize, true, [adjustFeedLengthOnResize]);

    return (
        <button
            className={`relative flex min-w-full min-h-[10rem] rounded-md shadow-lg px-6 py-4 bg-neutral-100 text-justify text-neutral-700 cursor-pointer select-none dark:shadow-zinc-600 dark:bg-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 ${returnReadStyle(
                readState
            )}`}
            onClick={handleCard(favoriteState)}
        >
            {cardData == null || cardData.id === "" ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <SvgSpinners90RingWithBg className="w-6 h-6 fill-neutral-700 dark:fill-neutral-100" />
                </div>
            ) : (
                <>
                    <div className="mr-4 py-1">
                        <Checkbox
                            targetState={favoriteState}
                            feedId={cardData.id}
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
                            <h2 className="mr-4 text-sm whitespace-pre-normal line-clamp-1 xs:text-base sm:text-lg">
                                <b>{title}</b>
                            </h2>
                            <Checkbox
                                targetState={readState}
                                feedId={cardData.id}
                                buttonIcon={CheckIcon}
                                handleCheckbox={handleRead(
                                    readState,
                                    favoriteState,
                                    setReadState
                                )}
                            />
                        </div>
                        <p className="h-[40px] my-3 text-xs line-clamp-2 xs:text-sm">
                            {feedDescription}
                        </p>
                        <div className="flex flex-col justify-between w-full text-xs xs:text-sm sm:flex-row">
                            <p>{clientSideDate}</p>
                            <p className="whitespace-pre-wrap break-keep">
                                {origin}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </button>
    );
});
