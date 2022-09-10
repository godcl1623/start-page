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
    const endpoint = endpointString ? endpointString : '';
    const response = await this.axios.get(endpoint);

    return response;
  }

  async post(endpoint: string, data: unknown) {
    const response = await this.axios.post(endpoint, data);

    return response;
  }

  async put(data: unknown, endpointString?: string) {
    const endpoint = endpointString ? endpointString : '';
    const response = await this.axios.put(endpoint, data);

    return response;
  }

  async patch(data: unknown, endpointString?: string) {
    const endpoint = endpointString ? endpointString : '';
    const response = await this.axios.patch(endpoint, data);

    return response;
  }

  async delete(endpoint: string) {
    const response = await this.axios.delete(endpoint);

    return response;
  }
}