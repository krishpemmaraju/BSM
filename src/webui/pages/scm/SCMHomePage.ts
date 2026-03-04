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
let CLICK_ON_ORDERMANAGEMENT: string = "#groupNode_order_management"
let WAIT_FOR_ACTIONS_MENU: string = "span[title='Actions']";
let GET_NAV_LINKS: string = "#navmenu-wrapper a"
let CLICK_RIGHT_HAND_NAV: string = "#clusters-right-nav"
//setDefaultTimeout(600 * 1000 * 2);

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
        if (!await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(5)) {
            try {
                console.log("coming to try");
                await this.web.getPage().reload();
                const isVisble = await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(5);
                if (!isVisble) {
                    await this.web.getPage().reload();
                }
                await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(5);
                await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON INVENTORY MANAGEMENT", world);
            }
            catch (error) {
                console.log("coming to catch");
                await this.web.getPage().reload();
                const isVisble = await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").isElementVisible(5);
                if (!isVisble) {
                    await this.web.getPage().reload();
                }
                await this.web.element(WAIT_FOR_ACTIONS_MENU, "Waiting for actions menu in Inventory Dashboard").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
                await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON INVENTORY MANAGEMENT", world);
            }
        }
    }

    public async navigateToInventoryExecution() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await this.web.element(CLICK_ON_SUPPLYCHAINEXECUTION, "Click on Supply Chain Execution").click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON SUPPLYCHAIN EXECUTION", world)
        await (await this.web.getElementByRoleByName('link', 'Inventory Execution')).click();
        await (await this.web.getElementByRolebyExactText('heading', 'Inventory Management')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async NavigateToOrderCaptureUI() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM HOME PAGE LAUNCHED", world);
        const getNavMenuLinks = await this.web.getPageLocator(GET_NAV_LINKS);
        const rightHandNav = await this.web.getPageLocator(CLICK_RIGHT_HAND_NAV);
        for (let i = 0; i < await getNavMenuLinks.count(); i++) {
            if (await getNavMenuLinks.nth(i).textContent({ timeout: 6000 }) == "Order Management") {
                console.log(await getNavMenuLinks.nth(i).textContent());
                await getNavMenuLinks.nth(i).click();
                break;
            }
            else {
                if (i == 7) {
                    await rightHandNav.click();
                }
            }
        }
        await (await this.web.getPageLocator('div[title="Wolseley Order Capture"] a')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.probElements });
        await (await this.web.getPageLocator('div[title="Wolseley Order Capture"] a')).click()
        await reportGeneration.getScreenshot(this.web.getPage(), "WOLSELEY ORDER CAPTURE PAGE DISPLAYED", world);
    }

    public async IsOrderCaptureUILoaded() {
        await (await this.web.getElementByRolebyExactText('heading', "Order Capture")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        return await (await this.web.getElementByRolebyExactText('heading', "Order Capture")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async navigateToOrdermanagement() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM HOME PAGE LAUNCHED", world);
        const getNavMenuLinks = await this.web.getPageLocator(GET_NAV_LINKS);
        const rightHandNav = await this.web.getPageLocator(CLICK_RIGHT_HAND_NAV);
        for (let i = 0; i < await getNavMenuLinks.count(); i++) {
            if (await getNavMenuLinks.nth(i).textContent({ timeout: 6000 }) == "Order Management") {
                await getNavMenuLinks.nth(i).click();
                break;
            }
            else {
                if (i == 7) {
                    await rightHandNav.click();
                }
            }
        }
        (await this.web.getPageLocator('#itemNode_order_management_order_management_0')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.probElements });
        await reportGeneration.getScreenshot(this.web.getPage(), "ORDER MANAGEMENT PAGE SECTION LAUNCHED", world);
    }

    public async navigateToSupplyChainExecution() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM HOME PAGE LAUNCHED", world);
        const getNavMenuLinks = await this.web.getPageLocator(GET_NAV_LINKS);
        const rightHandNav = await this.web.getPageLocator(CLICK_RIGHT_HAND_NAV);
        for (let i = 0; i < await getNavMenuLinks.count(); i++) {
            if (await getNavMenuLinks.nth(i).textContent({ timeout: 6000 }) == "Supply Chain Execution") {
                console.log(await getNavMenuLinks.nth(i).textContent());
                await getNavMenuLinks.nth(i).click();
                break;
            }
            else {
                if (i == 7) {
                    await rightHandNav.click();
                }
            }
        }
        (await this.web.getPageLocator('#itemNode_supply_chain_execution_SupplyChainOrchestration_0')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.probElements });
        await reportGeneration.getScreenshot(this.web.getPage(), "SUPPLY CHAIN ORCHESTRATION PAGE SECTION LAUNCHED", world);
    }


    public async navigateToTools() {
        await this.ClickOnHomeIcon();
        await this.web.element(WAIT_FOR_SEARCH_ICON, "Wait for search icon on Home Page").waitForElementToVisible(TEST_CONFIG.TIMEOUTS.element);
        await reportGeneration.getScreenshot(this.web.getPage(), "SCM HOME PAGE LAUNCHED", world);
        const getNavMenuLinks = await this.web.getPageLocator(GET_NAV_LINKS);
        const rightHandNav = await this.web.getPageLocator(CLICK_RIGHT_HAND_NAV);
        for (let i = 0; i < await getNavMenuLinks.count(); i++) {
            if (await getNavMenuLinks.nth(i).textContent({ timeout: 6000 }) == "Tools") {
                console.log(await getNavMenuLinks.nth(i).textContent());
                await getNavMenuLinks.nth(i).click();
                break;
            }
            else {
                if (i == 7) {
                    await rightHandNav.click();
                }
            }
        }
        (await this.web.getPageLocator('#itemNode_tools_scheduled_processes_fuse_plus_0')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.probElements });
        await reportGeneration.getScreenshot(this.web.getPage(), "SCHEDULED PROCESSES PAGE SECTION LAUNCHED", world);
    }


    public async ClickOnSupplyChainOrchestration() {
        await (await this.web.getPageLocator('#itemNode_supply_orchestration_supply_orchestration_0')).click();
    }

    public async ClickOnScheduledProcesses() {
        await (await this.web.getPageLocator('#itemNode_tools_scheduled_processes_fuse_plus_0')).click();
    }

}