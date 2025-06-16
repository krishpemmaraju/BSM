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

export default class SCMHomePage {
    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async isHomePageDisplayed() {
        await (await this.web.getElementByRolebyExactText('link', 'You have a new home page!')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM HOME PAGE LANDED", world)
        return (await this.web.getElementByRolebyExactText('link', 'You have a new home page!')).isVisible();
    }

    public async ClickOnHomeIcon() {
        await this.web.element(CLICK_ON_HOME_LINE, "Click on Home Icon").click();
    }

    public async navigateToInventoryManagement() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await this.web.element(CLICK_ON_SUPPLYCHAINEXECUTION, "Click on Supply Chain Execution").click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON SUPPLYCHAIN EXECUTION", world)
        await (await this.web.getElementByRoleByName('link', 'Inventory Management')).click();
        await (await this.web.getElementByRolebyExactText('heading', 'Inventory Management')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        if (!await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(10)) {
            try {
                console.log("coming to try");
                if (!await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(10)) {
                    await this.web.getPage().reload();
                }
            } 
            catch (error) {
                console.log("coming to catch");
                if (!await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(10)) {
                    await this.web.getPage().reload();
                }
                await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
                await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON INVENTORY MANAGEMENT", world);
            }
        }
    }

    public async NavigateToOrderCaptureUI(){
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await this.web.element(CLICK_ON_ORDERMANAGEMENT, "Click on Order Management").click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON ORDER MANAGEMENT", world)
        await (await this.web.getElementByRoleByName('link', 'Wolseley Order Capture')).click();
    }

    public async IsOrderCaptureUILoaded(){
        await (await this.web.getElementByRolebyExactText('heading',"Order Capture")).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element});
        return await (await this.web.getElementByRolebyExactText('heading',"Order Capture")).isVisible({timeout: TEST_CONFIG.TIMEOUTS.element});
    }
}