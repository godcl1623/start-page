import { convertToString } from "./utils";

export default class NewRequestControllers {
    private url: string;

    constructor(url = process.env.NEXT_PUBLIC_REQUEST_API) {
        this.url = url ?? "/";
    }

    getDataFrom = async <T = unknown>(
        endPoint: string,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, method: "GET" })
        ).json();
    };

    postDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, {
                ...option,
                body: convertToString(data),
                method: "POST",
            })
        ).json();
    };

    putDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, {
                ...option,
                body: convertToString(data),
                method: "PUT",
            })
        ).json();
    };

    patchDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, {
                ...option,
                body: convertToString(data),
                method: "PATCH",
            })
        ).json();
    };

    deleteDataOf = async <T = unknown>(
        endPoint: string,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, method: "DELETE" })
        ).json();
    };

    private processEndPoint = (endPoint: string) => {
        let requestUrl = this.url;
        if (endPoint.startsWith("http")) return endPoint;
        else if (endPoint.startsWith("/")) requestUrl += endPoint;
        else requestUrl += `/${endPoint}`;
        return requestUrl;
    };
}
