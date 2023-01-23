import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

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
