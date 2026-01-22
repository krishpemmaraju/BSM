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

    public async GetStockAvailabilityForProduct(product: string, isStkExists: string) {
        setDefaultTimeout(60 * 10 * 1000);
        const isStkExistsNormalized = isStkExists.toLowerCase();
        if (isStkExistsNormalized == "yes") {
            await expect(await this.web.getPageLocator("wol-stock-quantity.oj-complete span.custom-badge.oj-badge-info")).toBeVisible({ timeout: 5000 })
            const availableStockEle = await this.web.getPageLocator("wol-stock-quantity.oj-complete span.custom-badge.oj-badge-info");
            return  (await (availableStockEle).innerText()).split(' ')[0];
        }
        if (isStkExistsNormalized == "no") {
            await this.web.getPage().waitForTimeout(3000);
            try {
                await (await this.web.getPageLocator("span.custom-badge.oj-badge-danger")).waitFor({ state: 'visible', timeout: 10000 })
                const availableStockEle = (await this.web.getPageLocator("span.custom-badge.oj-badge-danger")).innerText();
                return (await availableStockEle).split(' ')[0];
            }
            catch (error) {
                console.error(error)
            }


        }
        return null;
    }


    public async GetATPAvailableDate(isStkExists: string): Promise<string> {
        let isStkExistsNormalized = isStkExists.toLowerCase();
        const getListOfSpanElements = isStkExistsNormalized == 'no' ? ((await this.web.getPageLocator("wol-stock-quantity.oj-complete span.custom-badge-clear.custom-badge")).first()) : null
        return (await getListOfSpanElements.textContent()).trim();
    }

}