import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";
import StringUtils from "../../../utils/StringUtils";
import OrderCaptureUIPage from "../vbcsoc/OrderCaptureUIPage";
import DateUtils from "../../../utils/DateUtils";
import { TIMEOUT } from "dns";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let FRAME_LOCATOR_TEXT = 'iframe[src*="wol-order-capture/live"]';

setDefaultTimeout(3000000);

export default class CreateOrderPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsCreateOrderPageDisplayed(): Promise<boolean> {
        return await (await this.web.getElementByRoleByName('heading', 'Create Order')).isVisible({ timeout: 15000 })
    }

    public async GetIndexOfColumnHeader(colHeader: string): Promise<string> {
        return await (this.web.getPage().locator("table[summary='This table contains column headers corresponding to the data body table below'] tr th span", { hasText: colHeader }).
            filter({ hasText: new RegExp(`^${colHeader}$`) }).locator('xpath=ancestor::th')).getAttribute('_d_index');
    }

    public async SelectCustomerSCMOM(customer: string) {
        let splitCustomer = customer.split(",");
        await (await this.web.getPageLocator('a[title="Search: Customer"]')).click();
        await (await this.web.getElementByRoleByName('link', 'Search...')).click();
        await (await this.web.getElementByText('Search and Select: Customer')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator("input[aria-label*='Name']")).fill(splitCustomer[0]);
        await (await this.web.getPageLocator("input[aria-label*='Registry ID']")).fill(splitCustomer[1]);
        await (await this.web.getElementByRoleByName('button', 'Search')).click();
        await (await this.web.getPageLocator(".AFPopupSelector button[_afrpdo='ok']")).click();
        await expect((await this.web.getElementByRoleByName('heading', 'Order Lines'))).toBeEnabled({ timeout: 19000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING CUSTOMER " + customer, world);
    }

    public async SelectOrderType(orderType: string) {
        await (await this.web.getPageLocator('a[title="Search: Order Type"]')).click();
        await (await this.web.getElementByRoleByName('link', 'Search...')).click();
        await (await this.web.getElementByText('Search and Select: Order Type')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator("input[aria-label=' Order Type']")).fill(orderType);
        await (await this.web.getElementByRoleByName('button', 'Search')).click();
        await (await this.web.getPageLocator("div.AFPopupSelector table td:nth-child(" + await this.GetIndexOfColumnHeader('Order Type') + ") span.x2ey")).first().click();
        await (await this.web.getPageLocator('div.AFPopupSelector button[_afrpdo="ok"]')).click();
    }

    public async SelectProductSCMOM(product: string) {
        await (await this.web.getPageLocator("a[title='Search: ItemNumber']")).click();
        await expect(await this.web.getElementByText('Search and Select: Item')).toBeVisible({ timeout: 3000 })
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON SEARCH ITEM ICON ", world);
        await (await this.web.getPageLocator("input[aria-label=' Item']")).fill(product.trim())
        await (await this.web.getElementByRoleByName('button', 'Search')).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "SEARCH RESULTS FOR THE PRODUCT " + product, world);
        await (await this.web.getElementByText(product.trim())).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getElementByText(product.trim())).click({ timeout: 7000 });
        await (await this.web.getPageLocator("div.AFPopupSelector button[accesskey='K']")).click()
        await expect((await this.web.getElementByRoleByName('button', 'Add'))).toBeVisible({ timeout: 9000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "PRODUCT ADDED TO THE LINE FOR PRODUCT " + product, world);
        await this.ClickOnAddButtonOnOrderLineSCMOM();
    }

    public async ClickOnAddButtonOnOrderLineSCMOM() {
        await ((await this.web.getElementByRoleByName('button', 'Add'))).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "PRODUCT ADDED TO THE LINE ", world);
    }

    public async ClickOnShipmentDetailsOrderLineSCMOM() {
        await ((await this.web.getPageLocator('div[title="Shipment Details"] a'))).scrollIntoViewIfNeeded();
        await (await this.web.getPageLocator('div[title="Shipment Details"] a')).click({ delay: 3000, force: true });
        await expect((await this.web.getElementByRoleByName('heading', 'Shipment Details'))).toBeVisible({ timeout: 9000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON SHIPMENT ORDER DETAILS ", world);
    }

    public async IsShipmentDetailsSectionSCMOM(): Promise<boolean> {
        return await (await this.web.getElementByRoleByName('heading', 'Shipment Details')).isVisible({ timeout: 6000 });
    }

    public async NavigateToSupplyUnderShipmentDetailsSCMOM() {
        await (await this.web.getPageLocator("div.x1gd a.xod:has-text('Supply')")).first().click();
    }

    public async SelectWarehouseSupplyUnderShipmentDetailsSCMOM(location: string) {
        await (await this.web.getPageLocator('a[title="Search: Warehouse"]')).click();
        await (await this.web.getElementByRoleByName('link', 'Search...')).click();
        await (await this.web.getElementByText('Search and Select: Warehouse')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator("input[aria-label=' Warehouse']")).fill(location.trim())
        await (await this.web.getElementByRoleByName('button', 'Search')).click();
        await (await this.web.getPageLocator('.x2ey')).filter({ has: this.web.getPage().locator("text='" + location.trim() + "'") }).click();
        await (await this.web.getPageLocator(".AFPopupSelector button[_afrpdo='ok']")).click();
    }

    public async ClickOnSubmitButtonSCMOM() {
        await (await this.web.getElementByRoleByName('button', 'Submit')).click()
    }

    public async IsConfirmationPopAvailableSCMOM() {
        await (await this.web.getElementByText("Confirmation")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getElementByText("Confirmation")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async ClickOkOnSOConfirmationPopUpSCMOM() {
        await (await this.web.getPageLocator("button[title='OK']")).click();
    }

    public async GetSalesOrderNumberSCMOM() {
        let SOStr = await (this.web.getPage().getByText('Sales order')).textContent();
        console.log(await StringUtils.getStringBetweenTwoStrings(SOStr, "Sales order ", " was"));
    }

    public async GetStringMatchNumbers() {
        let SOStr = await (this.web.getPage().getByText('Sales order')).textContent();
        let match = SOStr.match(/\d+/);
        if (match) {
            const orderNumber = match[0]
            console.log(orderNumber)
        }
    }

    public async ClickOnRefreshSCMOM() {
        await (await this.web.getElementByRoleByName('button', 'Refresh')).click({ delay: 2000 });
    }

    public async GetOrderStatusSCMOM() {
        await (await this.web.getElementByRoleByName('button', 'Refresh')).click({ delay: 2000 });
        const columnIndex = parseInt(await this.GetIndexOfColumnHeader('Status'));
        const getTDStatus = (await this.web.getPageLocator("//table[@summary='Order Lines']//tr//table[@_afrit]//tr//td[@class='xen'][" + columnIndex + "]")).textContent();
        return await getTDStatus;
    }

    public async ClickOnCreateRevisionUnderSCMOM() {
        await (await this.web.getElementByRoleByName('link', 'Actions')).click();
        await (await this.web.getElementByText('Create Revision')).click();
        await (await this.web.getPageLocator("div[title*='Create Order Revision']")).waitFor({ state: 'visible', timeout: 9000 });
    }

    public async ClickOnOverrideOrderLineActionsSCMOM() {
        await (await this.web.getPageLocator("table[summary='Search Results'] tr[_afrrk] button[title='Actions']")).click();
    }

    public async IsOverrideOrderLineVisible(): Promise<boolean> {
        return await ((await this.web.getElementByText('Override Order Line')).isVisible({ timeout: 5000 }));
    }

    public async ClickOnOverrideOrderLineSCMOM() {
        await (await this.web.getElementByText('Override Order Line')).click();
    }

    public async GetRequestedDateSCMOM(): Promise<string> {
        return await (await this.web.getPageLocator("td:has(> label:has-text('Ordered Date')) + td span")).textContent()
    }

    public async ChangeOrderRequestDateSCMOM(dateToUpdate: string) {
        // let GetSelectedDate = await (await this.web.getPageLocator
        // ("//td[@id='pt1:_FOr1:1:_FONSr2:0:_FOTsr1:3:APRS1:r5:0:id4::pop::dlg::contentContainer']//td[@class='x12k p_AFSelected']")).textContent();
        let getDatesSplitArray = dateToUpdate.split(' ');
        let getRequestDate = getDatesSplitArray[0].split('/');
        await (await this.web.getPageLocator('a[title="Select Date and Time"]')).first().scrollIntoViewIfNeeded();
        await (await this.web.getPageLocator('a[title="Select Date and Time"]')).first().click({ delay: 3000 });
        await (await this.web.getPageLocator('[id*="id4::pop::dlg::tb"]')).waitFor({ state: 'attached', timeout: 8000 });
        let getDayVal = parseInt(getRequestDate[0]);
        let getSumDays = getDayVal + 10;
        if ((getSumDays) <= 31) {
            await (await this.web.getElementByText(getSumDays.toString())).first().click();
        } else {
            getSumDays = getSumDays - 10;
            await (await this.web.getElementByText(getSumDays.toString())).first().click();
        }
        const okButton = this.web.getPage().locator("div.AFPopupSelector button[_afrpdo='ok']");

        // Wait for the dialog to appear
        await okButton.waitFor({ state: 'visible', timeout: 10000 });

        // Optional: wait for any transition or animation to complete
        await this.web.getPage().waitForTimeout(500);

        // Wait for the OK button to become visible
        await okButton.waitFor({ state: 'visible', timeout: 10000 });

        // Click the OK button
        await okButton.click();

        // await (await this.web.getPageLocator('[id*="pop::dlg::ok"]')).first().waitFor({ timeout: 9000 })
        // await expect((await this.web.getPageLocator('[id*="pop::dlg::ok"]')).first()).toBeVisible({ timeout: 9000 });
        // await (await this.web.getPageLocator('[id*="pop::dlg::ok"]')).first().click({ force: true, delay: 6000 });
        (await this.web.getPageLocator("div.AFPopupSelector")).waitFor({ state: 'visible', timeout: 15000 });
    }


    public async ClickOnButtonWithAccessKeySCMOM() {
        (await this.web.getPageLocator("div.AFPopupSelector button[accesskey='K']")).click({ delay: 2000 });
    }

    public async GetConfirmationTextAfterReqDateChangeSCMOM(): Promise<boolean> {
        await expect((await this.web.getElementByText('Your revised order was accepted and is being processed.'))).toBeVisible({ timeout: 15000 });
        return await (await this.web.getElementByText('Your revised order was accepted and is being processed.')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async GetRequestDateAfterChangeSCMOM(): Promise<string> {
        await (await this.web.getElementByRoleByName('button', 'Refresh')).click({ delay: 2000 });
        let getColIndexOfDate = await this.GetIndexOfColumnHeader('Requested Date');
        let getChangedrequestedDate = await (await this.web.getPageLocator("(//table[@summary='Search Results']//tr[@_afrrk]//td//span[@class='x2ey'])[" + getColIndexOfDate + "]")).textContent();
        return getChangedrequestedDate;
    }
}
