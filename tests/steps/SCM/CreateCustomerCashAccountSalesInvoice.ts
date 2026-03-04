
import { Given, setDefaultTimeout, Then, When } from "@cucumber/cucumber";
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
import DBConnection from "../../../src/db/DBConnection";

setDefaultTimeout(300000);

When('User navigate to Tools', async function (this: ICustomWorld) {
    await this.scmHomePage.navigateToTools();
});

When('User Clicks on Scheduled Processes', async function (this: ICustomWorld) {
    await this.scmHomePage.ClickOnScheduledProcesses();
});

Then('User should see Scheduled processes page', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.scheduledProcesses.isScheduledProcessesPageDisplayed())
});

When('User Clicks on Schedule New Processes', async function (this: ICustomWorld) {
    await this.scheduledProcesses.ClickOnScheduleNewProcesses();
});

Then('User should see Shcedule New Process page', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.scheduledProcesses.isScheduleNewProcessPopUpDisplayed())
});

When('User search for the job {string}', async function (this: ICustomWorld, jobName) {
    await this.scheduledProcesses.SearchForJobName(jobName)
});

Then('User should see Process details', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.scheduledProcesses.isProcessDetailsPoPUpDisplayed())
});

When('User fill the details {string}', async function (this: ICustomWorld, subinventory) {
    await this.scheduledProcesses.FillProcessDetails(subinventory);
});

When('User clicks on submit', async function (this: ICustomWorld) {
    await this.scheduledProcesses.ClickOnSubmit();
});

Then('Capture the processID', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.scheduledProcesses.IsProcessDetailConfirmationPopUpDisplayed())
    sharedData.processIDForBSMInvoice = await this.scheduledProcesses.CaptureProcessID();
});

When('User search for the process', async function (this: ICustomWorld) {
    await this.scheduledProcesses.SearchForProcessID(sharedData.processIDForBSMInvoice.trim())
});

Then('User should see the status as succeeded', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.scheduledProcesses.IsStatusOfProcessIDSuccess('status'));
});

Given('User login into MFT application', async function (this: ICustomWorld) {
    await this.mftActionsPage.LoginIntoMFT(this.MFTURL, this.MFTUSER, this.MFTPASSWORD)
});

When('User click on Navigate', async function (this: ICustomWorld) {
    await this.mftActionsPage.ClickOnNavigate()
});
let folderPath: string;
When('User enter {string}', async function (this: ICustomWorld, navigationPath) {
    folderPath = navigationPath;
    await this.mftActionsPage.EnterMFTNavigationFolder(navigationPath)
});

Then('User should see the file {string} under the path', async function (this: ICustomWorld, filename) {
    await Assert.AssertTrue(await this.mftActionsPage.IsFileNameProcessed(folderPath))
});

//DB Updates
let connectionODS: any = null;
let results: any;
Given('user login into ODS', async function () {
    console.log(this.ODSUSER + '' + this.ODSPASSWORD + '' + this.ODSURL)
    connectionODS = await new DBConnection().connectToDB('ODS', this.ODSUSER, this.ODSPASSWORD, this.ODSURL);
});

When('User run the query to validate invoice transactions', async function () {
    let getQueryForKoerber = `select ORDER_NUMBER,SHIPMENTNUMBER,ITEM_NUMBER,SHIPMENTLINEID,REQUESTEDQTY,SHIPPED_QTY,INVOICE_INTERFACED_FLAG,ORDER_CREATION_DATE,ACTUAL_SHIP_DATE
     from dw_ext_saas.saas_bsm_invoice_lines where  ORDER_NUMBER = '${sharedData.CUSTOMERSALESORDERNUMBER}'`;
    results = await new DBConnection().attemptQueryForResults(connectionODS, 400, getQueryForKoerber, 30000)
});

Then('User should see the results with the order results', async function () {
    let getTOData: any[] = [];
    for (let data of results.rows) {
        let rowObj: any = {}
        for (let key in data) {
            rowObj[key] = data[key]
            if (key === 'INVOICE_INTERFACED_FLAG') {
                sharedData.ODSCustomerOrderInvoiceFlag = data[key]
            } if (key === 'SHIPPED_QTY') {
                sharedData.ODSCustomerOrderShippedQTY = data[key]
            }
        }
        getTOData.push(rowObj)
    }
    fs.writeFileSync('src/data/TransferOrderData/ODSCustomerSalesOrderData.json', JSON.stringify(
        getTOData, null, 2));
    await Assert.AssertTrue(sharedData.ODSCustomerOrderInvoiceFlag === 'Y')
    await Assert.AssertTrue(sharedData.ODSCustomerOrderShippedQTY === sharedData.quantity)
});
