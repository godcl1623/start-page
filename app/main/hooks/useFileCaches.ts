import { useRef } from "react";
import { ParsedFeedsDataType } from "..";

export interface FeedsCache {
    [key: number]: ParsedFeedsDataType[];
}

interface CachesContainerValue {
    cache: FeedsCache;
    lastPage: number;
}

const CACHE_KEYS = ["default", "filtered"] as const;

type CacheKeys = (typeof CACHE_KEYS)[number];

type CachesContainer = Record<CacheKeys, CachesContainerValue>;

const DEFAULT_CACHE_DATA: CachesContainerValue = {
    cache: {},
    lastPage: 1,
};

const useFileCaches = () => {
    const caches = useRef<CachesContainer>({
        ...CACHE_KEYS.reduce<CachesContainer>(
            (resultObject: CachesContainer, cacheKey: CacheKeys) => ({
                ...resultObject,
                [cacheKey]: {
                    cache: {},
                    lastPage: 1,
                },
            }),
            {
                default: DEFAULT_CACHE_DATA,
                filtered: DEFAULT_CACHE_DATA,
            }
        ),
    });

    return caches.current;
};

export default useFileCaches;
