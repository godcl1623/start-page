import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { randomUUID } from 'crypto';
import CryptoJS from "crypto-js";
import { GetServerSidePropsContext } from 'next';

export default class RequestControllers {
    private instance: AxiosInstance;

    constructor(baseURL = process.env.NEXT_PUBLIC_REQUEST_URL) {
        this.instance = axios.create({
            baseURL,
        });
    }

    getDataFrom = (endpoint: string, option?: AxiosRequestConfig) =>
        this.instance.get(endpoint, option);

    postDataTo = (
        endpoint: string,
        data: unknown,
        option?: AxiosRequestConfig
    ) => this.instance.post(endpoint, data, option);

    putDataTo = (
        endpoint: string,
        data: unknown,
        option?: AxiosRequestConfig
    ) => this.instance.put(endpoint, data, option);

    patchDataTo = (
        endpoint: string,
        data: unknown,
        option?: AxiosRequestConfig
    ) => this.instance.patch(endpoint, data, option);

    deleteDataOf = (endpoint: string, option?: AxiosRequestConfig) =>
        this.instance.delete(endpoint, option);
}

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
    const magicWord = typeof window === 'undefined' ? process.env.MAGIC_WORD : process.env.NEXT_PUBLIC_MAGIC_WORD;
    return CryptoJS.AES.encrypt(
        JSON.stringify(target),
        magicWord as string
    ).toString();
};

export const decryptCookie = (target: string) => {
    const magicWord = typeof window === 'undefined' ? process.env.MAGIC_WORD : process.env.NEXT_PUBLIC_MAGIC_WORD;
    const decryptedTarget = CryptoJS.AES.decrypt(
        target,
        magicWord as string
    );
    return decryptedTarget.toString(CryptoJS.enc.Utf8);
};
