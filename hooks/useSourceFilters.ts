import React from 'react';
import { SourceData } from 'controllers/sources';
import { SourcesList } from 'components/feeds/CancelSubscription';

export type SourceStateType = {
    [key in string]: boolean;
};

const useSourceFilters = (sourceString: string, defaultValue = false) => {
    const [innerState, setInnerState] = React.useState<SourceStateType>({});

    const updateInnerState = (target: string, value: boolean) => {
        setInnerState((previousObject) => ({
            ...previousObject,
            [target]: value,
        }));
    };

    
    React.useEffect(() => {
        if (sourceString != null) {
            try {
                const { sources: sourcesList }: SourcesList = JSON.parse(sourceString);
                const nameList = sourcesList.map((source: SourceData) => source.name);
                nameList.forEach((name: string) => updateInnerState(name, defaultValue));
            } catch (error) {
                console.log(error);
                return;
            }
        }
    }, [sourceString]);

    return [innerState, updateInnerState] as const;
};

export default useSourceFilters;
