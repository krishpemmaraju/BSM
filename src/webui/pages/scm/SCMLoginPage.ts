import { Page, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";
import { setDefaultTimeout, world } from "@cucumber/cucumber";

setDefaultTimeout(60 * 10 * 1000);

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let SINGLE_SIGN_ON: string = "#ssoBtn";
let SCM_USERNAME: string = "#userid";
let SCM_PASSWORD: string = "#password";

export default class SCMLoginPage {
    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async loginIntoSCMApp(url: string, username: string, password: string) {
        try{
        await this.web.gotToURL(url); }
        catch(error){
            await this.web.gotToURL(url);
        }
        //(await this.web.getPageLocator(SINGLE_SIGN_ON)).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM Landing Page Launched", world);
        await this.web.element(SCM_USERNAME, "ENTER USER NAME").setText(username);
        await this.web.element(SCM_PASSWORD, "ENTER PASSWORD").setText(password);
        await reportGeneration.getScreenshotData(this.web.getPage(), "SCM User details", "After Entering username and password", world);
        await (await this.web.getElementByRolebyHasText('button', 'Sign In ')).click();
    }

}