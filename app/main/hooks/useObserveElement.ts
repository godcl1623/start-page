import { useEffect, useState } from "react";

interface Options {
    callbackCondition?: boolean;
    callback?: (parameter?: any) => any;
}

const useObserveElement = ({ callbackCondition = true, callback }: Options) => {
    const [observerElement, setObserverElement] =
        useState<HTMLDivElement | null>(null);

    const updateObserverElement = (element: HTMLDivElement) => {
        setObserverElement(element);
    };

    useEffect(() => {
        if (observerElement != null) {
            const observerOption: IntersectionObserverInit = {
                threshold: 0.5,
            };
            const observerCallback: IntersectionObserverCallback = (
                entries: IntersectionObserverEntry[]
            ) => {
                entries.forEach((entry: IntersectionObserverEntry) => {
                    if (entry.isIntersecting && callbackCondition) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            };
            const observer = new IntersectionObserver(
                observerCallback,
                observerOption
            );
            observer.observe(observerElement);
            return () => observer.unobserve(observerElement);
        }
    }, [observerElement, callbackCondition, callback]);

    return { updateObserverElement };
};

export default useObserveElement;
