import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import DateUtils from "../../../src/utils/DateUtils";
import JSONUtils from "../../../src/utils/JSONUtils";
import path from "path";
import * as fs from 'fs'
import { AxiosResponse } from "axios";
import HeaderBuilder from "../../../src/utils/headerBuilder";
import APIConstants from "../../../src/api/APIConstants/APIConstants";
import APIClient from "../../../src/api/actions/APIREQRES/APIClient";
import { ICustomWorld } from "../../../src/support/CustomWorld";
import { sharedData } from '../../../src/support/SharedData'
import Assert from "../../../src/asserts/Assert";



setDefaultTimeout(300000);
let customerSalesEndPointAPI: any;
let jsonCustSOPathReadMultiLine = 'src/api/payloads/CustomerSOOrdersMultiLinePayload.json'

let orderQuantity: any;
let changeField: any;
let product1: string;
let product2: string;
When('user update the multilines payload with {string},{string},{string},{string},{string},{string}', async function (product, product_1, destinationOrg, quantity, productPrice, productPrice1) {
  const todayDate = await DateUtils.generateDateWithFormat('DDMMHHSS');
  const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
  const sourceTransactionNumber = destinationOrg + '|' + todayDate;
  orderQuantity = quantity;
  sharedData.quantity = quantity;
  product1 = product;
  product2 = product_1;
  console.log(`${product1}, ${product2}`)
  let productPriceData: GLfloat = parseFloat(quantity) * parseFloat(productPrice)
  let productPriceData1: GLfloat = parseFloat(quantity) * parseFloat(productPrice1)
  changeField = {
    "SourceTransactionNumber": sourceTransactionNumber,
    "SourceTransactionId": sourceTransactionNumber,
    "lines": [
      {
        "RequestedFulfillmentOrganizationCode": destinationOrg,
        "RequestedArrivalDate": dateFormat,
        "ProductNumber": product1,
        "OrderedQuantity": parseInt(quantity),
        "chargeComponents": [
          {
            "HeaderCurrencyUnitPrice": productPrice,
            "HeaderCurrencyExtendedAmount": productPriceData
          }, {
            "HeaderCurrencyUnitPrice": productPrice,
            "HeaderCurrencyExtendedAmount": productPriceData,
          }
        ]
      },
      {
        "RequestedFulfillmentOrganizationCode": destinationOrg,
        "RequestedArrivalDate": dateFormat,
        "ProductNumber": product2,
        "OrderedQuantity": parseInt(quantity),
        "chargeComponents": [
          {
            "HeaderCurrencyUnitPrice": productPrice1,
            "HeaderCurrencyExtendedAmount": productPriceData1
          }, {
            "HeaderCurrencyUnitPrice": productPrice1,
            "HeaderCurrencyExtendedAmount": productPriceData1,
          }
        ]
      }
    ]
  }

  const updatedTOJson = await JSONUtils.updateAllUpdatedFieldsInJSONPayload(path.resolve(process.cwd(), jsonCustSOPathReadMultiLine), changeField, "lines");
});


When('User execute post request for Multilines Customer Sales Order API', async function (this: ICustomWorld) {
  const headers = await HeaderBuilder.BuildMultipleHeaders({
    'Content-Type': APIConstants.CONTENT_TYPE_JSON,
    'Accept': APIConstants.CONTENT_TYPE_TEXTXML
  })
  const rawJson = await fs.promises.readFile(path.resolve(process.cwd(), jsonCustSOPathReadMultiLine), 'utf-8');
  const parsedJson = JSON.parse(rawJson)
  const scmBasicAuthHeader = await HeaderBuilder.BuildBasicAuthHeader(this.SCMUSER, this.SCMPASSWORD);
  this.getResponse = await APIClient.post(this.SCMURL, this.customerSalesEndPointAPI, JSON.stringify(parsedJson, null, 2), scmBasicAuthHeader);
});

Then('Capture the response data for multiple customer sales order', async function (this: ICustomWorld) {
  sharedData.CUSTOMERSALESORDERNUMBER = (await JSONUtils.getJsonValueFromResponse(this.getResponse.data, 'OrderNumber'))
  sharedData.ItemNumber1 = product1;
  sharedData.ItemNumber2 = product2;
  console.log(`the customer sales order is ${sharedData.CUSTOMERSALESORDERNUMBER} , ${product1} , ${product2}`)
  fs.writeFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', JSON.stringify({
    customerSalesOrderNumber: sharedData.CUSTOMERSALESORDERNUMBER, SOorderQty: orderQuantity, itemNum1: product1, itemNum2: product2
  }, null, 2));
});

/* Check MultiLine Customer Sales Order to check the Status */
let customerSO: string;
When('User enters the customer sales order number for multiline order', async function (this: ICustomWorld) {
  let data: any = {};
  if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
    const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
    if (content.trim()) {
      data = JSON.parse(content);
    }
  }
  customerSO = data.customerSalesOrderNumber;
  await this.manageOrderSCMRedwood.EnterCustomerSalesOrder(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER)
});

