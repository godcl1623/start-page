import { useState } from "react";

const useChangeModalView = <T>(initialValue: T) => {
    const [currentView, setCurrentView] = useState<T>(initialValue);
    const changeViewTo = (value: T) => () => {
        setCurrentView(value);
    };

    return [currentView, changeViewTo] as const;
};

export default useChangeModalView;
