import { Then, When } from "@cucumber/cucumber";
import RequestHeaders from "../../src/api/actions/RequestHeaders";
import APIConstants from "../../src/api/APIConstants/APIConstants";
import RestRequest from "../../src/api/actions/RESTRequest";
import Assert from "../../src/asserts/Assert";
import ReportGeneration from "../../src/helper/reportGeneration";

function getRequestHeadersWithOutAuth() {
    return new RequestHeaders().setRequestHeaders("Content-Type", APIConstants.CONTENT_TYPE_JSON)
        .get();
}
let updReqResp: any;
When('user invokes empupdate endpoint with valid data', async function () {
    const endpoint = await this.getBaseURL+"U44506";
    await ReportGeneration.attachReportForAPI(" The End Point is - " + endpoint, this)
    const updBody = {
        empID: "U44506",
        empName: "VKJDH",
        empSal: "2000",
        empAddr: "UK",
        empDelFlag:"Yes",
        }
    const request: RestRequest = await this.rest;
    const updReqBody = await request.createRequestBody("/UpdateEmployee.json",updBody);
    await ReportGeneration.attachReportForAPI(" The Request Body is - " + updReqBody, this);
    updReqResp = await request.putReq(endpoint,getRequestHeadersWithOutAuth(),updReqBody);
    this.respObjSha = await updReqResp;
});

Then('user see employee data updated successfully', async function () {
    await ReportGeneration.attachReportForAPI(" The Response Body is - " + this.respObjSha.text(), this)
    await Assert.assertContains(await this.respObjSha.text(),"VKJDH");
});