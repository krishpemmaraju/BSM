
import { expect, Frame, FrameLocator, TestInfo } from "playwright/test";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import StringUtils from "../../../utils/StringUtils";

setDefaultTimeout(300000)

let reportGeneration: ReportGeneration;
export default class OrderCaptureUISCMPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async getIndexOfHeaderWithName(colname: string): Promise<number> {
        const getHeaderElements = this.web.getPage().locator("thead.oj-table-header th");
        let startIndex: number | undefined;
        for (let i = 0; i < await getHeaderElements.count(); i++) {
            const text = await getHeaderElements.nth(i).textContent();
            if (text ?? ''.trim() == colname) {
                return i;
            }
        }
        return -1;
    }

    public async getColumnValueFromCustomerSelPanel(frameObject: Frame, colname: string) {
        const getCustomerColValues = "tbody.oj-table-body tr td";
        return await frameObject.locator(getCustomerColValues).nth((await this.getIndexOfHeaderWithName(colname))).innerText();
    }

    public async SelectCustomer(frameObject: Frame, customer: string) {
        await frameObject.locator("div[title='Select Customer...']").waitFor({ state: 'visible', timeout: 30000 });
        await frameObject.locator("div[title='Select Customer...']").click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        const clickOnCustomerDrpDwn = frameObject.locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: this.web.getPage().locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = frameObject.locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = frameObject.locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = frameObject.getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = frameObject.locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }


    public async getCustomerAccountHeaderDetails(frameObject: Frame, customer: string, colname: string) {
        await frameObject.locator("div[title='Select Customer...']").waitFor({ state: 'visible', timeout: 30000 });
        await frameObject.locator("div[title='Select Customer...']").click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        // New Changes
        const clickOnCustomerDrpDwn = frameObject.locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: frameObject.locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = frameObject.locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = frameObject.locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        return await this.getColumnValueFromCustomerSelPanel(frameObject, colname);
    }

    public async SaveCustomerSelection(frameObject: Frame, customer: string) {
        const customerSearchResultsAvailable = frameObject.locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = frameObject.getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();

        const clickOnSaveOnSelectCusomter = frameObject.locator("button[aria-label='Save']");
        // await frameObject.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await frameObject.evaluate(() => {
            const btn = document.querySelector("button[aria-label='Save']") as HTMLElement
            btn?.click();
        });

        await expect(clickOnSaveOnSelectCusomter).toBeEnabled({ timeout: 6000 });
        await clickOnSaveOnSelectCusomter.click({ force: true });
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }

    public async GetCustomerAccountStatusFromUI(frameObject: Frame, statusToValidate: string) {
        const getAccountStatus = frameObject.locator("div[title='" + statusToValidate + "']");
        return await getAccountStatus.textContent();
    }


    public async getCustomerAccountBalance(frameObject: Frame) {
        const getAvailableBalanceFromUI = "oj-sp-scoreboard-metric-card[card-title='Available Balance'] div.oj-sp-scoreboard-metric-card-metric";
        return StringUtils.getStringAfterParticularStr((await frameObject.locator(getAvailableBalanceFromUI).textContent() ?? ''), '£');
    }


}
