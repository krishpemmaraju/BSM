
import { expect, FrameLocator, Page, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";


let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let FRAME_LOCATOR_TEXT = 'iframe[src*="wol-order-capture/live"]';

//setDefaultTimeout(600 * 1000 * 2);

export default class OrderManagementPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async getFramePageObject(): Promise<FrameLocator> {
        return this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT);
    }

    public async navigateToSubSectionMenu(SubSectionMenuLink: string) {
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON ORDER MANAGEMENT", world)
        await (await this.web.getPageLocator("div[title='" + SubSectionMenuLink + "']")).scrollIntoViewIfNeeded();
        await (await this.web.getPageLocator("div[title='" + SubSectionMenuLink + "']")).click();
    }

    public async clickOnCreateOrderUnderSCMOM() {
        await (await this.web.getElementByRolebyExactText('heading', 'Orders on Backorder')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON ORDER MANAGEMENT SUB SECTION", world);
        if (await (await this.web.getPageLocator('#d1\\:\\:\\msgDlg\\:\\:cancel')).isVisible()) {
            await (await this.web.getPageLocator('#d1\\:\\:\\msgDlg\\:\\:cancel')).click();
        }
        await (await this.web.getElementByRoleByName('button', 'Create Order')).click();
        if (await (await this.web.getPageLocator('#d1\\:\\:\\msgDlg\\:\\:cancel')).isVisible()) {
            await (await this.web.getPageLocator('#d1\\:\\:\\msgDlg\\:\\:cancel')).click();
        }
        await (await this.web.getElementByRolebyExactText('heading', 'Create Order')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async IsOrderCaptureUILoaded(headerText: string) {
        await (await this.getFramePageObject()).getByRole('heading', { name: headerText }).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON CREATE ORDER", world);
        return await (await this.getFramePageObject()).getByRole('heading', { name: headerText }).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async ClickOnManageOrdersRedwood(optionToSelect: string) {
        await (await this.web.getElementByRoleByName('heading', 'Order Management')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getPageLocator("a[title='View all actions']")).click()
        await (await this.web.getPageLocator("div[title='Actions']")).waitFor({ state: 'visible', timeout: 9000 })
        return (await this.web.switchToNewWindow("//div[@class='oj-listview-cell-element']//a[text()='" + optionToSelect + "']", 'Clicking on Manage Order'));
    }

    public async ClickOnClose() {
        await (await this.web.getPageLocator("div.oj-flex-bar-start oj-c-button")).click()
    }

}