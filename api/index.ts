import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from 'components/search/utils/constants';

export class HttpRequest {
  baseURL: string;
  axios: AxiosInstance;

  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL
    });
  }

  async get(endpointString?: string) {
    const endpoint = endpointString ? `${endpointString}` : '';
    const response = await this.axios.get(endpoint);

    return response;
  }

  async post(data: unknown, url = this.baseURL) {
    const requestUrl = url !== this.baseURL ? url : this.baseURL;
    const response = await this.axios.post(requestUrl, data);

    return response;
  }

  async put(data: unknown, url = this.baseURL) {
    const requestUrl = url !== this.baseURL ? url : this.baseURL;
    const response = await this.axios.put(requestUrl, data);

    return response;
  }

  async patch(data: unknown, url = this.baseURL) {
    const requestUrl = url !== this.baseURL ? url : this.baseURL;
    const response = await this.axios.patch(requestUrl, data);

    return response;
  }

  async delete(url: string) {
    const response = await this.axios.delete(url);

    return response;
  }
}