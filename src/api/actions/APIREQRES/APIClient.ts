
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
export default class APIClient {

        static async request(method: string, baseUrl: string, endpoint: string, data?: any, headers?: Record<string, string>, params?: Record<string, string | number | boolean>): Promise<AxiosResponse> {
                const reqOptions: AxiosRequestConfig = {
                        method,
                        url: `${baseUrl}${endpoint}`,
                        data,
                        headers: { ...headers },
                        params
                };

                return axios(reqOptions);
        }

        /**
         * Make Get request and return response
         * @param endPoint 
         * @param requestHeader 
         * @param description 
         * @returns 
         */

        static async get(baseUrl: string, endPoint: string, headers?: Record<string, string>) {
                return this.request('GET', baseUrl, endPoint, null, headers);
        }

        /**
      * Make Post request and return response
      * @param baseUrl
      * @param endPoint
      * @param data
      * @param requestHeader 
      * @returns 
      */

        static async post(baseUrl: string, endPoint: string, data?: any, headers?: Record<string, string>) {
                return this.request('POST', baseUrl, endPoint, data, headers);
        }

        /**
         * Make Put request and return response
         * @param baseUrl
         * @param endPoint
         * @param data
         * @param requestHeader 
         * @returns 
         */

        static async put(baseUrl: string, endPoint: string, data?: any, headers?: Record<string, string>) {
                return this.request('PUT', baseUrl, endPoint, data, headers);
        }

        /**
        * Make Delete request and return response
        * @param baseUrl
        * @param endPoint
        * @param data
        * @param requestHeader 
        * @returns 
        */

        static async delete(baseUrl: string, endPoint: string, data?: any, headers?: Record<string, string>) {
                return this.request('DELETE', baseUrl, endPoint, null, headers);
        }

        /**
         * Make Get request with Params and return response
         * @param baseUrl
         * @param endPoint
         * @param data
         * @param requestHeader 
         * @returns 
         */

        static async getWithQueryParams(baseUrl: string, endPoint: string, data?: any, headers?: Record<string, string>, params?: Record<string, string>) {
                return this.request('GET', baseUrl, endPoint, null, headers, params);
        }

}