let statusOf_itemNum1: string
let statusOf_itemNum2: string
Then('User should see the order status as {string} for all products', async function (this: ICustomWorld, string) {
  await this.manageOrderSCMRedwood.ClickOnCustomerSalesOrderLink(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER.trim());
  for (let j = 0; j < 10; j++) {
    statusOf_itemNum1 = await this.manageOrderSCMRedwood.GetMultiLineOrderStatusFromManageOrders(this.newWindow, sharedData.ItemNumber1, 'Status');
    statusOf_itemNum2 = await this.manageOrderSCMRedwood.GetMultiLineOrderStatusFromManageOrders(this.newWindow, sharedData.ItemNumber2, 'Status');
    if (statusOf_itemNum1 === 'Awaiting Shipping' && statusOf_itemNum2 === 'Awaiting Shipping') {
      break;
    } else {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.manageOrderSCMRedwood.clickOnRefresh(this.newWindow);
      statusOf_itemNum1 = await this.manageOrderSCMRedwood.GetMultiLineOrderStatusFromManageOrders(this.newWindow, sharedData.ItemNumber1, 'Status');
      statusOf_itemNum2 = await this.manageOrderSCMRedwood.GetMultiLineOrderStatusFromManageOrders(this.newWindow, sharedData.ItemNumber2, 'Status');
    }
  }
  await Assert.assertEquals('Awaiting Shipping', statusOf_itemNum1)
  await Assert.assertEquals('Awaiting Shipping', statusOf_itemNum2)
  await this.newWindow.close();
  await this.originalPage.bringToFront();
  await this.orderManagementPage.ClickOnClose();
});

/* Validate Multiline Sales Order in SaaS */
When('User enter the Multiline CustomerSalesOrder Number', async function (this: ICustomWorld) {
  // let data: any = {};
  // if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
  //   const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
  //   if (content.trim()) {
  //     data = JSON.parse(content);
  //   }
  // }
  // customerSO = data.customerSalesOrderNumber;
  await this.inventoryManagamentPage.EnterDocumentNumberShipmentLines(sharedData.CUSTOMERSALESORDERNUMBER.trim())
});

When('User enter  CustomerMultiLineSalesOrder Number under ShipmentLines', async function (this: ICustomWorld) {
  await this.shipmentLinePage.EnterCustomerSalesOrderNumber(sharedData.CUSTOMERSALESORDERNUMBER.trim());
});


Then('User Should see Shipment Lines Page for products {string} , {string} with Line Status as Ready to release', async function (this: ICustomWorld, product1, product2) {
  await this.shipmentLinePage.GetShipmentLineStatusForProducts('Line Status', 'Ready to release', product1, product2)
  await Assert.AssertTrue(await this.shipmentLinePage.IsShipmentLinesVisibleForMultiLineCustSO(product1, product2))
});

Then('User should see the status for CustomerSalesOrder as {string} for products {string} , {string}', async function (this: ICustomWorld, expectedStatus, product1, product2) {
  await Assert.AssertTrue(await this.shipmentLinePage.GetShipmentLineStatusForProducts('Line Status', expectedStatus, product1, product2));
});


Then('User should Capture ShipmentID for CustomerSalesOrder for products {string},{string}', async function (this: ICustomWorld, product1, product2) {
  const shipmentID = await this.shipmentLinePage.GetShipmentIDForMultiProducts('Shipment', product1, product2);
  console.log(`shipment call - ${shipmentID}`)
  if (!shipmentID.includes('-')) {
    sharedData.shipmentNumberMulti = shipmentID.trim()
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
      const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
      if (content.trim()) {
        data = JSON.parse(content);
      }
    }
    data[`ShipmentNumber_${product1}_${product2}`] = shipmentID.trim();
    fs.writeFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', JSON.stringify(
      data, null, 2));
  } else {
    sharedData.shipmentNumberMulti = shipmentID.trim()
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
      const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
      if (content.trim()) {
        data = JSON.parse(content);
      }
    }
    const key1 = `ShipmentNumber_${product1}`
    const key2 = `ShipmentNumber_${product1}`
    data[key1] = shipmentID.split('-')[0];
    data[key2] = shipmentID.split('-')[1];
    fs.writeFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', JSON.stringify(
      data, null, 2));
  }

});

/* Pick Confirm */
let itemQuantity: string;
When('User enters  CustomerSalesOrder Number for MultiLine', async function (this: ICustomWorld) {
  // let data: any = {};
  // if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
  //   const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
  //   if (content.trim()) {
  //     data = JSON.parse(content);
  //   }
  // }
  // customerSO = data.customerSalesOrderNumber;
  // itemQuantity = data.SOorderQty;
  //sharedData.CUSTOMERSALESORDERNUMBER = '1BL|03031431';
  await this.confirmPicksPage.EnterCustomerSalesOrderNumberOnConfirmPicksPage(sharedData.CUSTOMERSALESORDERNUMBER);
});


