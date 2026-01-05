import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TestInfo } from "@playwright/test";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;

setDefaultTimeout(3000000);

export default class InventoryExecutionPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }


    public async ClickOnInventoryExecutionOptions(invExeOption: string) {
        await reportGeneration.getScreenshot(this.web.getPage(), `CLICK ON ${invExeOption} OPTION`, world);
        await (await this.web.getPageLocator("div[aria-label='" + invExeOption + "']")).click()
    }


}