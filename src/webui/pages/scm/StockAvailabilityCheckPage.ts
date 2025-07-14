import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;


setDefaultTimeout(60 * 10 * 1000);
let GET_STOCK_DATA = 'wol-stock-quantity.oj-complete';
let GET_ATP_DATE = "oj-c-button.stock-button button[aria-label*='ATP']"

export default class StockAvailabilityCheckPage {


    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async GetStockAvailabilityForProduct(product : string) {
        (await this.web.getElementByText(product)).waitFor({state:'visible', timeout:TEST_CONFIG.TIMEOUTS.element});
        return await this.web.element(GET_STOCK_DATA,'GET STOCK DATA ELEMENT').getTextValue();
    }

    
    public async GetATPAvailableDate() {
        (await this.web.getElementByText('Product Details')).waitFor({state:'visible', timeout:TEST_CONFIG.TIMEOUTS.element});
        return await this.web.element(GET_ATP_DATE,'GET ATP DATE ELEMENT').getTextValue();
    }

}