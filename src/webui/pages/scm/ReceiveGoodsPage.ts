import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TestInfo } from "@playwright/test";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;

//setDefaultTimeout(1200000);
setDefaultTimeout(1200000);
let getHeadingPageText: string;

export default class ReceiveGoodsPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsReceiveGoodsPageDisplayed() {
        await (await this.web.getElementByRolebyExactText('heading', 'Receive Goods')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        getHeadingPageText = await (await this.web.getElementByRolebyExactText('heading', 'Receive Goods')).textContent()
        await reportGeneration.getScreenshot(this.web.getPage(), `${getHeadingPageText} PAGE DISPLAYED `, world);
        return await (await this.web.getElementByRolebyExactText('heading', 'Receive Goods')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async SelectOrganizationDropdown(branch: string) {
        await (await this.web.getPageLocator('div.oj-searchselect-main-field input')).click()
        const getListOfOrgDrpDwnCnt = await this.web.getPageLocator('#lovDropdown_OrgNameSingleSelect ul li');
        for (let i = 0; i < await getListOfOrgDrpDwnCnt.count(); i++) {
            let getOrdData = await getListOfOrgDrpDwnCnt.nth(i).textContent();
            if (getOrdData === branch) {
                await getListOfOrgDrpDwnCnt.nth(i).click();
                break;
            }
        }
        await reportGeneration.getScreenshot(this.web.getPage(), `${branch} SELECTED `, world);
    }

    public async ClickOnContinueBtn() {
        await (await this.web.getElementByRolebyExactText('button', 'Continue')).click();
    }

    public async IsOrderDropdownDisplayed(): Promise<boolean> {
        await (await this.web.getPageLocator("input[id='receiveTypeSingleSelect|input']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await reportGeneration.getScreenshot(this.web.getPage(), ` DROPDOWN TO ENTER RECEIPT NUMBER IS DISPLAYED `, world);
        return await (await this.web.getPageLocator("input[id='receiveTypeSingleSelect|input']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async EnterTransferOrderNumberInReceiveGoodsPage(transferOrder: string) {
        await (await this.web.getPageLocator("input[id*='barcode-input-text']")).fill(transferOrder.trim())
        await reportGeneration.getScreenshot(this.web.getPage(), ` ENTER THE TRANSFER NUMBER AS ${transferOrder.trim()} `, world);
    }

    public async IsShipmentCardDisplayed(shipmentNumber: any, quantity: any) {
        try {
            await new Promise(resolve => setTimeout(resolve, 10000));
            let isShipmentCardVisible = await (await this.web.getPageLocator("span[title='Shipment " + shipmentNumber + "']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
            let isQuantityVisible = await (await this.web.getPageLocator("span[title='" + quantity + "/" + quantity + " EA']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
            console.log(isShipmentCardVisible + " - " + isQuantityVisible)
            return (isShipmentCardVisible && isQuantityVisible)
        }
        catch (e) {
            return false;
        }
        await reportGeneration.getScreenshot(this.web.getPage(), ` SHIPMENT CARD ${shipmentNumber} WITH THE QUANTITY ${quantity} DISPLAYED `, world);
    }

    public async ClickOnReceiveAll() {
        await reportGeneration.getScreenshot(this.web.getPage(), ` SHIPMENT CARD WITH THE QUANTITY IS DISPLAYED `, world);
        await (await this.web.getElementByRolebyExactText('button', 'Receive All')).click()
    }

    public async IsNewReceiptPageDisplayed() {
        return await (await this.web.getElementByRolebyExactText('heading', 'New Receipt')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async ClickOnSubmitBtnReceiveGoods() {
        await reportGeneration.getScreenshot(this.web.getPage(), ` NEW RECEIPT PAGE IS DISPLAYED `, world);
        await (await this.web.getElementByRolebyExactText('button', 'Submit')).click()
    }

    public async CaptureReceiptID() {
        await (this.web.getPage().locator("div.oj-message-summary", { hasText: /Receipt \d+ created/ })).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await reportGeneration.getScreenshot(this.web.getPage(), `RECEIPT SUCCESS MESSAGE `, world);
        return await (this.web.getPage().locator("div.oj-message-summary", { hasText: /Receipt \d+ created/ })).textContent();
    }

}