import { useEffect, useState } from "react";

import { SourceData } from "controllers/sources";

export type FilterType<T> = {
    [key in string]: T;
};

const useFilters = <T>(sourceString: string, defaultValue: T) => {
    const [innerState, setInnerState] = useState<FilterType<T>>({});

    const updateInnerState = (target: string, value: T) => {
        setInnerState((previousObject) => ({
            ...previousObject,
            [target]: value,
        }));
    };

    useEffect(() => {
        if (sourceString != null && sourceString !== '') {
            try {
                const parseResult = JSON.parse(sourceString);
                if (
                    Array.isArray(parseResult) &&
                    typeof parseResult[0] === "string"
                ) {
                    parseResult.forEach((key: string) =>
                        updateInnerState(key, defaultValue)
                    );
                } else {
                    const nameList = parseResult.map(
                        (source: SourceData) => source.name
                    );
                    nameList.forEach((name: string) =>
                        updateInnerState(name, defaultValue)
                    );
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
    }, [sourceString, defaultValue]);

    return [innerState, updateInnerState] as const;
};

export default useFilters;
