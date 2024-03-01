import { hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

const useDetectSystemTheme = () => {
    const [isDark, setIsDark] = useState(false);

    const updateClientTheme = (value: boolean) => {
        setIsDark(value);
    };

    useEffect(() => {
        const activateDarkMode = (event: MediaQueryListEvent) => {
            if (event.matches) {
                if (!hasCookie("theme")) {
                    document.documentElement.classList.add("dark");
                }
                setIsDark(true);
            } else {
                if (!hasCookie("theme")) {
                    document.documentElement.classList.remove("dark");
                }
                setIsDark(false);
            }
        };
        const darkModePreference = matchMedia("(prefers-color-scheme: dark)");
        darkModePreference.addEventListener("change", activateDarkMode);
        return () =>
            darkModePreference.removeEventListener("change", activateDarkMode);
    }, []);

    useEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
    }, [isDark]);

    return [isDark, updateClientTheme] as const;
};

export default useDetectSystemTheme;
