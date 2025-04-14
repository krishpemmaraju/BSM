import jp from "jsonpath";
import { APIResponse } from "@playwright/test";

export default class RestResponse {

    public async getTagContentFromJSONResponse(jsonPath:string,resp:APIResponse){
        return jp.query(JSON.stringify(resp.body),jsonPath)[0];
    }

    
}