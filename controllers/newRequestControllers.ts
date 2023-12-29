export default class NewRequestControllers {
    private url: string;

    constructor(url = process.env.NEXT_PUBLIC_REQUEST_URL) {
        this.url = url ?? "/";
    }

    getDataFrom = async <T>(
        endPoint: string,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, method: "GET" })
        ).json();
    };

    postDataTo = async <T>(
        endPoint: string,
        data?: BodyInit,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, body: data, method: "POST" })
        ).json();
    };

    putDataTo = async <T>(
        endPoint: string,
        data?: BodyInit,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, body: data, method: "PUT" })
        ).json();
    };

    patchDataTo = async <T>(
        endPoint: string,
        data?: BodyInit,
        option?: RequestInit
    ): Promise<T> => {
        const requestUrl = this.processEndPoint(endPoint);
        return await (
            await fetch(requestUrl, { ...option, body: data, method: "PATCH" })
        ).json();
    };

    deleteDataOf = async <T>(
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
