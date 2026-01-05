import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
export default class InventoryManagementActionsPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }


    public async isActionsPopUpDisplayed(): Promise<boolean> {
        return await (await this.web.getElementByRolebyExactText('gridcell', 'Transfer Orders')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }

    public async clickOnActionsDataFromInventoryManagementPage(optionsToSelect: string) {
        console.log(await this.web.getElementByRolebyExactText('gridcell', optionsToSelect));
        await ((await this.web.getPageLocator("//div[@class='oj-listitemlayout-grid']//a[text()='Transfer Orders']"))).click();
    }


}