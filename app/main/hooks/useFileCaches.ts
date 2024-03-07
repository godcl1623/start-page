import { useEffect, useRef } from "react";
import { ParsedFeedsDataType } from "..";

export interface FeedsCache {
    [key: number]: ParsedFeedsDataType[];
}

interface CachesContainer {
    [key: string]: {
        cache: FeedsCache;
        lastPage: number;
    };
}

const DEFAULT_CACHE = {
    cache: {},
    lastPage: 1,
};

const CACHE_LISTS = ["basic", "favorite", "source", "texts", "sorts"];

const useFileCaches = () => {
    const caches = useRef<CachesContainer>({
        ...CACHE_LISTS.reduce(
            (resultObject, cacheKey) => ({
                ...resultObject,
                [cacheKey]: DEFAULT_CACHE,
            }),
            {}
        ),
    });

    return caches.current;
};

export default useFileCaches;
