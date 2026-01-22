import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TestInfo } from "@playwright/test";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;

setDefaultTimeout(3000000);

export default class SCMWolOrderCaptureHomePage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsSCMWolOrderCapturePageDisplayed() {
        await (await this.web.getFrameLocatorObject("iframe[title='Order Capture']")).getByRole('heading', { name: 'Order Capture' }).waitFor({ state: 'visible', timeout: 80000 })
        return await (await this.web.getFrameLocatorObject("iframe[title='Order Capture']")).getByRole('heading', { name: 'Order Capture' }).isVisible({ timeout: 12000 })
    }
}