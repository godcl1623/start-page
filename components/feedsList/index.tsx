import { nanoid } from "nanoid";
import { DEFAULT_CARD_DATA, ParsedFeedsDataType } from "app/main";
import Card from "components/card";
import { useEffect, useState } from "react";

interface Props {
    feedsFromServer: ParsedFeedsDataType[] | undefined;
    userId: string;
    isFilterFavorite: boolean;
    isFilterSources: boolean;
    refetchFeeds: () => void;
}

export default function FeedsList({
    feedsFromServer,
    userId,
    refetchFeeds,
    isFilterFavorite,
    isFilterSources,
}: Readonly<Props>) {
    const defaultFeedsList = Array.from(
        { length: 10 },
        () => DEFAULT_CARD_DATA
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
    }, [feedsFromServer, isFilterFavorite, isFilterSources]);

    return (
        <menu className="w-full h-full">
            {feedsToDisplay.map((feed: ParsedFeedsDataType) => (
                <li key={`${feed.id}+${nanoid()}`}>
                    <Card
                        cardData={feed}
                        refetchFeeds={refetchFeeds}
                        userId={userId}
                    />
                </li>
            ))}
        </menu>
    );
}
