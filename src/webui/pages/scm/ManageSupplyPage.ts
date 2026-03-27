import { TestInfo } from "@playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { TEST_CONFIG } from "../../../config/test-config";
import { setDefaultTimeout, world } from "@cucumber/cucumber";

let reportGeneration: ReportGeneration;
let orderData: string;
let ENTER_SUPPLY_REFRENCE_NUMBER: string = "input[aria-label=' Supply Request Reference Number']";
setDefaultTimeout(3000000);
export default class ManageSupplyPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsManageSupplyLinesPageDisplayed() {
        await (await this.web.getPageLocator("div[title='Manage Supply Lines']")).waitFor({ timeout: TEST_CONFIG.TIMEOUTS.element })
        return await (await this.web.getPageLocator("div[title='Manage Supply Lines']")).isVisible({ timeout: TEST_CONFIG.TIMEOUTS.element })
    }
    public async ExpandSearch() {
        (await this.web.getPageLocator("a[title='Expand Search']")).click();
    }

    public async EnterSupplyReferenceNumber(orderNumber: string) {
        orderData = orderNumber;
        await reportGeneration.getScreenshot(this.web.getPage(), 'MANAGE SUPPLY LINES PAGE DISPLAYED', world);
        await (await this.web.getElementByRoleByName('heading', 'Manage Supply Lines')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator(ENTER_SUPPLY_REFRENCE_NUMBER)).fill(orderNumber.trim());
        await reportGeneration.getScreenshot(this.web.getPage(), 'ENTER SUPPLY ORDER REFERENCE NUMBER AS ' + orderNumber, world);
    }

    public async ClickonManageSupplySearch() {
        await (await this.web.getElementByRoleByName('button', 'Search')).click();
        await (await this.web.getPageLocator('span[title="Document number in the supply system"]')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async GetDocumentNumber(CustomerSO: string, colName: string) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await (await this.web.getElementByText(CustomerSO??''.trim())).waitFor({ state: 'visible', timeout: 12000 })
        try{
        await (await this.web.getPageLocator("table[summary='This table contains column headers corresponding to the data body table below']")).nth(1).waitFor({ state: 'visible', timeout: 30000 });
        await (await this.web.getPageLocator("table[summary='Show Table'] tr td  span:has-text('Transfer')")).waitFor({ state: 'visible', timeout: 30000 })
        await reportGeneration.getScreenshot(this.web.getPage(), 'SEARCH RESULTS FOR TRANSFER ORDER NUMBER - ' + orderData, world);
        let getIndex;
        const getAllElementsInTableSupplyLines = (await this.web.getPageLocator("table[summary='This table contains column headers corresponding to the data body table below'] tr:nth-child(3) th:has(span)"));
        for (let i = 0; i < await getAllElementsInTableSupplyLines.count(); i++) {
            if (await getAllElementsInTableSupplyLines.nth(i).textContent() === colName) {
                getIndex = i - 1;
                break;
            }
        }
        return (await (await this.web.getPageLocator("table[summary='Show Table'] table tr td:nth-of-type(" + getIndex + ")")).textContent()) ?? "";
     }catch(exception){
        return '';
     }
    }


}