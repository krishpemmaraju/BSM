
import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import type { ICustomWorld } from "../../../src/support/CustomWorld";
import DateUtils from "../../../src/utils/DateUtils";
import JSONUtils from "../../../src/utils/JSONUtils";
import path from "path";
import HeaderBuilder from "../../../src/utils/headerBuilder";
import APIConstants from "../../../src/api/APIConstants/APIConstants";
import APIClient from "../../../src/api/actions/APIREQRES/APIClient";
import * as fs from 'fs';
import { AxiosResponse } from "axios";
import Assert from "../../../src/asserts/Assert";
import { sharedData } from '../../../src/support/SharedData'

setDefaultTimeout(300000);
let jsonCustSOPathRead = 'src/api/payloads/CustomerSOOrdersPayload.json'
Given('the API end point for Customer Order API', async function (this: ICustomWorld) {
    this.customerSalesEndPointAPI = "fscmRestApi/resources/11.13.18.05/salesOrdersForOrderHub"
});

let changeField: any;
let captureSourceTransactionNumber: string;
let updatingChildArray: any;
let orderQuantity: any;
When('user update the payload with {string},{string},{string},{string}', async function (this: ICustomWorld, product, destinationOrg, quantity, productPrice) {
    const todayDate = await DateUtils.generateDateWithFormat('DDMMHHSS');
    const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const sourceTransactionNumber = destinationOrg + '|' + todayDate;
    orderQuantity = quantity;
    sharedData.quantity = quantity;
    let productPriceData: GLfloat = parseFloat(quantity) * parseFloat(productPrice)
    changeField = {
        "SourceTransactionNumber": sourceTransactionNumber,
        "SourceTransactionId": sourceTransactionNumber,
        "lines": [{
            "RequestedFulfillmentOrganizationCode": destinationOrg,
            "RequestedArrivalDate": dateFormat,
            "ProductNumber": product,
            "OrderedQuantity": parseInt(quantity)
        }]
    }
    const updatedTOJson = await JSONUtils.updateJsonFields(path.resolve(process.cwd(), jsonCustSOPathRead), "lines", changeField);
    updatingChildArray = {
        "chargeComponents": [
            {
                "HeaderCurrencyUnitPrice": parseInt(productPrice),
                "HeaderCurrencyExtendedAmount": productPriceData,
            },
            {
                "HeaderCurrencyUnitPrice": parseInt(productPrice),
                "HeaderCurrencyExtendedAmount": productPriceData,
            }
        ]
    }
    const updatedChildArrayJson = await JSONUtils.updatedAllArrays(path.resolve(process.cwd(), jsonCustSOPathRead), "chargeComponents", updatingChildArray);
});

When('User execute post request for Customer Sales Order API', async function (this: ICustomWorld) {
    const headers = await HeaderBuilder.BuildMultipleHeaders({
        'Content-Type': APIConstants.CONTENT_TYPE_JSON,
        'Accept': APIConstants.CONTENT_TYPE_TEXTXML
    })
    const rawJson = await fs.promises.readFile(path.resolve(process.cwd(), jsonCustSOPathRead), 'utf-8');
    const parsedJson = JSON.parse(rawJson)
    const scmBasicAuthHeader = await HeaderBuilder.BuildBasicAuthHeader(this.SCMUSER, this.SCMPASSWORD);
    this.getResponse = await APIClient.post(this.SCMURL, this.customerSalesEndPointAPI, JSON.stringify(parsedJson, null, 2), scmBasicAuthHeader);
});

Then('user should receive {int} response code', async function (this: ICustomWorld, int) {
    await Assert.assertEquals('201', this.getResponse.status.toString())
});

Then('capture the customer sales order single line response data', async function () {
    sharedData.CUSTOMERSALESORDERNUMBER = (await JSONUtils.getJsonValueFromResponse(this.getResponse.data, 'OrderNumber'))
    fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', JSON.stringify({
        customerSalesOrderNumber: sharedData.CUSTOMERSALESORDERNUMBER, SOorderQty: orderQuantity
    }, null, 2));
});


// Validate the Customer Sales Order in SCM

When('User clicks on {string} under Actions menu', async function (this: ICustomWorld, menuOption) {
    this.newWindow = await this.orderManagementPage.ClickOnManageOrdersRedwood(menuOption);
});

Then('User should see Manage Orders Page', async function (this: ICustomWorld) {
    this.originalPage = this.page;
    await Assert.AssertTrue(await this.manageOrderSCMRedwood.IsManageOrdersPageDisplayed(this.newWindow))
});
let customerSO: string;
When(/^User enters the customer sales order number$/, async function (this: ICustomWorld) {
    // let data: any = {};
    // if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
    //     const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
    //     if (content.trim()) {
    //         data = JSON.parse(content);
    //     }
    // }
    // customerSO = data.customerSalesOrderNumber;
    await this.manageOrderSCMRedwood.EnterCustomerSalesOrder(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER.trim())
});


When('User clicks on search', async function (this: ICustomWorld) {
    await this.manageOrderSCMRedwood.ClickOnSearch(this.newWindow)
});

Then(/^User should see the order status as "([^"]*)"$/, async function (this: ICustomWorld, customerSOStatus) {
    await Assert.AssertTrue(await this.manageOrderSCMRedwood.IsSearchResultDisplayed(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER.trim()))
    await this.newWindow.close();
    await this.originalPage.bringToFront();
});

/* Perform Pick Release */

