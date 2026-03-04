import { expect, Locator, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_SEARCH_ICON = "button[aria-label='Search by item, description, or MPN']";
let WAIT_FOR_TABLE_DISPLAY = "th[title='Item']";
setDefaultTimeout(3000000);


export default class ShipmentLinesPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async EnterCustomerSalesOrderNumber(customerSalesOrder: string) {
        await (await this.web.getElementByRolebyExactText('heading', 'Shipment Lines')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (await (await this.web.getPageLocator("div.oj-flex-item button[aria-label*='Clear']")).isVisible({ timeout: 8000 })) {
            await (await this.web.getPageLocator("div.oj-flex-item button[aria-label*='Clear']")).click();
        }
        await (await this.web.getElementByPlaceholder('Search by order number')).fill(customerSalesOrder)
        await (await this.web.getPageLocator("button[aria-label='Search by order number']")).click()
        await reportGeneration.getScreenshot(this.web.getPage(), `SEARCH RESULTS FOR CUSTOMER SALES ORDER NUMBER ${customerSalesOrder}`, world);
        await (await this.web.getPageLocator("th[title='Line Status']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async IsReadyRleaseStatusPageDisplayed() {
        await (await this.web.getElementByText('Ready to release')).waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getElementByText('Ready to release')).isVisible()
    }

    public async IsInterfacedDisplayed() {
        await (await this.web.getElementByText('Interfaced')).waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getElementByText('Interfaced')).isVisible()
    }

    public async ClickOnOptionsFromMoreActions(optionToSelect: string) {
        await (await this.web.getPageLocator("thead.oj-table-header tr.oj-table-header-row th[id='manage-shipment-lines-search-table_table:selectAll'] input[aria-label='Select All Rows']")).click();
        await (await this.web.getPageLocator("div.oj-sp-collection-toolbar-panel oj-c-menu-button.oj-sp-collection-toolbar-primary-menu-button button[aria-label='More Actions']")).click()
        await (await this.web.getElementByRolebyExactText('menuitem', optionToSelect)).click();
    }

    public async GetDataFromShipmentLinesPage(colName: string) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        let getIndexOfColName = await (await this.web.getPage().locator("th[title*='" + colName + "']")).evaluate(el => (el as HTMLTableCellElement).cellIndex)
        return await ((await this.web.getPageLocator("tr.oj-table-body-row td:nth-child(" + (getIndexOfColName + 1) + ")"))).textContent();
    }

    public async GetLineStatusColIndex(colName: string) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        let getIndexOfColName = await (await this.web.getPage().locator("th[title*='" + colName + "']")).evaluate(el => (el as HTMLTableCellElement).cellIndex)
        return getIndexOfColName;
    }

    public async GetShipmentLineStatus(itemNumber: string, lineStatus: string) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        let getLineStatus = await this.GetDataFromShipmentLinesPage('Line Status');
        let attemptInt = 0;
        while (attemptInt < 400) {
            attemptInt++;
            console.log('coming  here ' + attemptInt)
            await (await this.web.getElementByText(itemNumber.toString())).waitFor({ state: 'visible', timeout: 140000 })
            getLineStatus = await this.GetDataFromShipmentLinesPage('Line Status');
            if (getLineStatus && getLineStatus.trim() === lineStatus) {
                return true;
            }
            (await this.web.getPageLocator("button[aria-label='Search by order number']")).click();
            await new Promise(resolve => setTimeout(resolve, 14000));
        }
        return false;
    }

    public async GetShipmentNumber(shipmentColName: string) {
        let getShipmentNumber = await this.GetDataFromShipmentLinesPage(shipmentColName);
        return (getShipmentNumber ?? '').trim();
    }

    public async IsShipmentLinesVisibleForMultiLineCustSO(product1: string, product2: string): Promise<boolean> {
        let isProduct1ShipmentLineVisible = await (await this.web.getElementByText(product1.trim())).isVisible({ timeout: 9000 })
        let isProduct2ShipmentLineVisible = await (await this.web.getElementByText(product2.trim())).isVisible({ timeout: 9000 })
        console.log(isProduct1ShipmentLineVisible + ' ----' + isProduct2ShipmentLineVisible)
        return (isProduct1ShipmentLineVisible && isProduct2ShipmentLineVisible)
    }

    public async GetShipmentLineStatusForProducts(colName: string, expectedLineStatus: string, product1: string, product2: string): Promise<boolean> {
        let getLineStatusIndex = await this.GetLineStatusColIndex(colName);
        let attemptInt = 0;
        while (attemptInt < 400) {
            attemptInt++;
            await (await this.web.getElementByText(product1.toString())).waitFor({ state: 'visible', timeout: 140000 })
            await (await this.web.getElementByText(product2.toString())).waitFor({ state: 'visible', timeout: 140000 })
            let getProduct1LineStatus = await (await this.web.getPageLocator("tr:has(td div:has-text('" + product1 + "')) >> td:nth-child(" + (getLineStatusIndex + 1) + ")")).textContent() ?? ''
            let getProduct2LineStatus = await (await this.web.getPageLocator("tr:has(td div:has-text('" + product2 + "')) >> td:nth-child(" + (getLineStatusIndex + 1) + ")")).textContent() ?? ''
            if (getProduct1LineStatus.trim() === expectedLineStatus && getProduct2LineStatus.trim() === expectedLineStatus) {
                return true;
            }
            (await this.web.getPageLocator("button[aria-label='Search by order number']")).click();
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        return false;
    }


    public async GetShipmentIDForMultiProducts(colName: string, product1: string, product2: string): Promise<string> {
        let getLineStatusIndex = await this.GetLineStatusColIndex(colName);
        let getProduct1ShipmentLineID = await (await this.web.getPageLocator("tr:has(td div:has-text('" + product1 + "')) >> td:nth-child(" + (getLineStatusIndex + 1) + ")")).textContent() ?? ''
        let getProduct2ShipmentLineID = await (await this.web.getPageLocator("tr:has(td div:has-text('" + product2 + "')) >> td:nth-child(" + (getLineStatusIndex + 1) + ")")).textContent() ?? ''
        if (getProduct1ShipmentLineID.trim() === getProduct2ShipmentLineID.trim())
            return getProduct1ShipmentLineID.trim();
        else return getProduct1ShipmentLineID.trim() + "-" + getProduct2ShipmentLineID.trim()
    }
}