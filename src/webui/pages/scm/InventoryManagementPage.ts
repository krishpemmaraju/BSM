import { expect, Locator, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_SEARCH_ICON = "button[aria-label='Search by item, description, or MPN']";
let WAIT_FOR_TABLE_DISPLAY = "th[title='Item']";
//setDefaultTimeout(3000000);



export default class InventoryManagementPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async getInventoryManagmentDashboardHeader() {
        return await (await this.web.getElementByRolebyExactText('heading', 'Inventory Management')).textContent();
    }

    public async selectSubInventoryBranch(branchSel: string) {
        const getSubInventory = this.web.getPage().locator("h1[data-switcher-header-id='dataSwitcherheader']");
        if (!((await getSubInventory.textContent() ?? '').includes(branchSel))) {
            (await this.web.getPageLocator('.oj-sp-header-general-overview-title h1.oj-sp-data-switcher-title')).click();
            (await this.web.getPageLocator("input[placeholder='Search'][aria-label='Search']")).waitFor({ state: 'visible', timeout: 8000 });
            (await this.web.getPageLocator("input[placeholder='Search'][aria-label='Search']")).fill(branchSel);
            (await this.web.getPageLocator(".oj-listview-cell-element span[title*='" + branchSel + "']")).click({ timeout: 4000 });
        }
    }

    public async ClickOnItemQuantities() {
        try {
            await expect(await this.web.getElementByRolebyExactText('link', 'Item Quantities')).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
        }
        catch (err) {
            await this.web.getPage().reload();
            await expect(await this.web.getElementByRolebyExactText('link', 'Item Quantities')).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
        }
        await (await this.web.getElementByRolebyExactText('link', 'Item Quantities')).click();
        await (await this.web.getElementByRolebyHasText('heading', "Item Quantities")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await this.web.element(WAIT_FOR_TABLE_DISPLAY, "Wait for table result to display").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await reportGeneration.getScreenshot(this.web.getPage(), "ITEM QUANTITES PAGE LANDED", world);
    }

    public async SearchProductExistingStock(product: string) {
        await (await this.web.getElementRoleByText('placeholder', 'Search by item, description, or MPN')).fill(product);
        await this.web.element(CLICK_ON_SEARCH_ICON, "Click on Search Icon").click();
        await this.web.element(WAIT_FOR_TABLE_DISPLAY, "Wait for table result to display").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await (await this.web.getElementRoleByText('text', product)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "EXISTING STOCK FOR THE PRODUCT " + product, world);

    }

    public async GetExistingSOH(colName: string) {
        const num1: number = Number(await this.GetColIndexUsingTHColName(colName));
        await this.web.element("table tbody tr td:nth-child(" + (num1) + ")", "table th nth row").waitForElementToVisible(90);
        await (expect(this.web.element("table tbody tr td:nth-child(" + (num1) + ")", "table th nth row").getLocator()).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element }));
        const getOnHandStock = await this.web.element("table tbody tr td:nth-child(" + (num1) + ")", "table th nth row").getTextValue();
        return getOnHandStock;
    }

    public async GetColIndexUsingTHColName(colName: string) {
        const elements: Locator = this.web.getPage().locator('table tr th');
        await elements.first().waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element });
        let getCount: number = 0;
        for (var i = 0; i < await elements.count(); i++) {
            getCount++;
            const eleVal = elements.nth(i);
            eleVal.waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element })
            if (await eleVal.getAttribute("abbr") == colName) {
                break;
            }
        }
        return getCount;
    }

    public async ClickOnViewAllActions() {
        await (await this.web.getPageLocator("a[title='View all actions']")).waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getPageLocator("a[title='View all actions']")).click();
    }

    public async SelectObjectType(objectTypeOption: string) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await (await this.web.getElementByLabel('Object Type')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getElementByLabel('Object Type')).click({ force: true })
        await (await this.web.getElementByText(objectTypeOption)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getElementByText(objectTypeOption)).click()
    }

    public async EnterDocumentNumberShipmentLines(transferOrderNumber: string) {
        await (await this.web.getElementByPlaceholder('Search by order number')).waitFor({ state: 'visible', timeout: 9000 })
        await (await this.web.getElementByPlaceholder('Search by order number')).fill(transferOrderNumber)
    }

}