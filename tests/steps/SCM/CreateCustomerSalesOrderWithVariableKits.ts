import { setDefaultTimeout, When } from "@cucumber/cucumber";
import DateUtils from "../../../src/utils/DateUtils";
import { sharedData } from "../../../src/support/SharedData";
import path from "path";
import * as fs from 'fs';
import JSONUtils from "../../../src/utils/JSONUtils";
import HeaderBuilder from "../../../src/utils/headerBuilder";
import APIConstants from "../../../src/api/APIConstants/APIConstants";
import APIClient from "../../../src/api/actions/APIREQRES/APIClient";
import { ICustomWorld } from "../../../src/support/CustomWorld";


setDefaultTimeout(300000);
let orderQuantity: any;
let changeField: any;
let jsonCustSOPathReadVariableKits = 'src/api/payloads/CustomerSOOrderVariableKitsPayload.json'

 When('user update the variable kits payload with {string},{string},{string},{string},{string},{string}', async function (this:ICustomWorld,parentProduct, optionalProduct, childProduct, destinationOrg, quantity, productPrice) {
     
      const todayDate = await DateUtils.generateDateWithFormat('DDMMHHSS');
      const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
      const sourceTransactionNumber = this.testdata![0].BRANCH + '|' + todayDate;
      console.log(this.testdata![0].PARENTPRODUCT);
      orderQuantity = this.testdata![0].QUANTITY;
      sharedData.quantity = orderQuantity;
      sharedData.variableKitsParentProduct = this.testdata![0].PARENTPRODUCT;
      sharedData.variableKitsOptionalProduct = this.testdata![0].VARIABLEPRODUCT;
      sharedData.variableKitsChildProduct = this.testdata![0].CHILDPRODUCT;

      // orderQuantity = quantity;
      // sharedData.quantity = quantity;
      // sharedData.variableKitsParentProduct = parentProduct;
      // sharedData.variableKitsOptionalProduct = optionalProduct;
      // sharedData.variableKitsChildProduct = childProduct;
      let parentProductPriceData: GLfloat = parseFloat(sharedData.quantity) * parseFloat(this.testdata![0].PRODUCTPRICE)
      changeField = {
    "SourceTransactionNumber": sourceTransactionNumber,
    "SourceTransactionId": sourceTransactionNumber,
    "lines": [
      {
        "RequestedFulfillmentOrganizationCode": this.testdata![0].BRANCH,
        "RequestedArrivalDate": dateFormat,
        "ProductNumber": sharedData.variableKitsParentProduct,
        "OrderedQuantity": parseInt(sharedData.quantity),
        "chargeComponents": [
          {
            "HeaderCurrencyUnitPrice": this.testdata![0].PRODUCTPRICE,
            "HeaderCurrencyExtendedAmount": parentProductPriceData
          }, {
            "HeaderCurrencyUnitPrice": this.testdata![0].PRODUCTPRICE,
            "HeaderCurrencyExtendedAmount": parentProductPriceData,
          }
        ]
      },
      {
        "RequestedFulfillmentOrganizationCode": this.testdata![0].BRANCH,
        "RequestedArrivalDate": dateFormat,
        "ProductNumber": sharedData.variableKitsOptionalProduct,
        "ParentSourceTransactionLineId": "1",
        "OrderedQuantity": parseInt(sharedData.quantity),
        "chargeComponents": [
          {
            "HeaderCurrencyUnitPrice": 0,
            "HeaderCurrencyExtendedAmount": 0
          }, {
            "HeaderCurrencyUnitPrice": 0,
            "HeaderCurrencyExtendedAmount": 0,
          }
        ]
      },
      {
        "RequestedFulfillmentOrganizationCode": this.testdata![0].BRANCH,
        "RequestedArrivalDate": dateFormat,
        "ProductNumber": sharedData.variableKitsChildProduct,
        "ParentSourceTransactionLineId": "2",
        "OrderedQuantity": parseInt(sharedData.quantity),
        "chargeComponents": [
          {
            "HeaderCurrencyUnitPrice": 0,
            "HeaderCurrencyExtendedAmount": 0
          }, {
            "HeaderCurrencyUnitPrice": 0,
            "HeaderCurrencyExtendedAmount": 0,
          }
        ]
      }
    ]
  }
  const updatedTOJson = await JSONUtils.updateAllUpdatedFieldsInJSONPayload(path.resolve(process.cwd(), jsonCustSOPathReadVariableKits), changeField, "lines");    
});

 When('User execute post request for Variable Kits Customer Sales Order API', async function () {
     const headers = await HeaderBuilder.BuildMultipleHeaders({
         'Content-Type': APIConstants.CONTENT_TYPE_JSON,
         'Accept': APIConstants.CONTENT_TYPE_TEXTXML
     })
     const rawJson = await fs.promises.readFile(path.resolve(process.cwd(), jsonCustSOPathReadVariableKits), 'utf-8');
     const parsedJson = JSON.parse(rawJson)
     const scmBasicAuthHeader = await HeaderBuilder.BuildBasicAuthHeader(this.SCMUSER, this.SCMPASSWORD);
     this.getResponse = await APIClient.post(this.SCMURL, this.customerSalesEndPointAPI, JSON.stringify(parsedJson, null, 2), scmBasicAuthHeader);
 });