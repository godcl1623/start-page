import { nanoid } from "nanoid";
import { DEFAULT_CARD_DATA, ParsedFeedsDataType } from "app/main";
import Card from "components/card";
import { memo, useEffect, useMemo, useState } from "react";

interface Props {
    feedsFromServer: ParsedFeedsDataType[] | undefined;
    userId: string;
    isFilterFavorite: boolean;
    isFilterSources: boolean;
}

export default memo(function FeedsList({
    feedsFromServer,
    userId,
    isFilterFavorite,
    isFilterSources,
}: Readonly<Props>) {
    const defaultFeedsList = useMemo(
        () => Array.from({ length: 10 }, () => DEFAULT_CARD_DATA),
        []
    );
    const [feedsToDisplay, setFeedsToDisplay] =
        useState<ParsedFeedsDataType[]>(defaultFeedsList);

    const updateFeedsToDisplay = (dataList: ParsedFeedsDataType[]) => {
        setFeedsToDisplay((oldState) =>
            oldState.slice(oldState.length).concat(dataList)
        );
    };

    useEffect(() => {
        if (feedsFromServer != null && feedsFromServer.length > 0) {
            updateFeedsToDisplay(feedsFromServer);
        } else if (!isFilterFavorite && !isFilterSources) {
            updateFeedsToDisplay(defaultFeedsList);
        } else {
            updateFeedsToDisplay([]);
        }
    }, [feedsFromServer, isFilterFavorite, isFilterSources, defaultFeedsList]);

    return (
        <menu className="w-full h-full">
            {feedsToDisplay.map((feed: ParsedFeedsDataType) => (
                <li key={`${feed.id}+${nanoid()}`}>
                    <Card cardData={feed} userId={userId} />
                </li>
            ))}
        </menu>
    );
});
