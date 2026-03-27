import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
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

    public async SelectAdvanceSearch(optionToSelect: string) {
        await (await this.web.getPage().locator('div.oj-label-group span[id="oj-selectsingle-1\\|hint"]', { hasText: 'Context' })).click()
        await (await this.web.getElementByText(optionToSelect)).click()
    }

    public async EnterCustomerSalesOrderNumberOnConfirmPicksPage(custSalesOrderNumber: string) {
        await (await this.web.getPageLocator("input[id='barcode-input-text-orderIdBarcode\\|input']")).fill(custSalesOrderNumber);
    }

    public async IsProuctTileDisplayed(itemNum: string) {
        await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).waitFor({ state: 'visible', timeout: 180000 });
        return await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).isVisible()
    }

    public async isProductsCardDisplayedForMultipleProducts(itemNum1: string, itemNum2: string) {
        await (await this.web.getPageLocator("span[title*='" + itemNum1 + "']")).waitFor({ state: 'visible', timeout: 9000 });
        await (await this.web.getPageLocator("span[title*='" + itemNum2 + "']")).waitFor({ state: 'visible', timeout: 9000 });
        return (await (await this.web.getPageLocator("span[title*='" + itemNum1 + "']")).isVisible() && await (await this.web.getPageLocator("span[title*='" + itemNum2 + "']")).isVisible())
    }

    public async GetQuantityFromProductTileInPickingPane(): Promise<string> {
        return await (await this.web.getPageLocator("div.oj-sp-card-common-tertiary-text-top-margin span")).textContent() ?? '';
    }

    public async GetPickingQuantityFromMultiProductTile(itemNum1: string): Promise<string> {
        let GetPickQtyForItem1 = await (await this.web.getPageLocator("div[aria-label*='" + itemNum1 + "'] span.oj-typography-body-sm.oj-line-clamp-1.oj-sp-card-common-break-all.oj-text-color-primary")).textContent() ?? '';
        return GetPickQtyForItem1;
    }

    public async GetPickingQuantityFromMultiProductTileInPickingPane(itemNum1: string, itemNum2: string): Promise<string> {
        let GetPickQtyForItem1 = await (await this.web.getPageLocator("div[aria-label*='" + itemNum1 + "'] span.oj-typography-body-sm.oj-line-clamp-1.oj-sp-card-common-break-all.oj-text-color-primary")).textContent();
        let GetPickQtyForItem2 = await (await this.web.getPageLocator("div[aria-label*='" + itemNum2 + "'] span.oj-typography-body-sm.oj-line-clamp-1.oj-sp-card-common-break-all.oj-text-color-primary")).textContent();
        return GetPickQtyForItem1 + "-" + GetPickQtyForItem2;
    }

    public async GetPickingSourceBranchFromProductTilePane(product: string) {
        let getSourceLocationOfProductFromTile = await (await this.web.getPageLocator("div[aria-label*='" + product + "'] span[title*='Source'].oj-sp-card-flex-no-shrink.oj-typography-body-sm.oj-line-clamp-1.oj-sp-card-common-break-all.oj-text-color-secondary")).textContent();
        return getSourceLocationOfProductFromTile ?? ''.trim()
    }

    public async GetPickingDestinationBranchFromProductTilePane(product: string) {
        let getSourceLocationOfProductFromTile = await (await this.web.getPageLocator("div[aria-label*='" + product + "'] span[title*='Destination'].oj-sp-card-flex-no-shrink.oj-typography-body-sm.oj-line-clamp-1.oj-sp-card-common-break-all.oj-text-color-secondary")).textContent();
        return getSourceLocationOfProductFromTile ?? ''.trim()
    }


    public async GetSourceLocationFromProductTileInPickingPane(): Promise<string> {
        return await (await this.web.getPageLocator("div.oj-sp-card-common-secondary-text-top-margin span")).textContent() ?? '';
    }

    public async GetDestinationLocationFromProductTileInPickingPane(): Promise<string> {
        return await (await this.web.getPageLocator("div.oj-flex-item.oj-sm-flex-initial span[title*='Destination']")).textContent() ?? '';
    }

    public async ClickOnItemPanelUnderConfirmPicks(itemNum: string) {
        await (await this.web.getPageLocator("span[title*='" + itemNum + "']")).click()
    }

    public async EnterSubnventoryCode(branch: string) {
        await (await this.web.getPageLocator("button[aria-label='Confirm Pick and Close']")).first().waitFor({ state: 'visible', timeout: 30000 })
        await new Promise(resolve => setTimeout(resolve, 2000));
        // await (await this.web.getPageLocator("//span[text()='Subinventory Barcode']//ancestor::div[contains(@class,'oj-flex-item')]//oj-button[@title='Select a value from the list']")).click({ force: true })
        // await new Promise(resolve => setTimeout(resolve, 1000));
        //     let getLocationData = await (await this.web.getPageLocator("//span[text()='Subinventory']//ancestor::div[@class='oj-text-field-middle']//following-sibling::div")).textContent() ?? '';
        //     console.log(getLocationData)
        //     await (await this.web.getPageLocator(
        //         "//span[text()='Subinventory']//ancestor::div[contains(@class,'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot')]//span[@class='oj-text-field-end']")
        //     ).waitFor({ state: 'visible', timeout: 18000 });
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     await (await this.web.getPageLocator("//span[text()='Subinventory']//ancestor::div[contains(@class,'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot')]//span[@class='oj-text-field-end']")
        // ).click({ force: true });
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     await (await this.web.getElementByRoleByName('row', getLocationData.trim())).click({ force: true })

        /* this is not required if you uncomments above code from line 82 */
        // if (getLocationData?.trim() === '1BL-LOC') {
        //     await (await this.web.getElementByRoleByName('row', getLocationData?.trim())).click()
        //     await reportGeneration.getScreenshot(this.web.getPage(), "SELECTED BRANCH AS  " + getLocationData, world);
        // } else { await (await this.web.getElementByRoleByName('row', getLocationData?.trim())).click() }
        await reportGeneration.getScreenshot(this.web.getPage(), "SELECTED BRANCH AS  " + branch, world);
    }

    public async EnterLocatorInformation() {
        let getLocatorData = await (await this.web.getPageLocator("//span[text()='Locator']//ancestor::div[@class='oj-text-field-middle']//following-sibling::div")).textContent() ?? '';
        await new Promise(resolve => setTimeout(resolve, 1000));
        await (await this.web.getElementByText('Locator Barcode')).fill(getLocatorData)
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER ENTERING LOCATOR INFORMATION AS " + getLocatorData, world);
    }

    public async EnterItemNumber(itemNumber: string) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).scrollIntoViewIfNeeded()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).click({ force: true });
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).fill(itemNumber);
        await reportGeneration.getScreenshot(this.web.getPage(), "ENTER ITEM NUMBER AS " + itemNumber, world);
    }

    public async EnterPickedQuantity(pickedQty: string) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).type(pickedQty);
        await reportGeneration.getScreenshot(this.web.getPage(), "ENTER PICKED QUANTITY AS  " + pickedQty, world);
    }

    //  this version of function is a work around 

    public async EnterSubInventoryWA(itemNumber: string, pickedQty: string) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).click()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).scrollIntoViewIfNeeded()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).click({ force: true });
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).fill(itemNumber);
    }

    public async EnterSubInventoryPickedQty(itemNumber: string, pickedQty: string) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).scrollIntoViewIfNeeded()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).click({ force: true });
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).click()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).scrollIntoViewIfNeeded()
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).click({ force: true });
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//div[@class='oj-sp-create-edit-drawer-template-content-container']//span[text()='Item or GTIN Barcode']//ancestor::div[@class='oj-text-field-middle']//input")).fill(itemNumber);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).click()
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).clear();
        await (await this.web.getPageLocator("//span[text()='Picked Quantity']//ancestor::div[@class='oj-text-field-middle']//input")).type(pickedQty);
        await reportGeneration.getScreenshot(this.web.getPage(), "ENTER PICKED QUANTITY AS  " + pickedQty, world);
    }

    public async EnterSubInventoryPickedQtyMultiLine(pickedQty: string) {
        const getNofPickTiles = (await this.web.getPageLocator("div.oj-sp-collection-container-main-panel li ul li.oj-listview-item-element"));
        const getPickTilesCount = await getNofPickTiles.count()
        for (let i = (getPickTilesCount - 1); i >= 0; i--) {
            await (await this.web.getPageLocator("div.oj-sp-collection-container-main-panel li ul li.oj-listview-item-element")).nth(i).click();
            await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON PICKING TILE - " + i, world);
            await this.EnterSubnventoryCode('1BL');
            await this.EnterLocatorInformation();
            const getItemInformation = await (await this.web.getPageLocator("div.oj-sp-create-edit-drawer-template-content-container span.oj-sp-card-common-title-ring")).textContent() ?? ''
            await this.EnterItemNumber(getItemInformation?.trim());
            //await this.EnterSubInventoryPickedQty(getItemInformation?.trim(), pickedQty)
            await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-button button[aria-label='Confirm Pick and Close']")).click()
            await reportGeneration.getScreenshot(this.web.getPage(), "AFTER FINISHING PICKING ON PICKING TILE - " + i, world);
        }
    }

    public async ClickOnConfirmPickAndClose() {
        await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-button button[aria-label='Confirm Pick and Close']")).click()
    }

    public async ClickOnPickAllItems() {
        await reportGeneration.getScreenshot(this.web.getPage(), "CLICK ON PICK ALL ITEMS ", world);
        await (await this.web.getPageLocator("div.oj-sp-header-general-overview-button-group button[aria-label='Pick All Items']")).click()
    }

    public async IsConfirmPickAndNextIsVisible() {
        await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-split-menu-button[title='Confirm Pick and Next']")).waitFor({ state: 'visible', timeout: 15000 })
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON PICK ALL ITEMS ", world);
        return await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-split-menu-button[title='Confirm Pick and Next']")).isVisible();
    }

    public async EnterSubinventoryCodeForProduct(product1: string, product2: string, pickedQty: string, pickedQty1?: string) {
        if (await (await this.web.getPageLocator("button[aria-label='Confirm and Next']")).isEnabled()) {
            let GetSubInventoryCode = await (await this.web.getPageLocator("//span[text()='Subinventory']//ancestor::div[@class='oj-text-field-middle']//div[@class='oj-text-field-readonly']")).textContent()
            await new Promise(resolve => setTimeout(resolve, 1000));
            await (await this.web.getPageLocator("//span[text()='Subinventory Barcode']//ancestor::div[contains(@class,'oj-flex-item')]//oj-button[@title='Select a value from the list']")).click({ force: true })

            await this.web.getPage()
                .locator("//span[text()='Subinventory']//ancestor::div[contains(@class,'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot')]//span[@class='oj-text-field-end']")
                .click({ force: true, delay: 2000 });
            await (await this.web.getElementByRoleByName('row', GetSubInventoryCode ?? '')).click()


            let getProductAfterClick = await (await this.web.getPageLocator("oj-drawer-popup div.oj-sp-card-common-flex-shrink h5 span.oj-sp-card-common-title-ring")).getAttribute('title')
            await (await this.web.getElementByText('Item or GTIN Barcode')).click();
            await (await this.web.getElementByText('Item or GTIN Barcode')).fill(getProductAfterClick ?? '');
            await reportGeneration.getScreenshot(this.web.getPage(), "ENTER ITEM NUMBER AS " + product1, world);

            await (await this.web.getElementByText('Picked Quantity')).fill(pickedQty);
            await reportGeneration.getScreenshot(this.web.getPage(), "ENTER PICKED QUANTITY AS  " + pickedQty, world);

            await (await this.web.getPageLocator("oj-c-button[title='Cancel'] + oj-c-split-menu-button[title='Confirm Pick and Next']")).click();

            await (await this.web.getPageLocator("div[title='" + product2 + "']")).waitFor({ state: 'visible', timeout: 12000 })

            let GetSubInventoryCode1 = await (await this.web.getPageLocator("//span[text()='Subinventory']//ancestor::div[@class='oj-text-field-middle']//div[@class='oj-text-field-readonly']")).textContent()

            await (await this.web.getPageLocator("//span[text()='Subinventory Barcode']//ancestor::div[@class='oj-flex-bar oj-flex-item oj-sm-flex-wrap-nowrap']//oj-button[@title='Select a value from the list']")).click()

            await this.web.getPage()
                .locator("//span[text()='Subinventory']//ancestor::div[contains(@class,'oj-text-field-container oj-searchselect-main-field oj-text-field-has-end-slot')]//span[@class='oj-text-field-end']")
                .click({ force: true });
            await (await this.web.getElementByRoleByName('row', GetSubInventoryCode1 ?? '')).click()
            let getProduct2AfterClick = await (await this.web.getPageLocator("oj-drawer-popup div.oj-sp-card-common-flex-shrink h5 span.oj-sp-card-common-title-ring")).getAttribute('title')
            await (await this.web.getElementByText('Item or GTIN Barcode')).click();
            await (await this.web.getElementByText('Item or GTIN Barcode')).fill(getProduct2AfterClick ?? '');
            await reportGeneration.getScreenshot(this.web.getPage(), "ENTER ITEM NUMBER AS " + product2, world);

            await (await this.web.getElementByText('Picked Quantity')).fill(pickedQty);
            await reportGeneration.getScreenshot(this.web.getPage(), "ENTER PICKED QUANTITY AS  " + pickedQty, world);


        }
    }

}