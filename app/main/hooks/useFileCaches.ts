import { useRef } from "react";
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

const CACHE_KEYS = ["basic", "favorite", "source", "texts", "sorts"];

const useFileCaches = () => {
    const caches = useRef<CachesContainer>({
        ...CACHE_KEYS.reduce(
            (resultObject, cacheKey) => ({
                ...resultObject,
                [cacheKey]: {
                    cache: {},
                    lastPage: 1,
                },
            }),
            {}
        ),
    });

    return caches.current;
};

export default useFileCaches;
