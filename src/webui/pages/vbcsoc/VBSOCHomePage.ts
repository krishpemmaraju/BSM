import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";
import { setDefaultTimeout, world } from "@cucumber/cucumber";


let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_HOME_LINE: string = "a[title='Home']";
let WAIT_FOR_SEARCH_ICON: string = "a[title='Search']";
let CLICK_ON_SUPPLYCHAINEXECUTION: string = "#groupNode_supply_chain_execution";
let CLICK_ON_ORDERMANAGEMENT:string = "#groupNode_order_management"
let WAIT_FOR_ACTIONS_MENU: string = "span[title='Actions']";
setDefaultTimeout(60 * 1000 * 2);

export default class VBSOCHomePage {
    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsOrderCaptureUILoaded(){
        await (await this.web.getElementByRolebyExactText('heading',"Order Capture")).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element});
        return await (await this.web.getElementByRolebyExactText('heading',"Order Capture")).isVisible({timeout: TEST_CONFIG.TIMEOUTS.element});
    }
}