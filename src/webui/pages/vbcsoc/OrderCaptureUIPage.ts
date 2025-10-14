import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";
import StringUtils from "../../../utils/StringUtils";

let reportGeneration: ReportGeneration;
let ENTER_CUSTOMER: string = "input[placeholder='Search by Customer Name, Account Code or Postcode']";
let SELECT_CUSTOMER: string = "div[title='Select Customer...']";
// Customer UI New Changes
let ENTER_PRODUCT: string = "input[placeholder='Search by Product Code, Description, Supplier Part Code or Barcode']";
let CLICK_PRINT_CLOSE = "oj-button[title='Close']"
let PRINT_TEXT = ".oj-message-title"

setDefaultTimeout(60 * 10 * 1000);

export default class OrderCaptureUIPage {


    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async getIndexOfHeaderWithName(colname: string) {
        const getHeaderElements = this.web.getPage().locator("thead.oj-table-header th");
        let startIndex;
        for (let i = 0; i < await getHeaderElements.count(); i++) {
            const text = await getHeaderElements.nth(i).textContent();
            if (text.trim() == colname) {
                startIndex = i;
                break;
            }
        }
        return startIndex;
    }

    public async GetCustomerAccountStatusFromUI(statusToValidate: string) {
        const getAccountStatus = this.web.getPage().locator("div[title='" + statusToValidate + "']");
        return await getAccountStatus.textContent();
    }

    public async getColumnValueFromCustomerSelPanel(colname: string) {
        const getCustomerColValues = "tbody.oj-table-body tr td";
        return await this.web.getPage().locator(getCustomerColValues).nth(await this.getIndexOfHeaderWithName(colname)).innerText();
    }

    public async getCustomerSelectionValueFromUI(dataToMatch: string) {
        const  getAccStatusValueFromUI = "div[title='"+dataToMatch+"']";
        return  await this.web.getPage().locator(getAccStatusValueFromUI).textContent();
    }

    public async getCustomerAccountBalance(){
        const getAvailableBalanceFromUI = "oj-sp-scoreboard-metric-card[card-title='Available Balance'] div.oj-sp-scoreboard-metric-card-metric";
        return StringUtils.getStringAfterParticularStr ( (await this.web.getPage().locator(getAvailableBalanceFromUI).textContent()),'£');
    }


    public async SelectCustomer(customer: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").waitForElementToVisible(10)
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").clickWithTimeOut(5);
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        // New Changes
        const clickOnCustomerDrpDwn = this.web.getPage().locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: this.web.getPage().locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = this.web.getPage().locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = this.web.getPage().getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = this.web.getPage().locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }

    public async getCustomerAccountHeaderDetails(customer: string, colname: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").waitForElementToVisible(10)
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").clickWithTimeOut(5);
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        // New Changes
        const clickOnCustomerDrpDwn = this.web.getPage().locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: this.web.getPage().locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = this.web.getPage().locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        return await this.getColumnValueFromCustomerSelPanel(colname);
    }

    public async SaveCustomerSelection(customer: string) {
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = this.web.getPage().getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = this.web.getPage().locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }

    public async SelectProduct(product: string) {
        await this.web.element(ENTER_PRODUCT, 'Input for Product Info').setText(product);
        await expect(this.web.getPage().locator('span', { hasText: product }).nth(0)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await expect(await this.web.getPage().locator('span', { hasText: product }).nth(0)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After Entering Product " + product, world);
        (await this.web.getPage().locator('span', { hasText: product }).nth(0)).click({ timeout: 5000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Product " + product, world);
    }

    public async AddProductsToBasket(product: string) {
        await expect((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        ((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).click({ timeout: 5000 });
        await expect(await this.web.getPageLocator("button[aria-label='Clear All']")).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getPageLocator("button[aria-label='Clear All']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world);
    }

    public async IsProductAddedToBasket(product: string) {
        return await expect(await this.web.getElementByText(product)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async WaitForCheckOutPopUp() {
        //  await this.web.RetryElementFindingsByRole('button','Confirm','enable',2,TEST_CONFIG.TIMEOUTS.element);
        await expect(await this.web.getElementByRolebyExactText('button', 'Confirm')).toBeEnabled({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After clicking on Submit", world);
        return (await this.web.getElementByRolebyExactText('heading', 'Checkout')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async ClickOnConfirm(isPrintRequired: string) {
        if (isPrintRequired == "Yes") {
            (await this.web.getElementByRolebyExactText('button', 'Print')).click();
            await (await this.web.getPageLocator(PRINT_TEXT)).filter({ hasText: 'Printing picking note...' }).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
            await expect((await this.web.getPageLocator(PRINT_TEXT)).filter({ hasText: 'Printing picking note...' })).toBeVisible();
            await this.web.element(CLICK_PRINT_CLOSE, "Click on Print close").click();
            (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();
        } else {
            (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();
        }
    }

    public async CaptureOrderNumber() {
        await reportGeneration.getScreenshot(this.web.getPage(), "After Clicking on Confirm , Capture Order Number", world);
        return this.web.element('#oj_gop1_h_pageSubtitle', 'Capture the Order Number').getTextValue();
    }

    public async IsOrderConfirmationPageLoaded(orderConfHeading: string): Promise<boolean> {

        try {
            await this.web.getPage().waitForLoadState('domcontentloaded');
            const getOrderConfirmationHeadingEle = this.web.getPage().locator("text=" + orderConfHeading);
            await expect(getOrderConfirmationHeadingEle).toBeVisible();
            await reportGeneration.getScreenshot(this.web.getPage(), "Order Confirmation Page for Order Number - " + await this.CaptureOrderNumber(), world);
            return await (getOrderConfirmationHeadingEle).textContent() == orderConfHeading;
        } catch (error) {
            console.log(error)
        }
    }
}      