import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

const useGetRawCookie = () => {
    const [rawCookie, setRawCookie] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userCookie = getCookie("mw");
            if (userCookie && typeof userCookie === "string") {
                setRawCookie(userCookie);
            }
        }
    }, []);

    return rawCookie;
};

export default useGetRawCookie;