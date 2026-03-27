import { expect, FrameLocator, Page, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";
import CreateOrderPage from "./CreateOrderPage";


let reportGeneration: ReportGeneration;
setDefaultTimeout(3000000);

export default class ManageOrdersRedwood {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsManageOrdersPageDisplayed(page: Page): Promise<boolean> {
        await (await this.web.getElementByRoleByNameWithPageArg(page, 'heading', 'Manage Orders')).waitFor({ state: 'visible', timeout: 9000 });
        return await (await this.web.getElementByRoleByNameWithPageArg(page, 'heading', 'Manage Orders')).isVisible({ timeout: 9000 })
    }

    public async EnterCustomerSalesOrder(page: Page, customerSO: string) {
        await (await this.web.getPageLocatorBypage(page, "input[aria-label=' Order']")).fill(customerSO)
        await reportGeneration.getScreenshot(this.web.getPage(), "ENTERED CUSTOMER SALES ORDER NUMBER AS " + customerSO, world);
    }

    public async ClickOnSearch(page: Page) {
        await (await this.web.getPageLocatorBypage(page, "button[accesskey='r']")).click()
    }

    public async IsSearchResultDisplayed(page: Page, customerSO: string): Promise<boolean> {
        await (await this.web.getElementByRoleByNameWithPageArg(page, 'link', customerSO.trim())).waitFor({ state: 'visible', timeout: 15000 })
        await reportGeneration.getScreenshot(page, "SEARCH RESULTS DISPLAYED FOR THE CUSTOMER SALES ORDER " + customerSO, world);
        return await (await this.web.getElementByRoleByNameWithPageArg(page, 'link', customerSO.trim())).isVisible({ timeout: 9000 })
    }

    public async GetColumnIndex(page: Page, colHeader: string): Promise<string> {
        return await (page.locator("table[summary='This table contains column headers corresponding to the data body table below'] tr th span", { hasText: colHeader }).locator('xpath=ancestor::th')).getAttribute('_d_index') ?? '';
    }

    public async ClickOnOrderLink(page: Page, customerSO: string) {
        await (await this.web.getElementByRoleByNameWithPageArg(page, 'link', customerSO.trim())).click()
    }

    public async GetOrderStatusFromManageOrders(page: Page, colName: string, customerSO: string) {
        // await (await this.web.getElementByRoleByNameWithPageArg(page, 'link', customerSO.trim())).click()
        await (await this.web.getPageLocatorBypage(page, "div[title='Order Lines'] h2")).waitFor({ state: 'visible', timeout: 15000 })
        const columnIndex = parseInt(await this.GetColumnIndex(page, 'Status'));
        const getTDStatus = await (page.locator("//table[@summary='Order Lines']//tr//table[@_afrit]//tr//td[@class='xen'][" + columnIndex + "]")).textContent();
        return getTDStatus;
    }


    public async ClickOnCustomerSalesOrderLink(page: Page, customerSO: string) {
        await (await this.web.getElementByRoleByNameWithPageArg(page, 'link', customerSO.trim())).click()
    }
    public async GetMultiLineOrderStatusFromManageOrders(page: Page, product: string, colName: string): Promise<string> {
        await (await this.web.getElementByRoleByNameWithPageArg(page, 'heading', 'Order Lines')).waitFor({ state: 'visible', timeout: 10000 })
        const columnIndex = parseInt(await this.GetColumnIndex(page, colName));
        const getTDStatus = await (page.locator("//span[contains(text(),'" + product + "')]//ancestor::tr[1]//ancestor::table[@_afrit]//td[@class='xen'][" + columnIndex + "]")).textContent();
        return getTDStatus ?? '';
    }

    public async clickOnRefresh(page: Page) {
        await (page.locator('//button[text()="Refresh"]')).click();
    }

    public async GetProductQuantityKitsInfoFromOrder(page: Page, colName: string, optionalItem?: string) {
        await (await this.web.getPageLocatorBypage(page, "a[title='View Components']")).click()
        await new Promise(resolve => setTimeout(resolve, 1000));
        let products: string[] = [];
        const getColIndex = await this.GetColumnIndex(page, colName);
        const getListOfProducts = (await this.web.getPageLocatorBypage(page, "//table[contains(@summary,'Components')]//tr[@_afrap='0']//span[@class='xk']"))
        const getItemLocCount = await getListOfProducts.count();
        for (let i = 0; i < getItemLocCount; i++) {
            let productData = (await getListOfProducts.nth(i).textContent() ?? '').split("-");
            if (optionalItem != '' && productData[0].includes(optionalItem ?? '')) {
                let getRowNumberOfOptionalProd = await (await this.web.getPageLocatorBypage(page,"//span[contains(text(),'GAS & WATER')]//ancestor::tr")).getAttribute('_afrrk');
                let subProductVariableOptProduct = await (await this.web.getPageLocatorBypage(page, "//table[contains(@summary,'Components')]//tr[@_afrap='0_"+(getRowNumberOfOptionalProd)+"']")).textContent() ?? '';
                products.push(subProductVariableOptProduct.split("-")[0].trim())
            } else {
                products.push(productData[0].trim())
            }
        }
        await (await this.web.getPageLocatorBypage(page, "a[accesskey='o']")).click()
        await (await this.web.getPageLocatorBypage(page, "a[title='View Components']")).waitFor({ timeout: 12000 })
        return products;
    }

}