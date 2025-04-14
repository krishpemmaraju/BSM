import { Given, Then, When } from "@cucumber/cucumber";
import RequestHeaders from "../../src/api/actions/RequestHeaders";
import APIConstants from "../../src/api/APIConstants/APIConstants";
import * as data from "../../src/config/env/envDetails.json"
import RestRequest from "../../src/api/actions/RESTRequest";
import { APIResponse } from "@playwright/test";
import Assert from "../../src/asserts/Assert";
import RestResponse from "../../src/api/actions/RESTResponse";
import ReportGeneration from "../../src/helper/reportGeneration";
import { isTruthyString } from "@cucumber/cucumber/lib/configuration";


function getRequestHeadersWithOutAuth() {
  return new RequestHeaders().setRequestHeaders("Content-Type", APIConstants.CONTENT_TYPE_JSON)
    .get();
}
let getResponseObj: any;
let reportGeneration: ReportGeneration;
let getRESTAPIBaseURL: string;
Given('user has access to the Employee Retrival System', async function () {
  getRESTAPIBaseURL = data.APISTG[0].REST_API_BASE_URL;
  this.getBaseURL = getRESTAPIBaseURL;
});

When('user query the employee information with id as {string}', async function (empID) {
  await ReportGeneration.attachReportForAPI("The End Point is - " + getRESTAPIBaseURL + empID, this);
  getResponseObj = await this.rest.getReq(getRESTAPIBaseURL + empID, getRequestHeadersWithOutAuth());
  this.respObjSha = await getResponseObj;
  //     console.log("The employee name is " + await new RestResponse().getTagContentFromJSONResponse("employeeName",getResponseObj));

});

Then('user should see the employee list', async function () {
  await ReportGeneration.attachReportForAPI("The response is  \n" + await this.respObjSha.text(), this);
  await Assert.assertContains(await this.respObjSha.text(), "U44506");
});

Then('user should get a status code as {int}', async function (int) {
  if (await this.respObjSha.status() === 200)
    await ReportGeneration.attachReportForAPI("The Request is Success and response code is " + await this.respObjSha.status(), this);
  else await ReportGeneration.attachReportForAPI("The Request is Failed and response code is " + await this.respObjSha.status(), this);
  console.log("The response code is " + await this.respObjSha.status());
  await Assert.assertEqualsInt(200, await this.respObjSha.status(),false);
});
