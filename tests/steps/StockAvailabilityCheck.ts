import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import QuickOrderEntryPage from "../../src/webui/pages/scm/OuickOrderEntryPage";
import Assert from "../../src/asserts/Assert";
import FileUtils from "../../src/utils/FileUtils";
import StockAvailabilityCheckPage from "../../src/webui/pages/scm/StockAvailabilityCheckPage";
import RequestHeaders from "../../src/api/actions/RequestHeaders";
import APIConstants from "../../src/api/APIConstants/APIConstants";
import * as data from "../../src/config/env/envDetails.json"
import RestRequest from "../../src/api/actions/RESTRequest";
import ReportGeneration from "../../src/helper/reportGeneration";
import UIActions from "../../src/webui/actions/UIActions";
import RestResponse from "../../src/api/actions/RESTResponse";
import JSONUtils from "../../src/utils/JSONUtils";
import StringUtils from "../../src/utils/StringUtils";
import DateUtils from "../../src/utils/DateUtils";


setDefaultTimeout(60 * 10 * 1000);


function getRequestHeadersWithOutAuth() {
    return new RequestHeaders().setRequestHeaders("Content-Type", APIConstants.CONTENT_TYPE_JSON)
      .get();
  }
let stockCheckFromUI:any;
let atpDateFromUI:any;
Then('get the stock of the {string} added to the basket', async function (product) {
     stockCheckFromUI = await new StockAvailabilityCheckPage(this.web).GetStockAvailabilityForProduct(product);
     atpDateFromUI = await StringUtils.getStringAfterParticularStr(await new StockAvailabilityCheckPage(this.web).GetATPAvailableDate(),'ATP');
});

  let stkChkResp: any;
  let StkChkAPI: any;
  When('user invokes Stock Availability Check API for the {string} and {string}', async function (product, branch) {
    let stkChkReqBody = {
        'CallingModule':'GOP',
        'CallingInstance': 'GOP',
        'RequestCreationDateTime': new Date().toISOString().slice(0, 19),
        'ItemDetailList': [{
            'ItemIdentifier': product,
             'OrgInfoList': [
                    {
                        'OrgIdentifier': branch
                    }
                ],
            'RequestedDateTime': new Date().toISOString().slice(0, 19)
        }]
    } as any;
    const credentials = Buffer.from(`${data.SCMDEV[0].SCMDEVUSERNAME}:${data.SCMDEV[0].SCMDEVPASSWORD}`).toString('base64');
    console.log(credentials)
    let mapHeaders = new Map<string, string>([
         ['Content-Type', APIConstants.CONTENT_TYPE_JSON],
         ['Authorization', `Basic ${credentials}`]
    ]);
    web: UIActions;
    const request: RestRequest =  await this.rest;
    await ReportGeneration.attachReportForAPI(" The Request Body is \n " + JSON.stringify(stkChkReqBody), this);
    stkChkResp = await request.postReqWithAuth(data.SCMDEV[0].SCMDEVURL+data.SCMDEV[0].SCMSTOCKCHKAPI,mapHeaders,stkChkReqBody);
    StkChkAPI = await JSONUtils.getJsonValueFromResponse(await stkChkResp.json(),"AvailableQuantity");
    
  });

  Then('stock number in response should match the data in UI', async function () {
    await ReportGeneration.attachReportForAPI(" The Reponse for Quick Availability is \n " + JSON.stringify(await stkChkResp.json(),null,2), this);
    await Assert.AssertTrue(stockCheckFromUI.split(' ')[0] === StkChkAPI[0].toString())
  });

    let stkChkAvailResp: any;
    let StkChkAvailAPI: any;
    When('user invokes Quick Availability Check API for the {string} and {string}', async function (product, branch) {
       let CheckAvailReqBody = 
       {
        "CallingModule": "HVGOP",
        "CallingInstance": "OPS",
        "RequestCreationDate": new Date().toISOString().slice(0, 19),
        "RequestTimeZone": "GMT",
        "ReleaseNumber": "1110990",
        "UniqueOrderIdentifier": "1110990",
        "FulfillmentLineEntryList": {
            "FulfillmentLine": {
                "FulfillmentLineIdentifier": "1",
                "SalesOrderNumber": "001",
                "InstanceNumber": "GOP",
                "SalesOrderLineNumber": "1",
                "RequestType": "Order",
                "RequestedCreationDate": new Date().toISOString().slice(0, 19),
                "RequestedItem": product,
                "PromisingType": "Ship",
                "RequestedDateTime": new Date().toISOString().slice(0, 19),
                "RequestedQuantity": 1,
                "RequestedQuantityUOM": "EA",
                "UnitPrice": 334.23,
                "PlanningMultiple": "1",
                "SubstitutionsAllowedFlag": false,
                "SplitsAllowedFlag": true,
                "GenerateAltAvailabilityFlag": true,
                "AvailabilityBasis": "Delivery",
                "GeneratePeggingFlag": true,
                "IgnoreReservationFlag": false,
                "IgnoreDateReservationFlag": false,
                "RequestedShipFromOrg": {
                    "OrgIdentifier": branch
                }
            }
        }
    } as any;
    const credentials = Buffer.from(`${data.SCMDEV[0].SCMDEVUSERNAME}:${data.SCMDEV[0].SCMDEVPASSWORD}`).toString('base64');
    let mapHeaders = new Map<string, string>([
         ['Content-Type', APIConstants.CONTENT_TYPE_JSON],
         ['Authorization', `Basic ${credentials}`]
    ]);
    web: UIActions;
    const request: RestRequest =  await this.rest;
    await ReportGeneration.attachReportForAPI(" The Request Body is \n " + JSON.stringify(CheckAvailReqBody), this);
    stkChkAvailResp = await request.postReqWithAuth(data.SCMDEV[0].SCMDEVURL+data.SCMDEV[0].SCMCHKAVAILABILITY,mapHeaders,CheckAvailReqBody);
    StkChkAvailAPI = await JSONUtils.getJsonValueFromResponse(await stkChkAvailResp.json(),"ExpectedShipDateTime");
    });

    Then('extract the ExpectedShipDateTime from the response', async function () {
        await ReportGeneration.attachReportForAPI(" The Reponse for Check Availability is \n " + JSON.stringify(await stkChkAvailResp.json(),null,2), this);
        await Assert.AssertTrue(atpDateFromUI === await DateUtils.CovertStringToDate(StkChkAvailAPI[0],'DD MMM YYYY'))
    });