Then('User should see the tiles contaning {string} and {string} and {string} information', async function (this: ICustomWorld, product1, product2, branch) {
  await Assert.AssertTrue(await this.confirmPicksPage.isProductsCardDisplayedForMultipleProducts(product1, product2))
  await Assert.assertContains((await this.confirmPicksPage.GetPickingQuantityFromMultiProductTileInPickingPane(product1, product2)).split('-')[0].split(' ')[0].trim(), sharedData.quantity.trim())
  await Assert.assertContains((await this.confirmPicksPage.GetPickingSourceBranchFromProductTilePane(product1)).split(':')[1].trim(), branch.split('-')[1].trim())
  await Assert.assertContains((await this.confirmPicksPage.GetPickingSourceBranchFromProductTilePane(product2)).split(':')[1].trim(), branch.split('-')[1].trim())
  //await Assert.assertContains((await this.confirmPicksPage.GetPickingDestinationBranchFromProductTilePane(product1)).split(':')[1], branch.split('-')[1].trim())

  //await Assert.assertContains((await this.confirmPicksPage.GetPickingDestinationBranchFromProductTilePane(product2)).split(':')[1], branch.split('-')[1].trim())

});

When('User selects Pick All Items', async function (this: ICustomWorld) {
  await this.confirmPicksPage.ClickOnPickAllItems();
});

Then('User should see Confirm Pick and Next option', async function (this: ICustomWorld) {
  await Assert.AssertTrue(await this.confirmPicksPage.IsConfirmPickAndNextIsVisible());
});

When('User enter subinventory info as {string} , {string}, {string}, picked quantity  for all products in Customer Sales Order', async function (this: ICustomWorld, branch, product1, product2) {
  if (this.envData === 'TST' || this.envData === 'tst') {
    await this.confirmPicksPage.EnterSubInventoryPickedQtyMultiLine(sharedData.quantity);
  } else {
    await this.confirmPicksPage.EnterSubinventoryCodeForProduct(product1, product2, sharedData.quantity)
  }
});

/* Confirm Ship Goods for Multi Line */
let shipmentConfNumber: string;
When('User enters Shipment Number for Customer Sales Order for MultiLine product {string},{string}', async function (product1, product2) {
  // let data: any = {};
  // if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
  //   const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
  //   if (content.trim()) {
  //     data = JSON.parse(content);
  //   }
  // }
  // let shipmentData = `ShipmentNumber_${product1}_${product2}`
  // itemQuantity = data.SOorderQty;
  // console.log(shipmentData)
  // shipmentConfNumber = data[shipmentData];
  // console.log(shipmentConfNumber.trim())
  await this.confirmShipmentPage.EnterShipmentNumber(sharedData.shipmentNumberMulti.trim());
});

Then('User should see Shipment page to ship goods for products {string},{string}', async function (this: ICustomWorld, product1, product2) {
  await Assert.AssertTrue(await this.confirmShipmentPage.IsShipmentForProductDisplayed(sharedData.shipmentNumberMulti.trim(), product1, product2));
});

When('User clicks on Shipment Number tile for products {string},{string} and validate the shipment Quantity', async function (this: ICustomWorld, product1, product2) {
  await this.confirmShipmentPage.ClickOnShipmentTile(product1);
  let getPickedQuantityprod1 = await this.confirmShipmentPage.GetShippedQtyInShipmentLineDetails();
  await Assert.assertEquals(sharedData.quantity, getPickedQuantityprod1);
  await this.confirmShipmentPage.ClickOnCancelOnShipmentPage();
  await this.confirmShipmentPage.ClickOnShipmentTile(product2);
  let getPickedQuantityprod2 = await this.confirmShipmentPage.GetShippedQtyInShipmentLineDetails();
  await Assert.assertEquals(sharedData.quantity, getPickedQuantityprod2);
  await this.confirmShipmentPage.ClickOnCancelOnShipmentPage();
});

/* Validate Quantity shipped after shipping */

Then('User should validate shipped quantity for Customer Sales Order for products {string} , {string}', async function (this: ICustomWorld, product1, product2) {
  //   let data: any = {};
  // if (fs.existsSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json')) {
  //   const content = fs.readFileSync('src/data/TransferOrderData/CustomerMultiLineSalesOrderData.json', 'utf8');
  //   if (content.trim()) {
  //     data = JSON.parse(content);
  //   }
  // }
  // itemQuantity = data.SOorderQty;
  const shippedQty = await this.shipmentLinePage.GetShipmentIDForMultiProducts('Ship Quantity', product1, product2);
  if (shippedQty.includes('-')) { await Assert.assertContains(sharedData.quantity, shippedQty.split('-')[0]); } else { await Assert.assertContains(sharedData.quantity, shippedQty); }

});