let itemNumShipmentLines: any;
let custSalesOrderNumber: any;
When(/^User enter the CustomerSalesOrder Number$/, async function (this: ICustomWorld) {
    // let data: any = {};
    // if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
    //     const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
    //     if (content.trim()) {
    //         data = JSON.parse(content);
    //     }
    // }
    // custSalesOrderNumber = data.customerSalesOrderNumber;
    await this.inventoryManagamentPage.EnterDocumentNumberShipmentLines(sharedData.CUSTOMERSALESORDERNUMBER)
});

When('User enter  CustomerSalesOrder Number under ShipmentLines', async function (this: ICustomWorld) {
    await this.shipmentLinePage.EnterCustomerSalesOrderNumber(sharedData.CUSTOMERSALESORDERNUMBER);
});

Then('User should see the status for CustomerSalesOrder as {string} for {string}', async function (this: ICustomWorld, lineStatus, product) {
    await Assert.AssertTrue(await this.shipmentLinePage.GetShipmentLineStatus(product, lineStatus))
});

Then(/^User should Capture ShipmentID for CustomerSalesOrder$/, async function (this: ICustomWorld) {
    let shipmentID = await this.shipmentLinePage.GetShipmentNumber('Shipment')
    sharedData.shipmentNumber = shipmentID;
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    data.ShipmentNumber = shipmentID.trim();
    fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', JSON.stringify(
        data, null, 2));
})

/* Confirm Pick Steps */

let itemQuantity: any
When('User enters CustomerSalesOrder Number', async function (this: ICustomWorld) {
    // let data: any = {};
    // if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
    //     const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
    //     if (content.trim()) {
    //         data = JSON.parse(content);
    //     }
    // }
    // let custSalesOrderNumber = data.customerSalesOrderNumber
    // itemQuantity = data.SOorderQty;
    await this.confirmPicksPage.EnterCustomerSalesOrderNumberOnConfirmPicksPage(sharedData.CUSTOMERSALESORDERNUMBER);
});

Then(/^User should see the tile contaning "([^"]*)" and "([^"]*)" information$/, async function (this: ICustomWorld, product, branch) {
    await Assert.AssertTrue(await this.confirmPicksPage.IsProuctTileDisplayed(product))
    await Assert.assertContains((await this.confirmPicksPage.GetQuantityFromProductTileInPickingPane()).split(' ')[0].trim(), sharedData.quantity.trim())
    await Assert.assertContains((await this.confirmPicksPage.GetSourceLocationFromProductTileInPickingPane()).split(':')[1].trim(), branch.split('-')[1].trim())
    await Assert.assertContains((await this.confirmPicksPage.GetDestinationLocationFromProductTileInPickingPane()).split(':')[1], branch.split('-')[1].trim())
});

When('User selects the tile for the {string} pick confirm', async function (this: ICustomWorld, product) {
    await this.confirmPicksPage.ClickOnItemPanelUnderConfirmPicks(product)
});

When('user enter subinventory info as {string} for Customer Sales Order', async function (this: ICustomWorld, branch) {
    await this.confirmPicksPage.EnterSubnventoryCode(branch.split('-')[1].trim())
});

When('User enter product number as {string}', async function (this: ICustomWorld, product) {
    await this.confirmPicksPage.EnterItemNumber(product)
});

When('User enters Picked quantity for Customer Sales Order', async function (this: ICustomWorld) {
    await this.confirmPicksPage.EnterPickedQuantity(sharedData.quantity);
});

/* Shipping Instructions */
let shipmentNumForConfShipment: any;
let CustSOorderQuantity: any;
When(/^User enters Shipment Number for Customer Sales Order$/, async function (this: ICustomWorld) {
    // let data: any = {};
    // if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
    //     const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
    //     if (content.trim()) {
    //         data = JSON.parse(content);
    //     }
    // }
    // shipmentNumForConfShipment = data.ShipmentNumber;
    // CustSOorderQuantity = data.SOorderQty;
    await this.confirmShipmentPage.EnterShipmentNumber(sharedData.shipmentNumber)
});

Then('User should see Shipment page to ship goods for product {string}', async function (this: ICustomWorld, product) {
    await Assert.AssertTrue(await this.confirmShipmentPage.IsShipmentNumberPageDisplayed(sharedData.shipmentNumber, product));
});

When('User clicks on Shipment Number tile for product {string}', async function (this: ICustomWorld, product) {
    await this.confirmShipmentPage.ClickOnShipmentTile(product);
});

Then(/^Validate Shipped quantity under Shipment Line Data$/, async function (this: ICustomWorld) {
    await Assert.assertEquals(sharedData.quantity, (await this.confirmShipmentPage.GetShippedQtyInShipmentLineDetails()).trim())
    await this.confirmShipmentPage.ClickOnCancelOnShipmentPage();
});

When('Click on Confirm Shipment', async function (this: ICustomWorld) {
    await this.confirmShipmentPage.ClickOnConfirmShipment();
    //await Assert.AssertTrue(await this.confirmShipmentPage.IsShipmentConfirmationMessageDisplayed(sharedData.shipmentNumber))
});

/* Validate After the Order is Shipped */

Then('User Should see Shipment Lines Page with Line Status as Interfaced', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.shipmentLinePage.IsInterfacedDisplayed())
});

let CustSOorderQuantityBeforeShipped: any;
Then(/^User should validate shipped quantity for Customer Sales Order$/, async function (this: ICustomWorld) {
    let shippedQty = await this.shipmentLinePage.GetShipmentNumber('Ship Quantity')
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderData.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderData.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    CustSOorderQuantityBeforeShipped = data.SOorderQty;
    await Assert.assertEquals(sharedData.quantity, shippedQty.trim())
});







