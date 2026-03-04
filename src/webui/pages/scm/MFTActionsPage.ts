
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { expect, TestInfo } from "@playwright/test";
import { TEST_CONFIG } from "../../../config/test-config";
import * as fs from 'fs'
import StringUtils from "../../../utils/StringUtils";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let getColValue: string;

//setDefaultTimeout(1200000);
setDefaultTimeout(1200000);

export default class MFTActionsPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async LoginIntoMFT(url: string, username: string, password: string) {
        try {
            await this.web.gotToURL(url);
        }
        catch (error) {
            await this.web.gotToURL(url);
        }
        await reportGeneration.getScreenshot(this.web.getPage(), "MFT Landing Page Launched", world);
        await (await this.web.getElementByPlaceholder('User Name')).fill(username.trim());
        await (await this.web.getElementByPlaceholder("Password")).type(password.trim(), { delay: 50 });

        await reportGeneration.getScreenshotData(this.web.getPage(), "MFT User details", "After Entering username and password", world);
        await (await this.web.getElementByRolebyHasText('button', 'Login')).click();
    }

    public async ClickOnNavigate() {
        await (await this.web.getElementByRoleByName('button', 'Navigate')).waitFor({ state: 'visible', timeout: 15000 })
        await reportGeneration.getScreenshotData(this.web.getPage(), "MFT Home Page Launched", "After Entering username and password", world);
        await (await this.web.getElementByRoleByName('button', 'Navigate')).click()
    }

    public async EnterMFTNavigationFolder(navigationPath: string) {
        await (await this.web.getPageLocator("input.navigate-input-js")).fill(navigationPath)
        await reportGeneration.getScreenshotData(this.web.getPage(), "Navigate to Path " + navigationPath, "After Entering username and password", world);
        await this.web.keyPress('Enter')
        await reportGeneration.getScreenshotData(this.web.getPage(), "Navigated to Path " + navigationPath, "After Entering username and password", world);
    }

    public async IsFileNameProcessed(navigationPath: string) {
        let isFIleExists: any = await (await this.web.getPageLocator("tr[class*='FileItem'] td.filename-js")).innerText()
        const fileExists = /^SCMOrderLinesToInvoicing_\d{14}\.csv$/.test(isFIleExists ?? '');
        return fileExists;
    }

    public async ClickOnMFTLogout(){
        await (await this.web.getPageLocator("#accountDiv #accountLink")).click()
        await (await this.web.getPageLocator("td.logoutMenuItem #logoutLink")).waitFor({state:'visible', timeout:10000})
        await (await this.web.getPageLocator("td.logoutMenuItem #logoutLink")).click();
    }
}