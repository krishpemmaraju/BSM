import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { get } from "http";

setDefaultTimeout(3000000)
let reportGeneration: ReportGeneration;
export default class SCMTransferOrdersPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }


    public async IsTransferOrdersPageDisplayed(): Promise<boolean> {
        await (await this.web.getElementByRoleByName('heading', 'Transfer Orders')).waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), 'TRANSFER ORDER PAGE', world)
        return await (await this.web.getElementByRoleByName('heading', 'Transfer Orders')).isVisible();
    }

    public async ClickOnTOScheduled(scheduledOption: string) {
        await (await this.web.getElementByText(scheduledOption)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getElementByText(scheduledOption)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), 'SELECT TO SCHEDULED AS ' + scheduledOption, world)
    }

    public async SearchTransferOrder(transferOrder: string) {
        await (await this.web.getPageLocator("input[aria-label='Search by transfer order']")).fill(transferOrder.trim());
        await reportGeneration.getScreenshot(this.web.getPage(), 'AFTER ENTERING TO NUMBER  ' + transferOrder, world)
    }

    public async ClickOnTransferOrderSearch() {
        await (await this.web.getPageLocator("button[aria-label='Search by transfer order']")).click();
    }

    public async IsTransferOrderDisplayedInSearchResults(): Promise<boolean> {
        await reportGeneration.getScreenshot(this.web.getPage(), 'SEARCH RESULTS FOR THE TO SEARCHED ', world)
        return await (await this.web.getPageLocator("th[title='Transfer Order']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async getDataFromTransferOrderDetails(colHeader: string): Promise<string> {
        const getCellIndexForColHeader = await this.web.getPage().locator(`th[title="${colHeader}"]`).evaluate(el => Array.from(el.parentNode.children).indexOf(el));
        return (await (await this.web.getPageLocator("tr.oj-table-body-row td:nth-child(" + (getCellIndexForColHeader + 1) + ")")).textContent()??'').trim();
    }

    public async clickOnTOLink(toNumber: string) {
        await (await this.web.getElementByRolebyExactText('link', toNumber)).click()
    }

    public async clickOnViewLinkUnderTOPage(viewColName: string) {
        let getIndexOfColName = await (await this.web.getPage().locator('th[title*="Shipment and Receipt"]')).evaluate(el => (el as HTMLTableCellElement).cellIndex)
        await ((await this.web.getPageLocator("tr.oj-table-body-row td:nth-child("+(getIndexOfColName+1)+") a")).filter({hasText : 'View'})).click()
    }

    public async isTransferOrderShipmentPageDisplayed(itemNum: string) {
        await (await this.web.getElementByText(itemNum)).waitFor({ state: 'visible', timeout: 40000 })
        await reportGeneration.getScreenshot(this.web.getPage(), 'TRANSFER ORDER PAGE DISPLAYED ', world)
        return (await (await this.web.getPageLocator('h1.oj-sp-header-general-overview-page-title')).textContent()??'').trim()
    }

    public async clickOnItemLink(itemNumber: string) {
        await (await this.web.getElementByRolebyExactText('link', itemNumber)).click()
    }
}