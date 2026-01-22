import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let FRAME_LOCATOR_TEXT = 'iframe[src*="wol-order-capture/live"]';

setDefaultTimeout(3000000);


export default class ConfirmShipmentPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsShipGoodsPageDisplayed() {
        await (await this.web.getElementByRolebyExactText('heading', 'Ship Goods')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON CONFIRM SHIPMENT ", world);
        return await (await this.web.getElementByRolebyExactText('heading', 'Ship Goods')).isVisible();
    }

    public async EnterShipmentNumber(shipmentNumber: string) {
        await (await this.web.getElementByText('Shipment Number Barcode')).click();
        await (await this.web.getPageLocator("div.oj-text-field-middle input[id*='barcode-input-text']")).fill(shipmentNumber)
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER ENTERING SHIPMENT NUMBER " + shipmentNumber, world);
    }

    public async IsShipmentNumberPageDisplayed(shipmentNumber: string, itemNum: string) {
        await (await this.web.getElementByRolebyExactText('heading', shipmentNumber)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getPageLocator("div[aria-label*='" + itemNum + "']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await reportGeneration.getScreenshot(this.web.getPage(), "SHIPMENT PAGE WITH SHIPMENT NUMBER " + shipmentNumber + " IS DISPLAYED", world);
        return await (await this.web.getElementByRolebyExactText('heading', shipmentNumber)).isVisible();
    }

    public async ClickOnShipmentTile(itemNum: string) {
        await (await this.web.getPageLocator("div[aria-label*='" + itemNum + "']")).click();
    }

    public async GetShippedQtyInShipmentLineDetails(): Promise<string> {
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON SHIPMENT TILE ", world);
        await (await this.web.getPageLocator("div.oj-drawer-full-height div[title='Shipment Line Details']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getPageLocator("//span[text()='Ship Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).inputValue()
    }

    public async ClickOnConfirmShipment() {
        await (await this.web.getPageLocator("(//button[@aria-label='Update']//ancestor::oj-toolbar//button[@aria-label='Cancel'])[1]")).click()
        await (await this.web.getPageLocator("div.oj-sp-header-general-overview-button-group button[aria-label='Confirm Shipment']")).click();
    }

    public async IsShipmentConfirmationMessageDisplayed(shipmentNumber: string) {
        const expectedMsg = `Shipment ${shipmentNumber} confirmed`;
        await (await this.web.getPageLocator('#shipmentconfirm_messagesLogContainer li')).filter({hasText: expectedMsg}).waitFor({state: 'attached',timeout: 40000})
        return await (await this.web.getPageLocator('#shipmentconfirm_messagesLogContainer li')).filter({hasText: expectedMsg}).isVisible()
    }
}