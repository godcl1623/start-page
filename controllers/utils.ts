import { randomUUID } from "crypto";
import { GetServerSidePropsContext } from "next";
import CryptoJS from "crypto-js";
import { FilterType } from "hooks/useFilters";

export const getUserId = (context: GetServerSidePropsContext) => {
    let userId = "";
    if (
        context.req.cookies.mw != null &&
        typeof context.req.cookies.mw === "string"
    ) {
        userId = JSON.parse(decryptCookie(context.req.cookies.mw)).userId;
    } else {
        userId = randomUUID();
    }
    return userId;
};

export const getNewUserId = () => randomUUID();

export const checkIfCookieExists = (context: GetServerSidePropsContext) => {
    if (
        context.req.cookies.mw != null &&
        typeof context.req.cookies.mw === "string"
    ) {
        return true;
    } else {
        return false;
    }
};

export const encryptCookie = (target: { userId: string }) => {
    const magicWord =
        typeof window === "undefined"
            ? process.env.MAGIC_WORD
            : process.env.NEXT_PUBLIC_MAGIC_WORD;
    return CryptoJS.AES.encrypt(
        JSON.stringify(target),
        magicWord as string
    ).toString();
};

export const decryptCookie = (target: string) => {
    const magicWord =
        typeof window === "undefined"
            ? process.env.MAGIC_WORD
            : process.env.NEXT_PUBLIC_MAGIC_WORD;
    const decryptedTarget = CryptoJS.AES.decrypt(target, magicWord as string);
    return decryptedTarget.toString(CryptoJS.enc.Utf8);
};

export const parseCookie = (rawCookie: string | string[] | undefined) => {
    if (typeof rawCookie === "string" && rawCookie.length > 0) {
        const { userId } = JSON.parse(
            decryptCookie(rawCookie.replaceAll(" ", "+"))
        );
        return userId;
    }
    return;
};

interface ParameterOptions {
    favorites?: boolean;
    displayOption?: string;
    searchText?: string;
    textOption?: string;
    sortOption?: number;
    page?: number;
}

export const generateSearchParameters = (options: ParameterOptions) => {
    return Object.entries(options).reduce(
        (resultParameter: string, currentValue: [string, unknown]) => {
            const [key, value] = currentValue;
            return resultParameter + `&${key}=${value}`;
        },
        ""
    );
};

export const convertToString = (data: unknown): string =>
    typeof data === "string" ? data : JSON.stringify(data);
