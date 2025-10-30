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

    public async GetStockAvailabilityForProduct(product: string) {
        const availableStockEle = this.web.getPageLocator('oj-c-button.in-stock-button');
        return await (await availableStockEle).textContent();
    }


    public async GetATPAvailableDate() {
        let atpDate: string;
        const getListOfSpanElements = await (await this.web.getPageLocator('oj-c-button.atp-button button')).all();
        for (const atpText of getListOfSpanElements) {
            if (await atpText.textContent() != "") {
                atpDate = await atpText.getAttribute('aria-label');
            }
        }
        return atpDate.trim();
    }

}