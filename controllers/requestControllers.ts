import { convertToString } from "./utils";

export default class RequestControllers {
    private url: string;

    constructor(url = process.env.NEXT_PUBLIC_REQUEST_API) {
        this.url = url ?? "/";
    }

    getDataFrom = async <T = unknown>(
        endPoint: string,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        const fetchResponse = await fetch(requestUrl, {
            ...option,
            method: "GET",
        });
        return this.processFetchResponse(fetchResponse);
    };

    postDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        const fetchResponse = await fetch(requestUrl, {
            ...option,
            body: convertToString(data),
            method: "POST",
        });
        return this.processFetchResponse(fetchResponse);
    };

    putDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        const fetchResponse = await fetch(requestUrl, {
            ...option,
            body: convertToString(data),
            method: "PUT",
        });
        return this.processFetchResponse(fetchResponse);
    };

    patchDataTo = async <T = unknown>(
        endPoint: string,
        data?: unknown,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        const fetchResponse = await fetch(requestUrl, {
            ...option,
            body: convertToString(data),
            method: "PATCH",
        });
        return this.processFetchResponse(fetchResponse);
    };

    deleteDataOf = async <T = unknown>(
        endPoint: string,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        const fetchResponse = await fetch(requestUrl, {
            ...option,
            method: "DELETE",
        });
        return this.processFetchResponse(fetchResponse);
    };

    private processEndPoint = (endPoint: string) => {
        let requestUrl = this.url;
        if (endPoint.startsWith("http")) return endPoint;
        else if (endPoint.startsWith("/")) requestUrl += endPoint;
        else requestUrl += `/${endPoint}`;
        return requestUrl;
    };

    private processFetchResponse = (response: Response) => {
        if (response.headers.get("content-type") === "application/json")
            return response.json();
        else return response.text();
    };
}
