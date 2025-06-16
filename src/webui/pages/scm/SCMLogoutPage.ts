import { expect, TestInfo } from "playwright/test";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
setDefaultTimeout(60*1000*2); 

let CLICK_ON_LOGOUT_ICON: string = "a[title='Settings and Actions']";
let CLICK_ON_SIGNOUT: string = "a[title='Sign Out']";

export default class SCMLogoutPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async LogoutApplication(){
      await this.web.element(CLICK_ON_LOGOUT_ICON,"Click on Setting and Actions Button").click();
      await this.web.element(CLICK_ON_SIGNOUT,"Click on Sign out Button").click();
      await expect (await this.web.getElementByRolebyExactText('button','Confirm')).toBeVisible({timeout:TEST_CONFIG.TIMEOUTS.element});
      await (await this.web.getElementByRolebyExactText('button','Confirm')).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element});
      await (await this.web.getElementByRolebyExactText('button','Confirm')).click();
      await (await this.web.getElementByRolebyExactText('button','Sign In ')).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element});
    }
}