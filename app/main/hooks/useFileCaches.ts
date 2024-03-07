import { useEffect, useRef } from "react";
import { ParsedFeedsDataType } from "..";

export interface FeedsCache {
    name?: string;
    [key: number]: ParsedFeedsDataType[];
}

interface CachesContainer {
    [key: string]: {
        cache: FeedsCache;
        lastPage: number;
    };
}

const useFileCaches = () => {
    const caches = useRef<CachesContainer>({
        basic: {
            cache: {},
            lastPage: 1,
        },
        favorite: {
            cache: {},
            lastPage: 1,
        },
        source: {
            cache: {},
            lastPage: 1,
        },
        texts: {
            cache: {},
            lastPage: 1,
        },
        sorts: {
            cache: {},
            lastPage: 1,
        },
    });

    return caches.current;
};

export default useFileCaches;
