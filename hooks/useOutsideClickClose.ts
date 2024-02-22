import { useEffect } from "react";

interface HookOptions {
    target: HTMLElement | null;
    toggleButton: HTMLElement | null;
    closeFunction: () => void;
}

const useOutsideClickClose = (
    { target, closeFunction, toggleButton }: HookOptions,
    dependencies?: unknown[]
) => {
    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            if (
                event.target instanceof HTMLElement &&
                !target?.contains(event.target) &&
                !toggleButton?.contains(event.target)
            ) {
                closeFunction();
            }
        };
        window.addEventListener("click", clickHandler);
        return () => window.removeEventListener("click", clickHandler);
    }, [target, toggleButton, ...(dependencies ?? [])]);
};

export default useOutsideClickClose;
