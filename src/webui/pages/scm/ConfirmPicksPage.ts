import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import { setDefaultTimeout } from "@cucumber/cucumber";
import UIActions from "../../actions/UIActions";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_SEARCH_ICON = "button[aria-label='Search by item, description, or MPN']";
let WAIT_FOR_TABLE_DISPLAY = "th[title='Item']";
setDefaultTimeout(3000000);

export default class ConfirmPicksPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async IsConfirmPicksPageDisplayed() {
        await (await this.web.getElementByRolebyExactText('heading', 'Confirm Picks')).waitFor({ timeout: 8000 })
        return await (await this.web.getElementByRolebyExactText('heading', 'Confirm Picks')).isVisible();
    }

    public async SelectAdvanceSearch(optionToSelect) {
        await (await this.web.getPage().locator('div.oj-label-group span[id="oj-selectsingle-1\\|hint"]', { hasText: 'Context' })).click()
        await (await this.web.getElementByText(optionToSelect)).click()
    }

    public async EnterCustomerSalesOrderNumberOnConfirmPicksPage(custSalesOrderNumber: string) {
        await (await this.web.getPageLocator("input[id='barcode-input-text-orderIdBarcode\\|input']")).fill(custSalesOrderNumber);
    }

    public async IsProuctTileDisplayed(itemNum: string) {
        await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).waitFor({ state: 'visible', timeout: 9000 });
        return await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).isVisible()
    }

    public async GetQuantityFromProductTileInPickingPane(): Promise<string> {
        return (await this.web.getPageLocator("div.oj-sp-card-common-tertiary-text-top-margin span")).textContent();
    }

    public async GetSourceLocationFromProductTileInPickingPane(): Promise<string> {
        return (await this.web.getPageLocator("div.oj-sp-card-common-secondary-text-top-margin span")).textContent();
    }

    public async GetDestinationLocationFromProductTileInPickingPane(): Promise<string> {
        return (await this.web.getPageLocator("div.oj-flex-item.oj-sm-flex-initial span[title*='Destination']")).textContent();
    }

    public async ClickOnItemPanelUnderConfirmPicks(itemNum: string) {
        await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).click()
    }

    public async EnterSubnventoryCode(branch: string) {
        await (await this.web.getPageLocator("button[aria-label='Confirm Pick and Close']")).first().waitFor({ state: 'visible', timeout: 9000 })
        await (await this.web.getPageLocator("//span[text()='Subinventory Barcode']//ancestor::div[contains(@class,'oj-flex-item')]//oj-button[@title='Select a value from the list']")).click()

        await this.web.getPage()
            .locator("//span[text()='Subinventory']//ancestor::div[contains(@class,'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot')]//span[@class='oj-text-field-end']")
            .click({ force: true });
        await (await this.web.getElementByRoleByName('row', branch)).click()
    }

    public async EnterItemNumber(itemNumber: string) {
        await (await this.web.getElementByText('Item or GTIN Barcode')).click();
        await (await this.web.getElementByText('Item or GTIN Barcode')).fill(itemNumber);
    }

    public async EnterPickedQuantity(pickedQty: string){
        await (await this.web.getElementByText('Picked Quantity')).fill(pickedQty);
    }

public async ClickOnConfirmPickAndClose(){
   await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-button button[aria-label='Confirm Pick and Close']")).click()
}

}