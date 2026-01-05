import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TestInfo } from "@playwright/test";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;

//setDefaultTimeout(1200000);
setDefaultTimeout(300000);
let getHeadingPageText: string;
let shipmentNumberData: string;
let receiptNumberData: string;

export default class PutAwayGoodsPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsPutAwayGoodsPageDisplayed() {
        await (await this.web.getElementByRolebyExactText('heading', 'Put Away Goods')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        getHeadingPageText = await (await this.web.getElementByRolebyExactText('heading', 'Put Away Goods')).textContent()
        await reportGeneration.getScreenshot(this.web.getPage(), "PUT AWAY GOODS PAGE DISPLAYED ", world);
        return await (await this.web.getElementByRolebyExactText('heading', getHeadingPageText)).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async IsPutAwayDropDownDisplayed() {
        await (await this.web.getPageLocator("input[id*='barcode-input-text']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getPageLocator("input[id*='barcode-input-text']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async EnterReceiptNumber(receiptNumber: string) {
        receiptNumberData = receiptNumber.trim();
        await (await this.web.getPageLocator("input[id*='barcode-input-text']")).fill(receiptNumber.trim())
        await reportGeneration.getScreenshot(this.web.getPage(), "ENTER THE RECEIPT NUMBER AS " + receiptNumber.trim(), world);
    }

    public async IsShipmentCardInPutAwayDisplayed(shipmentNumber: any) {
        shipmentNumberData = shipmentNumber;
        try {
            await new Promise(resolve => setTimeout(resolve, 10000));
            let isShipmentCardVisible = await (await this.web.getPageLocator("span[title='Shipment " + shipmentNumber + "']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
            return (isShipmentCardVisible)
        }
        catch (e) {
            return false;
        }
    }

    public async ClickOnPutAwayAllBtn() {
        await reportGeneration.getScreenshot(this.web.getPage(), `SHIPMENT CARD  ${shipmentNumberData}  AVAILABLE FOR THE RECEIPT NUMBER  ${receiptNumberData} `, world);
        await (await this.web.getElementByRolebyExactText('button', 'Put Away All')).click()
    }

    public async GetQuantityFromPutAwaySection(): Promise<string> {
        await ((await this.web.getPageLocator("button[aria-label='Put Away']")).first()).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        return await (await this.web.getPageLocator("div[aria-labelledby='recQuanInpText-labelled-by|label']")).textContent()??"";
    }

    public async GetBranchFromPutAwaySection(): Promise<string> {
        await ((await this.web.getPageLocator("oj-c-button:has(button[aria-label='Cancel'])")).locator("..").locator("oj-c-button >> button").nth(1)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        return await (await this.web.getPageLocator("div[aria-labelledby='subinvInpText-labelled-by|label']")).textContent()??"";
    }

    public async ClickOnPutAway() {
        await reportGeneration.getScreenshot(this.web.getPage(), `PUT AWAY SECTION DISPLAYED `, world);
        //    await ((await this.web.getPageLocator("oj-c-button:has(button[aria-label='Cancel'])")).locator("..").locator("oj-c-button >> button").nth(1)).waitFor
        await ((await this.web.getPageLocator("button[aria-label='Put Away']")).first()).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await ((await this.web.getPageLocator("button[aria-label='Put Away']")).first()).click()
    }

    public async CapturePutAwaySuccessMessage() {
        await (this.web.getPage().locator("div.oj-message-summary", { hasText: 'Put away created' })).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await reportGeneration.getScreenshot(this.web.getPage(), `PUT AWAY SUCCESS MESSAGE `, world);
        return await (this.web.getPage().locator("div.oj-message-summary", { hasText: 'Put away created' })).textContent();
    }

    public async ClosePutAwayDialog() {
        await (await this.web.getPageLocator("div.oj-message-close")).click();
    }
}