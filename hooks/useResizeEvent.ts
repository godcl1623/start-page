import { useEffect } from "react";

const useResizeEvent = (
    callback: () => void,
    shouldRunCallbackOnStartUp = false,
    dependencies: any[] = []
) => {
    useEffect(() => {
        window.addEventListener("resize", callback);
        if (shouldRunCallbackOnStartUp) {
            callback();
        }
        return () => window.removeEventListener("resize", callback);
    }, [...dependencies]);
};

export default useResizeEvent;
