import { Given, setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import JSONUtils from "../../../src/utils/JSONUtils";
import path from "path";
import HeaderBuilder from "../../../src/utils/headerBuilder";
import APIClient from "../../../src/api/actions/APIREQRES/APIClient";
import APIConstants from "../../../src/api/APIConstants/APIConstants";
import DateUtils from "../../../src/utils/DateUtils";
import Assert from "../../../src/asserts/Assert";
import fs from 'fs'
import DBUtils from "../../../src/utils/DBReaderUtils";
import DBConnection from "../../../src/db/DBConnection";
import StringUtils from "../../../src/utils/StringUtils";
import type { ICustomWorld } from "../../../src/support/CustomWorld";


// setDefaultTimeout(1200000);
setDefaultTimeout(300000);
let jsonFilePathRead: string = 'src/api/payloads/createTransferOrderPayload.json'
let jsonCustSOPathRead = 'src/api/payloads/createCustomerSOOrderPayload.json'
let IF206jsonFilePath: string = 'src/api/payloads/IF206ShipConfirm.json'
let getSupplyReferenceNumber: string;
let getCustomerSONumber: string;
let createTOAPIURL: string;
Given('the API end point for Create Transfer Order API', async function () {
    createTOAPIURL = this.SCMURL + "/fscmRestApi/resources/11.13.18.05/supplyRequests";
});
let updatedTOJson: Record<string, any>;
let changeField: any;
let todayInterfaceDate: string = "KK";
When('user update the payload with {string},{string},{string},{string},{string}', async function (product, destinationOrg, destinationSubOrg, sourceOrg, quantity) {
    const todayDate = await DateUtils.generateDateWithFormat('DDHHSS');
    const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
    todayInterfaceDate = todayInterfaceDate + todayDate;
    changeField = {
        "InterfaceBatchNumber": todayInterfaceDate,
        "SupplyOrderReferenceNumber": todayInterfaceDate,
        "SupplyRequestDate": dateFormat,
        "supplyRequestLines": [{
            "InterfaceBatchNumber": todayInterfaceDate,
            "DestinationOrganizationCode": destinationOrg, "DestinationSubinventoryCode": destinationSubOrg,
            "SourceOrganizationCode": sourceOrg, "SourceSubinventoryCode": sourceOrg, "ItemNumber": product,
            "NeedByDate": dateFormat,
            "Quantity": parseInt(quantity)
        }]
    }
});

let getResponse: any;
When('User send the post request to the endpoint', async function () {
    const headers = await HeaderBuilder.BuildMultipleHeaders({
        'Content-Type': APIConstants.CONTENT_TYPE_JSON,
        'Accept': APIConstants.CONTENT_TYPE_TEXTXML
    }
    );
    const updatedTOJson = await JSONUtils.updateJsonFields(path.resolve(process.cwd(), jsonFilePathRead), "supplyRequestLines", changeField);
    const scmBasicAuthHeader = await HeaderBuilder.BuildBasicAuthHeader(this.SCMUSER, this.SCMPASSWORD);
    getResponse = await APIClient.post(this.SCMURL, "fscmRestApi/resources/11.13.18.05/supplyRequests", JSON.parse(updatedTOJson), scmBasicAuthHeader);
});

Then('User should have {int} response code successful and capture interface number', async function (int) {
    await Assert.assertEquals('201', getResponse.status.toString())
    getSupplyReferenceNumber = (await JSONUtils.getJsonValueFromResponse(getResponse.data, 'InterfaceBatchNumber'))
    this.itemNumber = (await JSONUtils.getJsonValueFromResponse(getResponse.data, 'ItemNumber'))
    this.itemQuantity = (await JSONUtils.getJsonValueFromResponse(getResponse.data, 'Quantity'))
    this.destinationOrg = (await JSONUtils.getJsonValueFromResponse(getResponse.data, 'DestinationOrganizationCode'))

    fs.writeFileSync('src/data/TransferOrderData/CreateTransferOrder.json', JSON.stringify({
        itemNumber: this.itemNumber,
        itemQuantity: this.itemQuantity,
        destinationOrgCode: this.destinationOrg
    }));

});

When('User navigate to Supply Chain Execution', async function () {
    await this.scmHomePage.navigateToSupplyChainExecution();
});

When('User click on Supply Orchestration', async function () {
    await this.scmHomePage.ClickOnSupplyChainOrchestration();
});

Then('User should see Supply Orchestration Page', async function () {
    await Assert.AssertTrue(await this.supplyOrchestrationPage.IsSupplyOrchestrationPageIsVisible());
});

When('navigate to Manage Supply Lines', async function () {
    await this.supplyOrchestrationPage.ClickOnTasks();
    await this.supplyOrchestrationPage.clickOnManageSupplyLines();
});

Then('User should see Manage Supply Lines Page', async function () {
    await Assert.AssertTrue(this.manageSupplyPage.IsManageSupplyLinesPageDisplayed());
});

When('User enter the Supply Reference number', async function () {
    //KK271047
    await this.manageSupplyPage.EnterSupplyReferenceNumber(getSupplyReferenceNumber.trim());
    // await this.manageSupplyPage.EnterSupplyReferenceNumber("KK101413");
});

When('Click on Search', async function () {
    await this.manageSupplyPage.ClickonManageSupplySearch()
});
let documentNumber: string;
Then('User should see Transfer Order Created and Capture the Transfer Order number', async function () {
    documentNumber = await this.manageSupplyPage.GetDocumentNumber('Document Number');
    console.log(documentNumber)
    for (let j = 0; j < 20; j++) {
        console.log('coming here')
        documentNumber = await this.manageSupplyPage.GetDocumentNumber('Document Number');
        if (documentNumber == ' ') {
            await this.manageSupplyPage.ExpandSearch();
            await this.manageSupplyPage.ClickonManageSupplySearch()
        } else {
            documentNumber = await this.manageSupplyPage.GetDocumentNumber('Document Number');
            break;
        }

    }
    let data: any = {};
    console.log(documentNumber)
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    data.transferOrderNumber = documentNumber
    fs.writeFileSync('src/data/TransferOrderData/CreateTransferOrder.json', JSON.stringify(
        data, null, 2));
});

When('User Clicks on Home Icon', async function () {
    await this.scmHomePage.ClickOnHomeIcon()
});
When('User click on {string}', async function (clickOnViewAllActions) {
    await this.inventoryManagamentPage.ClickOnViewAllActions();
});

Then('User should see Actions pop up', async function () {
    await Assert.AssertTrue(await this.inventoryManagementActionsPage.isActionsPopUpDisplayed());
});

When('User click on {string} under {string}', async function (optionsToSelect, mainMenuOption) {
    await this.inventoryManagementActionsPage.clickOnActionsDataFromInventoryManagementPage(optionsToSelect);
});

Then('User should see {string} Page', async function (transferOrderHeader) {
    await Assert.AssertTrue(await this.scmTransferOrdersPage.IsTransferOrdersPageDisplayed())
});

When('Select the {string} from filter', async function (transferOrderCreation) {
    await this.scmTransferOrdersPage.ClickOnTOScheduled(transferOrderCreation);
});

When('User enter the Transfer Order Number', async function () {
    await this.scmTransferOrdersPage.SearchTransferOrder("99664701");
    //  await this.scmTransferOrdersPage.SearchTransferOrder(documentNumber.trim());
    await this.scmTransferOrdersPage.ClickOnTransferOrderSearch();
});
let itemOnTO: string, quantityOnTo: string, getInterfaceStatus: string;

Then('Capture the {string}, {string}, {string}', async function (item, quantity, interfaceStatus) {
    await Assert.AssertTrue(await this.scmTransferOrdersPage.IsTransferOrderDisplayedInSearchResults())
    itemOnTO = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails(item);
    //    quantityOnTo = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails(quantity);
    getInterfaceStatus = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails(interfaceStatus);
    const getTOData = JSON.parse(fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf-8'));
    await Assert.assertEquals(getTOData.itemNumber, itemOnTO);
    //    await Assert.assertEquals(getTOData.itemQuantity, quantityOnTo);
    let attemptInt = 0;
    while (attemptInt < 400) {
        attemptInt++;
        await (await this.web.getElementByRoleByName('link', documentNumber.trim())).waitFor({ state: 'visible', timeout: 140000 })
        getInterfaceStatus = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails(interfaceStatus);
        if (getInterfaceStatus === 'Interfaced to Order Management') {
            break;
        }
        await this.scmTransferOrdersPage.SearchTransferOrder(documentNumber.trim());
        await this.scmTransferOrdersPage.ClickOnTransferOrderSearch();
        await new Promise(resolve => setTimeout(resolve, 14000));
    }
    await Assert.AssertTrue(getInterfaceStatus.includes('Interfaced to Order Management'));
});

let connectionHJ: any = null;
let results;
Given('User Connected to HJ DB', async function () {
    connectionHJ = await new DBConnection().connectToDB('HJ', this.HJUSER, this.HJPASSWORD, this.HJURL);
});

When('User runs the select query', async function () {
    const getTOInfoForQuery = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
    const getTODataQuery = JSON.parse(getTOInfoForQuery);
    let branchWithTO = getTODataQuery.destinationOrgCode + '/' + getTODataQuery.transferOrderNumber;
    let getQueryForKoerber = `SELECT SO.WH_ID,SO.STORE_ORDER_NUMBER, SO.ORDER_NUMBER, SOD.ITEM_NUMBER, SOD.ASSOC_CUST_PO_PRIOR, SOD.QTY FROM SI_ORDER SO, SI_ORDER_DETAIL SOD WHERE SO.ORDER_NUMBER = SOD.ORDER_NUMBER AND SO.WH_ID = SOD.WH_ID AND 
    SO.TRANS_NUMBER = SOD.TRANS_NUMBER  AND SO.STORE_ORDER_NUMBER = '${branchWithTO}'`;
    results = await new DBConnection().attemptQueryForResults(connectionHJ, 400, getQueryForKoerber, 30000)
});
Then('User should see the results', async function () {
    let getTOData: any[] = [];
    for (let data of results.rows) {
        let rowObj: any = {}
        for (let key in data) {
            rowObj[key] = data[key]
        }
        getTOData.push(rowObj)
    }
    fs.writeFileSync('src/data/TransferOrderData/GetTransferOrder.json', JSON.stringify(
        getTOData, null, 2));
});

let IF206ShipConfirmURL: string;
Given('the API end point IF206 Ship Confirm', async function () {
    IF206ShipConfirmURL = this.ONPREMOSBURL + "/wuk/api/HighJumpOutboundTransaction/v1/outboundTransaction";
});

When('user update the payload with values captured from HJ DB', async function () {
    const seqID = await DateUtils.generateDateWithFormat('DDHHss');
    const transID = await DateUtils.generateDateWithFormat('MMDDHHss');
    const todayDate = await DateUtils.generateDateWithFormat('DDHHss');
    const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
    todayInterfaceDate = todayInterfaceDate + todayDate;
    let groupID = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111;

    // Get the Data from other JSON 
    const getTOContentFile = fs.readFileSync('src/data/TransferOrderData/GetTransferOrder.json', 'utf8');
    const getTOData = JSON.parse(getTOContentFile);

    changeField = {
        "seqId": seqID,
        "groupingId": Math.floor(Math.random() * (9999999 - 6666666 + 1)) + 6666666,
        "transactions": [{
            "transNumber": transID,
            "stagedDate": dateFormat,
            "startTranDateTime": dateFormat,
            "endTranDateTime": dateFormat,
            "controlNumber": getTOData[0].ORDER_NUMBER,
            "whId": getTOData[0].WH_ID,
            "huId": transID,
            "itemNumber": getTOData[0].ITEM_NUMBER,
            "tranQty": getTOData[0].QTY,
            "originalOrderQty": getTOData[0].QTY,
            "locationId2": groupID,
            "storeOrderNumber": getTOData[0].STORE_ORDER_NUMBER,
            "shipmentLineId": getTOData[0].ASSOC_CUST_PO_PRIOR
        },
        {
            "transNumber": (parseInt(transID) + 1).toString(),
            "stagedDate": dateFormat,
            "startTranDateTime": dateFormat,
            "endTranDateTime": dateFormat,
            "whId": getTOData[0].WH_ID,
            "locationId2": groupID
        }]
    }
});
let getIF206Response;
When('User send the post request', async function () {
    const headers = await HeaderBuilder.BuildMultipleHeaders({
        'Content-Type': APIConstants.CONTENT_TYPE_JSON
    }
    );
    const updatedTOJson = await JSONUtils.updateAllArraysJsonFields(path.resolve(process.cwd(), IF206jsonFilePath), "transactions", changeField);
    getIF206Response = await APIClient.post(this.ONPREMOSBURL, "/wuk/api/HighJumpOutboundTransaction/v1/outboundTransaction", JSON.parse(updatedTOJson), headers);
});

Then('User should have {int} response code successful', async function (int) {
    await Assert.assertEquals('200', getIF206Response.status.toString())
});
let getFulfillmentStatus: string;
let TONum: string;
let itemNum: string;
Then('Validate fulfillment status updated as {string}', async function (fulfillmentStatus) {
    const getTOInfoForQuery = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
    const getTODataFulStatus = JSON.parse(getTOInfoForQuery);
    TONum = getTODataFulStatus.transferOrderNumber;
    itemNum = getTODataFulStatus.itemNumber;
    console.log(TONum)
    await (await this.web.getElementByRoleByName('link', TONum)).waitFor({ state: 'visible', timeout: 140000 })
    let attempt = 0;
    while (attempt < 300) {
        attempt++;
        await (await this.web.getElementByRoleByName('link', TONum)).waitFor({ state: 'visible', timeout: 140000 })
        getFulfillmentStatus = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails("Fulfillment Status");
        if (getFulfillmentStatus === fulfillmentStatus) {
            break;
        }
        await this.scmTransferOrdersPage.SearchTransferOrder(TONum.trim());
        //    await this.scmTransferOrdersPage.SearchTransferOrder(documentNumber.trim());
        await this.scmTransferOrdersPage.ClickOnTransferOrderSearch();
        await new Promise(resolve => setTimeout(resolve, 60000));

    }
    await Assert.assertEquals(fulfillmentStatus, getFulfillmentStatus.trim())
});

When('User clicks on TO from search results', async function () {
    await this.scmTransferOrdersPage.clickOnTOLink(TONum);
});

Then('User should see the TO Page', async function () {
    let TOHeaderTitle = await this.scmTransferOrdersPage.isTransferOrderShipmentPageDisplayed(itemNum);
    console.log(TOHeaderTitle)
    await Assert.AssertTrue(TOHeaderTitle.includes(TONum))
});

When('User clicks on the product Link on TO search results Page', async function () {
    //    await this.scmTransferOrdersPage.clickOnItemLink(itemNum);
    await this.scmTransferOrdersPage.clickOnViewLinkUnderTOPage("Shipment and Receipt")
});

Then('User should see the Shipment and Receipt page and capture the Shipment ID', async function () {
    let shipmentID = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails("Shipment");
    await Assert.AssertTrue(shipmentID != '');

    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    data.shipmentNumber = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails("Shipment")
    fs.writeFileSync('src/data/TransferOrderData/CreateTransferOrder.json', JSON.stringify(
        data, null, 2));
});

When('User navigate to Inventory Execution', async function () {
    await this.scmHomePage.navigateToInventoryExecution();
});

When('User Clicks on {string}', async function (invExeOption) {
    await this.invExecutionPage.ClickOnInventoryExecutionOptions(invExeOption);
});

Then('User should see Receive Goods Page', async function () {
    await Assert.AssertTrue(await this.receiveGoodsPage.IsReceiveGoodsPageDisplayed())
});

When('User selects the Organization as {string}', async function (branch) {
    await this.receiveGoodsPage.SelectOrganizationDropdown(branch)
});

When('User clicks on Continue', async function () {
    await this.receiveGoodsPage.ClickOnContinueBtn();
});

Then('User Should see {string} dropdown', async function (string) {
    await Assert.AssertTrue(await this.receiveGoodsPage.IsOrderDropdownDisplayed())
});

When('User enter the TransferOrder Number under receive goods page', async function () {
    //add JSON Read to get the TO number
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    await this.receiveGoodsPage.EnterTransferOrderNumberInReceiveGoodsPage(data.transferOrderNumber);
});

When('User tabs out', async function () {
    await this.web.keyPress('Enter')
});

Then('User should see the Shipment block and validate quantity to receive', async function () {
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    for (let attempt = 0; attempt < 200; attempt++) {
        console.log('attempt ' + attempt)
        await new Promise(resolve => setTimeout(resolve, 10000));
        const visible = await this.receiveGoodsPage.IsShipmentCardDisplayed(data.shipmentNumber, data.itemQuantity);
        if (visible) { break; }
        else {
            await this.receiveGoodsPage.ClickOnContinueBtn();
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    await Assert.AssertTrue(await this.receiveGoodsPage.IsShipmentCardDisplayed(data.shipmentNumber, data.itemQuantity))
});

When('User Clicks on receive all', async function () {
    await this.receiveGoodsPage.ClickOnReceiveAll()
});

Then('User should see New Receipt page for shipment', async function () {
    await Assert.AssertTrue(await this.receiveGoodsPage.IsNewReceiptPageDisplayed())
});

When('User clicks on Submit', async function () {
    await this.receiveGoodsPage.ClickOnSubmitBtnReceiveGoods();
});

Then('User should see the receipt dialog', async function () {
    let getReceiptNumber = await this.receiveGoodsPage.CaptureReceiptID();
    let recNum = await StringUtils.getStringBetweenTwoStrings(getReceiptNumber, 'Receipt', 'created');
    await Assert.AssertTrue(getReceiptNumber != '')
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    data.receiptNumbers = recNum.trim()
    fs.writeFileSync('src/data/TransferOrderData/CreateTransferOrder.json', JSON.stringify(
        data, null, 2));
});

Then('User should see the Shipment and Receipt page and validate receipt Number', async function () {
    let receiptNumberFromReceiptPage = await this.scmTransferOrdersPage.getDataFromTransferOrderDetails("Receipt");
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    console.log(receiptNumberFromReceiptPage)
    fs.writeFileSync('src/data/TransferOrderData/CreateTransferOrder.json', JSON.stringify(
        data, null, 2));
    Assert.assertEquals(data.receiptNumbers, receiptNumberFromReceiptPage);
});


Then('User should see Put Away Goods Page', async function () {
    await Assert.AssertTrue(await this.putAwayGoodsPage.IsPutAwayGoodsPageDisplayed());
});

Then('User Should see {string} dropdown in Put Away Page', async function (string) {
    await Assert.AssertTrue(await this.putAwayGoodsPage.IsPutAwayDropDownDisplayed())
});

When('User enters the Receipt Number', async function () {
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    await this.putAwayGoodsPage.EnterReceiptNumber(data.receiptNumbers);
});

Then('User should see the Shipment block', async function () {
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    await Assert.AssertTrue(await this.putAwayGoodsPage.IsShipmentCardInPutAwayDisplayed(data.shipmentNumber))
});

When('User clicks on Put Away All button', async function () {
    await this.putAwayGoodsPage.ClickOnPutAwayAllBtn();
});

When('User clicks on Put Away', async function () {
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    let quantityInPutAway = await this.putAwayGoodsPage.GetQuantityFromPutAwaySection();
    await Assert.assertEquals(data.destinationOrgCode, await this.putAwayGoodsPage.GetBranchFromPutAwaySection());
    await Assert.AssertTrue(quantityInPutAway.toString().includes(data.itemQuantity));
    await this.putAwayGoodsPage.ClickOnPutAway();
});

Then('User should see text {string}', async function (string) {
    let getPutAwaySuccessText = await this.putAwayGoodsPage.CapturePutAwaySuccessMessage();
    Assert.assertEquals('Put away created', getPutAwaySuccessText.trim())
    await this.putAwayGoodsPage.ClosePutAwayDialog();
});

/*  Code to Create Customer Sales Order */
let CreateCustomerSalesOrderAPIURL: string;
Given('the API end point for Cutomer Sales Order API', async function () {
    CreateCustomerSalesOrderAPIURL = this.SCMURL + "/fscmRestApi/resources/11.13.18.05/salesOrdersForOrderHub";
});

let updatedCustSalesOrderJson: Record<string, any>;
let changeFieldSO: any;
When('user update the payload with SourceTransactionNumber,SourceTransactionID,{string},{string},{string}', async function (product, branch, quantity) {
    let data: any[] = [];
    if (fs.existsSync('src/data/TransferOrderData/GetTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/GetTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    const dateFormat = await DateUtils.generateDateWithFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
    changeFieldSO = {
        "SourceTransactionNumber": data[0].STORE_ORDER_NUMBER.toString().replace("/", "|"),
        "SourceTransactionId": data[0].STORE_ORDER_NUMBER.toString().replace("/", "|"),
        "lines": [{
            "RequestedFulfillmentOrganizationCode": branch,
            "ProductNumber": data[0].ITEM_NUMBER,
            "OrderedQuantity": parseInt(data[0].QTY),
            "RequestedArrivalDate": dateFormat
        }]
    }
});

let getCustomerSOResponse: any;
When('User send the post request to the endpoint for Customer Sales Order', async function () {
    const headers = await HeaderBuilder.BuildMultipleHeaders({
        'Content-Type': APIConstants.CONTENT_TYPE_JSON,
        'Accept': APIConstants.CONTENT_TYPE_TEXTXML
    }
    );
    const updatedCustSOJson = await JSONUtils.updateJsonFields(path.resolve(process.cwd(), jsonCustSOPathRead), "lines", changeFieldSO);
    const scmBasicAuthHeader = await HeaderBuilder.BuildBasicAuthHeader(this.SCMUSER, this.SCMPASSWORD);
    getCustomerSOResponse = await APIClient.post(this.SCMURL, "fscmRestApi/resources/11.13.18.05/salesOrdersForOrderHub", JSON.parse(updatedCustSOJson), scmBasicAuthHeader);
});

Then('User should have {int} response code', async function (int) {
    await Assert.assertEquals('201', getCustomerSOResponse.status.toString())
    getCustomerSONumber = (await JSONUtils.getJsonValueFromResponse(getCustomerSOResponse.data, 'OrderNumber'))
    fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrder.json', JSON.stringify({
        CustomerSONumber: getCustomerSONumber,
    }));
});


/* Steps for Pick Release Customer Sales Order */

When('User Select {string} from Quick Access', async function (objectTypeOption) {
    await this.inventoryManagamentPage.SelectObjectType(objectTypeOption)
});

When('User enter the TransferOrder Number under Shipment lines', async function () {
    let data: any = {};
    if (fs.existsSync('src/data/TransferOrderData/CreateTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/CreateTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    await this.inventoryManagamentPage.EnterDocumentNumberShipmentLines(data.transferOrderNumber)
});

let itemNumShipmentLines: any;
When('User enter the Customer Sales Order Number', async function () {
    let data: any[] = [];
    if (fs.existsSync('src/data/TransferOrderData/GetTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/GetTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    itemNumShipmentLines = data[0].ITEM_NUMBER;
    let custSalesOrderNumber = data[0].STORE_ORDER_NUMBER.toString().replace("/", "|")
    await this.shipmentLinePage.EnterCustomerSalesOrderNumber(custSalesOrderNumber);
});


Then('User Should see Shipment Lines Page with Line Status as Ready to release', async function () {
    await Assert.AssertTrue(this.shipmentLinePage.IsReadyRleaseStatusPageDisplayed())
});

When('User clicks on Pick Release from More Actions', async function () {
    await this.shipmentLinePage.ClickOnOptionsFromMoreActions('Pick Release')
});

Then('User should see the status as {string}', async function (lineStatus) {
    console.log(itemNumShipmentLines)
    console.log(await this.shipmentLinePage.GetShipmentLineStatus(itemNumShipmentLines, lineStatus));
});

/* Confirm Pick */

Then('User Should see Confirm Picks page', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.confirmPicksPage.IsConfirmPicksPageDisplayed())
});

When('User selects {string} from Advanced search', async function (this: ICustomWorld, optionToSelect) {
    await this.confirmPicksPage.SelectAdvanceSearch(optionToSelect)
});
let itemQuantity;
let sourceLocation;
When('User enters Customer Sales Order Number', async function (this: ICustomWorld) {
    let data: any[] = [];
    if (fs.existsSync('src/data/TransferOrderData/GetTransferOrder.json')) {
        const content = fs.readFileSync('src/data/TransferOrderData/GetTransferOrder.json', 'utf8');
        if (content.trim()) {
            data = JSON.parse(content);
        }
    }
    itemNumShipmentLines = data[0].ITEM_NUMBER;
    itemQuantity = data[0].QTY.toString();
    sourceLocation = data[0].ORDER_NUMBER.split('/')[0].toString()
    let custSalesOrderNumber = data[0].STORE_ORDER_NUMBER.toString().replace("/", "|")
    await this.confirmPicksPage.EnterCustomerSalesOrderNumberOnConfirmPicksPage(custSalesOrderNumber);
});

Then('User should see the tile contaning product information', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.confirmPicksPage.IsProuctTileDisplayed(itemNumShipmentLines))
    await Assert.assertContains((await this.confirmPicksPage.GetQuantityFromProductTileInPickingPane()).split(' ')[0].trim(),itemQuantity.trim())
    await Assert.assertContains((await this.confirmPicksPage.GetSourceLocationFromProductTileInPickingPane()).split(':')[1].trim(),sourceLocation.trim())
    await Assert.assertContains((await this.confirmPicksPage.GetDestinationLocationFromProductTileInPickingPane()).split(':')[1],sourceLocation.trim())
});

When('User selects the tile for pick confirm', async function (this: ICustomWorld) {
     await this.confirmPicksPage.ClickOnItemPanelUnderConfirmPicks(itemNumShipmentLines)
});

When('user enter subinventory code', async function () {
     
});

When('User enter Item Number', async function () {

});

When('User enters Picked Quantity', async function () {

});

When('Click on Confirm Pick and Close', async function () {

});