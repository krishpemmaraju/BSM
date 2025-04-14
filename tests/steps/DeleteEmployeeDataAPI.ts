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
let delReqResp: any;
When('user invokes empdelete endpoint with valid data', async function () {
  const endPoint = await this.getBaseURL + "U44514";
  const request: RestRequest = await this.rest;
  await ReportGeneration.attachReportForAPI(" The End Point is - " + endPoint, this)
  delReqResp = await request.deleteReq(endPoint, getRequestHeadersWithOutAuth());
  this.respObjSha = await delReqResp;
  console.log(await this.respObjSha.text());
});

Then('user see employee data deleted successfully', async function () {
  await ReportGeneration.attachReportForAPI(" The Response is - " + await this.respObjSha.text(), this)
  await Assert.assertEquals("Employee Details deleted successfully", await this.respObjSha.text(),true);
});