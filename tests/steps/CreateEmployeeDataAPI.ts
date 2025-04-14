import { Then, When } from "@cucumber/cucumber";
import RestRequest from "../../src/api/actions/RESTRequest";
import APIConstants from "../../src/api/APIConstants/APIConstants";
import RequestHeaders from "../../src/api/actions/RequestHeaders";
import { APIResponse } from "playwright";
import Assert from "../../src/asserts/Assert";
import ReportGeneration from "../../src/helper/reportGeneration";

function getRequestHeadersWithOutAuth(){
    return new RequestHeaders().setRequestHeaders("Content-Type",APIConstants.CONTENT_TYPE_JSON)
                              .get();}
  let creReqResp: any;
  When('user invokes empcreation endpoint with valid data', async function () {
     const endPoint = await this.getBaseURL;
     const creEmpBody = {
        empID: "U44515",
        empName: "DFCVG",
        empSal: "2000",
        empAddr: "UK",
        empDelFlag:"Yes"
     }   
     const request: RestRequest =  await this.rest;
     const reqBody = await request.createRequestBody("/CreateEmployee.json",creEmpBody);
     await ReportGeneration.attachReportForAPI(" The Request Body is \n " + reqBody, this);
     creReqResp = await request.postReq(endPoint,getRequestHeadersWithOutAuth(),reqBody);
     this.respObjSha = await creReqResp;
  });

  Then('user see employee data created', async function () {
      await ReportGeneration.attachReportForAPI(" The Response Body is \n " + await this.respObjSha.text(), this);
      await Assert.assertContains(await this.respObjSha.text(),"Employee Details Created Successfully");
  });
