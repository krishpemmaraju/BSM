import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
let reportGeneration: ReportGeneration;

let CLICK_SSO_SIGNIN = "input[value='Sign in']";
let CLICK_SSO_YES = "input[value='Yes']";
let CLICK_SSO_NEXT = "input[value='Next']";

export default class VBCSOrderCaptureUIPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async loginIntoVBCSOrderCaptureUI(url: string, username: string, password: string) {
        try {
            await this.web.gotToURL(url);
        }
        catch (error) {
            await this.web.gotToURL(url);
        }
        (await this.web.getElementByRoleByName('button', 'SSO')).waitFor({ state: 'visible', timeout: 6000 });
        (await this.web.getElementByRoleByName('button', 'SSO')).click();
        (await this.web.getElementByPlaceholder('first.last@domain.com')).fill(username);
        await (await this.web.getPageLocator(CLICK_SSO_NEXT)).click();
        (await this.web.getElementByPlaceholder('Password')).fill(password);
        (await this.web.getPageLocator(CLICK_SSO_SIGNIN)).click();

        try {
            await (await this.web.getPageLocator(CLICK_SSO_YES)).waitFor({state: 'visible', timeout: 15000})
            await (await this.web.getPageLocator(CLICK_SSO_YES)).waitFor({state: 'attached', timeout: 15000})
            await (await this.web.getPageLocator(CLICK_SSO_YES)).scrollIntoViewIfNeeded();
            await (await this.web.getPageLocator(CLICK_SSO_YES))
                .click({ timeout: 12000});
        } catch (error) {
        }

        (await this.web.getElementByRolebyExactText('heading', 'Order Capture')).waitFor({ state: 'visible', timeout: 12000 })
    }

}