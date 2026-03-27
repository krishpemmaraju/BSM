import { expect, Locator, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_SEARCH_ICON = "button[aria-label='Search by item, description, or MPN']";
let WAIT_FOR_TABLE_DISPLAY = "th[title='Item']";
setDefaultTimeout(30000000);


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
        await new Promise(resolve => setTimeout(resolve, 2000));
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
        // (await this.web.getPageLocatorClick("div.oj-sp-collection-toolbar-panel oj-c-menu-button.oj-sp-collection-toolbar-primary-menu-button button[aria-label='More Actions']"));
        await reportGeneration.getScreenshot(this.web.getPage(), `CLICKING ON MORE ACTIONS`, world);
        await (await this.web.getPageLocator("oj-c-menu-button.oj-sp-collection-toolbar-primary-menu-button")).filter({ has: await this.web.getElementByRoleByName('button', 'More Actions') }).click()
        //await this.web.getPageLocatorClick("oj-c-menu-button[data-action-id='primary_action_group'] button[aria-label='More Actions']");
        await reportGeneration.getScreenshot(this.web.getPage(), `CLICKING ON MORE ACTIONS`, world);
        await this.web.getElementByRoleByNameClick('menuitem', optionToSelect);
        await reportGeneration.getScreenshot(this.web.getPage(), `CLICKING ON PICK RELEASE`, world);
        //await (await this.web.getElementByRolebyExactText('menuitem', optionToSelect)).click();
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

    public async GetShipmentLineStatusForKits(products: string[], colName: string, lineStatusMessage: string): Promise<boolean> {
        let count: number = 0;
        let isReleasedStatus: boolean | undefined;
        let attemptInt = 0;
        let getIndexOfColName = await (await this.web.getPage().locator("th[title*='" + colName + "']")).evaluate(el => (el as HTMLTableCellElement).cellIndex)

        for (const p of products) {
            const getProductLineStatus = await (await this.web.getPageLocator("//div[text()='" + p.trim() + "']//parent::td//parent::tr//td[" + (getIndexOfColName + 1) + "]")).textContent() ?? '';
            if (getProductLineStatus.trim() === lineStatusMessage) {
                isReleasedStatus = false;
            } else {
                isReleasedStatus = true;
            }
        }

        if (isReleasedStatus === false) { return true; }
        else {
            await this.ClickOnOptionsFromMoreActions('Pick Release');
            await new Promise(resolve => setTimeout(resolve, 5000));
            while (attemptInt < 400) {
                attemptInt++;
                for (const p of products) {
                    const getProductLineStatus = await (await this.web.getPageLocator("//div[text()='" + p.trim() + "']//parent::td//parent::tr//td[" + (getIndexOfColName + 1) + "]")).textContent() ?? '';
                    if (getProductLineStatus.trim() === lineStatusMessage) {
                        count = 0;
                    } else { count = 1 }

                }
                if (count === 0)
                    return true;
                await new Promise(resolve => setTimeout(resolve, 2000));
                (await this.web.getPageLocator("button[aria-label='Search by order number']")).click();
            }
        }
        return false;
    }


    public async GetShipmentIDForKits(products: string[], colName: string): Promise<string[]> {
        let count: number = 0;
        let getKitsShipmentID: string[] = [];
        let getIndexOfColName = await (await this.web.getPage().locator("th[title*='" + colName + "']")).evaluate(el => (el as HTMLTableCellElement).cellIndex)
        for (const p of products) {
            console.log('the product is ' + p)
            const getProductShipmentLineID = await (await this.web.getPageLocator("//div[text()='" + p.trim() + "']//parent::td//parent::tr//td[" + (getIndexOfColName + 1) + "]")).textContent() ?? '';
            getKitsShipmentID.push(getProductShipmentLineID?.trim())
        }
        console.log(getKitsShipmentID)
        return getKitsShipmentID;
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


    public async IsShippedQuantityUpdatedAfterShipping(products: string[], originalQty: string, colName: string) {
        let getIndexOfColName = await this.GetLineStatusColIndex(colName)
        let count = 0;
        for (const p of products) {
            let getShippedQtyOfProduct = await (await this.web.getPageLocator("//div[text()='" + p.trim() + "']//parent::td//parent::tr//td[" + (getIndexOfColName + 1) + "]")).textContent() ?? ''
            if (getShippedQtyOfProduct.trim() === originalQty.trim()) {
                count = 1
            }
        }
        return count === 1;
    }
}