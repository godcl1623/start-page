import { nanoid } from "nanoid";
import { DEFAULT_CARD_DATA, ParsedFeedsDataType } from "app/main";
import Card from "components/card";
import { memo, useEffect, useMemo, useRef, useState } from "react";

interface Props {
    feedsFromServer: ParsedFeedsDataType[] | undefined;
    userId: string;
    isFilterFavorite: boolean;
    isFilterSources: boolean;
    patchCachedData: (newData: ParsedFeedsDataType) => void;
}

export default memo(function FeedsList({
    feedsFromServer,
    userId,
    isFilterFavorite,
    isFilterSources,
    patchCachedData,
}: Readonly<Props>) {
    const defaultFeedsList = useMemo(
        () => Array.from({ length: 10 }, () => DEFAULT_CARD_DATA),
        []
    );
    const [feedsToDisplay, setFeedsToDisplay] =
        useState<ParsedFeedsDataType[]>(defaultFeedsList);
    const [currentTopIndex, setCurrentTopIndex] = useState<number>(0);
    const [perItemHeight, setPerItemHeight] = useState<number>(0);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState<number>(6);
    const [initialVisibleItems, setInitialVisibleItems] = useState<number>(10);

    const listContainerRef = useRef<HTMLUListElement | null>(null);

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

    useEffect(() => {
        if (feedsFromServer == null) return;

        const listContainer = listContainerRef.current;
        if (listContainer == null) return;

        const containerTop = listContainer.offsetTop;
        const perItemHeight = listContainer.children[1].clientHeight + 32;
        setPerItemHeight(perItemHeight);
        setMaxItemsPerPage(Math.ceil(window.innerHeight / perItemHeight) + 1);
        setInitialVisibleItems(Math.ceil((window.innerHeight - containerTop) / perItemHeight));
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const revisedTop = scrollTop - containerTop;
            const currentTop = Math.floor(revisedTop / perItemHeight);
            if (currentTop < 0) {
                setCurrentTopIndex(0);
            } else {
                setCurrentTopIndex(currentTop);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [feedsFromServer]);
    console.log(initialVisibleItems);

    return (
        <ul className="w-full h-full" ref={listContainerRef}>
            <li style={{ height: `${perItemHeight * currentTopIndex}px` }} />
            {feedsToDisplay.map((feed: ParsedFeedsDataType, index) => {
                if (index < currentTopIndex || index > currentTopIndex + maxItemsPerPage) return null;
                return (
                  <li key={`${feed.id}+${nanoid()}`} className={"mb-8"}>
                      <Card
                        cardData={feed}
                        userId={userId}
                        patchCachedData={patchCachedData}
                      />
                  </li>
                );
            })}
            <li style={{ height: `${perItemHeight * (feedsToDisplay.length - (currentTopIndex + maxItemsPerPage - 1))}px` }} />
        </ul>
    );
});
