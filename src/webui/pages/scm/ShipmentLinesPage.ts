import { expect, Locator, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_SEARCH_ICON = "button[aria-label='Search by item, description, or MPN']";
let WAIT_FOR_TABLE_DISPLAY = "th[title='Item']";
setDefaultTimeout(3000000);


export default class ShipmentLinesPage {
  
     constructor(private web: UIActions, testInfo?: TestInfo) {
            reportGeneration = new ReportGeneration();
            testInfo = testInfo!;
        }

    public async EnterCustomerSalesOrderNumber(customerSalesOrder:string){
        if(await (await this.web.getPageLocator("div.oj-flex-item button[aria-label*='Clear']")).isVisible()){
        await (await this.web.getPageLocator("div.oj-flex-item button[aria-label*='Clear']")).click();}
        await (await this.web.getElementByPlaceholder('Search by order number')).fill(customerSalesOrder)
        await (await this.web.getPageLocator("Search by order number")).click()
        await reportGeneration.getScreenshot(this.web.getPage(), `SEARCH RESULTS FOR CUSTOMER SALES ORDER NUMBER ${customerSalesOrder}`, world);
        await (await this.web.getPageLocator("th[title='Line Status']")).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element})
    }

}