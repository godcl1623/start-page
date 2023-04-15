import { useEffect, useState } from "react";

import { areEqual } from "common/capsuledConditions";

const useDerivedStateFromProps = <T>(
    propsToMakeState: T
): [T, (value: T) => void] => {
    const [stateToDifferentiate, setStateToDifferentiate] = useState<T | null>(null);

    const updateState = (value: T) => {
        setStateToDifferentiate(value);
    };

    useEffect(() => {
        if (!areEqual(propsToMakeState, stateToDifferentiate))
            setStateToDifferentiate(propsToMakeState);
    }, []);

    return [stateToDifferentiate as T, updateState];
};

export default useDerivedStateFromProps;
