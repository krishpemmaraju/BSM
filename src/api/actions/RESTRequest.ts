import fs from 'fs';
import APIConstants from '../APIConstants/APIConstants';
import StringUtils from '../../utils/StringUtils';
import { Page, APIResponse } from '@playwright/test';

export default class RestRequest {

    constructor(private page: Page){}

    /**
     *  Create a request body from JSON file by replacing with parameters
     * @param JSONFileName
     * @param data
     * @returns
     */

    public async createRequestBody(JSONFileName:string,data: any){
        let jsonData= fs.readFileSync(APIConstants.REST_JSON_PAYLOAD_PATHS+JSONFileName,'utf-8');
        jsonData = StringUtils.formatStringValue(jsonData,data);
        return jsonData;
    }

    /**
     * Make Get request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param description 
     * @returns 
     */
    public async getReq(endPoint:string,requestHeader: any){
        const headerJSON = JSON.parse(JSON.stringify(requestHeader));
        const getResponseObj:APIResponse = await this.page.request.get(endPoint, {headers: headerJSON});
        return getResponseObj;
    } 
    

     /**
     * Make Post request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonBody 
     * @returns 
     */
     public async postReq(endPoint:string,requestHeader: any,jsonBody:string):Promise<APIResponse>{
        const headerJSON = JSON.parse(JSON.stringify(requestHeader));
        const getResponseObj:APIResponse = await this.page.request.post(endPoint, {headers: headerJSON,data: JSON.parse(jsonBody)});
        return getResponseObj;
    } 

    /**
     * Make Put request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonBody 
     * @returns 
     */
    public async putReq(endPoint:string,requestHeader: any,jsonBody:string):Promise<APIResponse>{
        const headerJSON = JSON.parse(JSON.stringify(requestHeader));
        const getResponseObj:APIResponse = await this.page.request.put(endPoint, {headers: headerJSON,data: JSON.parse(jsonBody)});
        return getResponseObj;
    } 

     /**
     * Make Patch request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param jsonBody 
     * @returns 
     */
     public async patchReq(endPoint:string,requestHeader: any,jsonBody:string):Promise<APIResponse>{
        const headerJSON = JSON.parse(JSON.stringify(requestHeader));
        const getResponseObj:APIResponse = await this.page.request.patch(endPoint, {headers: headerJSON,data: JSON.parse(jsonBody)});
        return getResponseObj;
    } 

    /**
     * Make Del request and return response
     * @param endPoint 
     * @param requestHeader 
     * @param description 
     * @returns 
     */
    public async deleteReq(endPoint:string,requestHeader: any):Promise<APIResponse>{
        const headerJSON = JSON.parse(JSON.stringify(requestHeader));
        const getResponseObj:APIResponse = await this.page.request.delete(endPoint, {headers: headerJSON});
        return getResponseObj;
    } 

}