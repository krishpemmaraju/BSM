import { TestInfo } from "@playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_TASKS = "div[title='Tasks']";
setDefaultTimeout(3000000);
export default class SupplyOrchestrationPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsSupplyOrchestrationPageIsVisible() {
        console.log(await (await this.web.getElementByRoleByName('link', 'Supply Lines Overview')).textContent())
        return await (await this.web.getElementByRoleByName('link', 'Supply Lines Overview')).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async ClickOnTasks() {
        await (await this.web.getPageLocator(CLICK_ON_TASKS)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), 'AFTER LOADING SUPPLY ORCHESTRATION PAGE', world)
        await (await this.web.getPageLocator(CLICK_ON_TASKS)).click();
    }

    public async clickOnManageSupplyLines() {
        await reportGeneration.getScreenshot(this.web.getPage(), 'AFTER CLICKING ON TASKS DROPDOWN', world)
        await (await this.web.getElementByRoleByName('link', 'Manage Supply Lines')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element })
        await (await this.web.getElementByRoleByName('link', 'Manage Supply Lines')).click();
    }
}