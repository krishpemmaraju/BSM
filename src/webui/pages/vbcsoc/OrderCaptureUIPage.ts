import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";
import StringUtils from "../../../utils/StringUtils";

let reportGeneration: ReportGeneration;
let FRAME_LOCATOR_TEXT = 'iframe[src*="wol-order-capture/live"]';
let ENTER_CUSTOMER: string = "input[placeholder='Search by Customer Name, Account Code or Postcode']";
let SELECT_CUSTOMER: string = "div[title='Select Customer...']";
let UPDATE_CUSTOMER: string = "//div[@title='O C O LTD **HRPC ONLY**']";
// Customer UI New Changes
let ENTER_PRODUCT: string = "#tbProductSearch input";
let CLICK_PRINT_CLOSE = "oj-button[title='Close']"
let PRINT_TEXT = ".oj-message-title"

setDefaultTimeout(300000);

export default class OrderCaptureUIPage {


    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async getIndexOfHeaderWithName(colname: string) {
        const getHeaderElements = this.web.getPage().locator("thead.oj-table-header th");
        let startIndex;
        for (let i = 0; i < await getHeaderElements.count(); i++) {
            const text = await getHeaderElements.nth(i).textContent();
            if (text.trim() == colname) {
                startIndex = i;
                break;
            }
        }
        return startIndex;
    }

    public async GetCustomerAccountStatusFromUI(statusToValidate: string) {
        const getAccountStatus = this.web.getPage().locator("div[title='" + statusToValidate + "']");
        return await getAccountStatus.textContent();
    }

    public async getColumnValueFromCustomerSelPanel(colname: string) {
        const getCustomerColValues = "tbody.oj-table-body tr td";
        return await this.web.getPage().locator(getCustomerColValues).nth(await this.getIndexOfHeaderWithName(colname)).innerText();
    }

    public async getCustomerSelectionValueFromUI(dataToMatch: string) {
        const getAccStatusValueFromUI = "div[title='" + dataToMatch + "']";
        return await this.web.getPage().locator(getAccStatusValueFromUI).textContent();
    }

    public async getCustomerAccountBalance() {
        const getAvailableBalanceFromUI = "oj-sp-scoreboard-metric-card[card-title='Available Balance'] div.oj-sp-scoreboard-metric-card-metric";
        return StringUtils.getStringAfterParticularStr((await this.web.getPage().locator(getAvailableBalanceFromUI).textContent()), '£');
    }


    public async SelectCustomer(customer: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").waitForElementToVisible(10)
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").clickWithTimeOut(5);
        // New Changes
        const clickOnCustomerDrpDwn = this.web.getPage().locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']");
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = this.web.getPage().locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = this.web.getPage().getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = this.web.getPage().locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
        const CustomerPO = this.web.getPage().locator("//oj-sp-scoreboard-metric-card[@card-title='Customer PO #']");
        await CustomerPO.click();
        const customerPOContentSlotSelection = this.web.getPage().locator("oj-c-input-text[label-hint='Customer Order Number'] input");
        await customerPOContentSlotSelection.fill('123456')
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer PO " + customer, world);

        await customerPOContentSlotSelection.press("Enter");
        const CustomerPOSave = this.web.getPage().locator("//oj-c-button[@id='btnSave']//button");
        await CustomerPOSave.click();

    }

    public async UpdatingCustomer(customer2: string){
        await this.web.element(UPDATE_CUSTOMER, "Update Customer").waitForElementToVisible(10);
        await this.web.element(UPDATE_CUSTOMER, "Update Customer").clickWithTimeOut(5);
        
        const clickOnCustomerDrpDwns = this.web.getPage().locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']");        
await expect(clickOnCustomerDrpDwns).toBeVisible({ timeout: 10000 });
        await clickOnCustomerDrpDwns.click();
        const customerSearchInput = (await this.web.getPageLocator('div.fake-dropdown')).first();
        await customerSearchInput.click();
        ((await this.web.getPageLocator("//input[@placeholder='Search by Customer Name, Account Code or Postcode']")).first()).fill(customer2);
        const selectCustomer = this.web.getPage().locator("//span[normalize-space()='7060F14']");
        await selectCustomer.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "After entering customer", world);

        await (this.web.getPage().locator("//button[@aria-label='Save']")).click({force:true});
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
        await reportGeneration.getScreenshot(this.web.getPage(), "After updating customer", world);

    }

    public async getCustomerAccountHeaderDetails(customer: string, colname: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").waitForElementToVisible(10)
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").clickWithTimeOut(5);
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        // New Changes
        const clickOnCustomerDrpDwn = this.web.getPage().locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: this.web.getPage().locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = this.web.getPage().locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        return await this.getColumnValueFromCustomerSelPanel(colname);
    }

    public async SaveCustomerSelection(customer: string) {
        const customerSearchResultsAvailable = this.web.getPage().locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = this.web.getPage().getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = this.web.getPage().locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }

    public async SelectProduct(product: string) {
        await this.web.element(ENTER_PRODUCT, 'Input for Product Info').setText(product);
        await expect(this.web.getPage().locator('span', { hasText: product }).nth(0)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await expect(await this.web.getPage().locator('span', { hasText: product }).nth(0)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After Entering Product " + product, world);
        (await this.web.getPage().locator('span', { hasText: product }).nth(0)).click({ timeout: 5000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Product " + product, world);
    }

    public async GetPriceOfTheProduct() {
        const getTextProductCount = await this.web.getPageLocator("span.oj-typography-body-md.oj-typography-bold")
        for (let i = 0; i < await getTextProductCount.count(); i++) {
            let getPriceText = await getTextProductCount.nth(i).innerText()
            if (/£\d+(\.\d{1,2})/.test(getPriceText)) {
                return getPriceText.trim();
            }
        }
    }

    public async AddProductsToBasket(product: string) {
        await expect((await this.web.getPageLocator("button[aria-label='Add']")).first()).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator("//div[@class='oj-listview-cell-element']")).click({timeout: 15000});
        ((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).click({ timeout: 15000 });
        //await .waitFor({state: 'visible' });
    //     const okButton = await this.web.getPageLocator("//button[@aria-label='OK']");
    // try {
    //     await okButton.waitFor({ state: 'visible', timeout: 30000 });
    //     await okButton.click();
    // } catch {
        
    //     //(await this.web.getPageLocator("//button[@aria-label='Back']")).last().click({timeout: 20000});
    // }
        await expect(await this.web.getPageLocator("button[aria-label='Clear All']")).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getPageLocator("button[aria-label='Clear All']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world);
    }

    public async AddKitToBasket(kit: string){
        await expect((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        ((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).click({ timeout: 20000 });
        // await expect((await this.web.getPageLocator("//div[contains(@class,'dialogContainerStyle')]//h1[normalize-space()='Kit Configurator']"))).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        // (await this.web.getPageLocator("//button[@aria-label='Add to Basket']")).click();
        //(await this.web.getPageLocator("//button[@aria-label='OK']")).click({timeout: 30000});

    //     const okButton = await this.web.getPageLocator("//button[@aria-label='OK']");
    // try {
    //     await okButton.waitFor({ state: 'visible', timeout: 3000 });
    //     await okButton.click();
    // } catch {
    //     // OK didn't appear → continue safely`
    // }
    //     await expect(await this.web.getPageLocator("button[aria-label='Clear All']")).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    //     (await this.web.getPageLocator("button[aria-label='Clear All']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    //     await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world); 
            await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + kit + " to basket", world);
      
    }

        public async AddVariableKitToBasket(kit: string){
        await expect((await this.web.getPageLocator("button[aria-label='Add']")).first()).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getPageLocator("button[aria-label='Add']")).click({timeout: 20000});  
        ((await this.web.getPageLocator("button[aria-label='Add to Basket']")).first()).click({ timeout: 20000 });
        (await this.web.getPageLocator("//div[@aria-label='MULTIFIT VERTICAL FLUE TERMINAL 60/100']")).click({timeout: 20000});
        (await this.web.getPageLocator("//div[@aria-label='@ EPH CP4D RF PROGRAMMABLE DIAL TSTAT']")).click({timeout: 20000});
        (await this.web.getPageLocator("//button[@aria-label='Add to Basket']")).click({timeout: 30000});

        // await expect((await this.web.getPageLocator("//div[contains(@class,'dialogContainerStyle')]//h1[normalize-space()='Kit Configurator']"))).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        // (await this.web.getPageLocator("//button[@aria-label='Add to Basket']")).click();
        //(await this.web.getPageLocator("//button[@aria-label='OK']")).click({timeout: 30000});

    //     const okButton = await this.web.getPageLocator("//button[@aria-label='OK']");
    // try {
    //     await okButton.waitFor({ state: 'visible', timeout: 3000 });
    //     await okButton.click();
    // } catch {
    //     // OK didn't appear → continue safely`
    // }
    //     await expect(await this.web.getPageLocator("button[aria-label='Clear All']")).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
    //     (await this.web.getPageLocator("button[aria-label='Clear All']")).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    //     await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world);
            await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + kit + " to basket", world);
      
    }

    public async IsProductAddedToBasket(product: string) {
        return await expect(await this.web.getElementByText(product)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        //await .waitFor({state: 'visible' });
    }

    public async IsKitAddedToBasket(kit: string){
        return await expect(await this.web.getElementByText(kit)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + kit + " to basket", world);

    }

    public async IsDeleteBtnAvailable() {
        await this.GetPriceOfTheProduct();
         await (this.web.getPage().locator("li.wolPanel", { hasText: await this.GetPriceOfTheProduct() })
        .locator("oj-c-button[display='label'] > button[aria-label='Delete']")).isVisible({timeout: 9000})
        await reportGeneration.getScreenshot(this.web.getPage(), "Validating the delete button", world);

 //       await (await this.web.getPageLocator("div.oj-sm-justify-content-space-between.oj-sm-align-items-center div oj-c-button[display='label'] button[aria-label='Delete']")).isVisible({ timeout: 9000 })
    }
    public async ClickingDeleteBtn(){
        await (await this.web.getPage().locator("//button[@aria-label='Actions for product R40001']")).click();
        await (await this.web.getPage().locator('[data-oj-key="move"]')).click();
    }

    public async IsMoveBtnAvailable() {
        await this.GetPriceOfTheProduct();
        await (this.web.getPage().locator("li.wolPanel", { hasText: await this.GetPriceOfTheProduct() })
        .locator("oj-c-button[display='label'] > button[aria-label='Move']")).isVisible({timeout: 9000})
//        await (await this.web.getPageLocator("div.oj-sm-justify-content-space-between.oj-sm-align-items-center div oj-c-button[display='label'] button[aria-label='Move']")).isVisible({ timeout: 9000 })
    }

    public async ClickOnBackBtnBasketPane(): Promise<void> {
        await (await this.web.getPageLocator("//oj-c-button[@label='Back']//button")).click();
        // await
    }

    public async WaitForCheckOutPopUp() {
        console.log(await (await this.web.getPageLocator("button[aria-label='Submit']")).isVisible())
        await expect(await this.web.getPageLocator("button[aria-label='Submit']")).toBeVisible({ timeout: 90000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "After clicking on Checkout", world);
        console.log("for Checkout heading " + await (await this.web.getElementByRolebyExactText('heading', 'Checkout')).isVisible())
        return await (await this.web.getPageLocator('h1.oj-sp-header-general-overview-page-title')).isVisible({ timeout: 15000 })
    }

    public async ClickOnConfirm(isPrintRequired: string) {
        if (isPrintRequired == "Yes") {
            (await this.web.getElementByRolebyExactText('button', 'Print')).click();
            await (await this.web.getPageLocator(PRINT_TEXT)).filter({ hasText: 'Printing picking note...' }).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
            await expect((await this.web.getPageLocator(PRINT_TEXT)).filter({ hasText: 'Printing picking note...' })).toBeVisible();
            await this.web.element(CLICK_PRINT_CLOSE, "Click on Print close").click();
            (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();
        } else {
            (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();
        }
    }

    public async ClickOnSubmitBthCheckOutPage() {
        await (await this.web.getPageLocator("button[aria-label='Submit']")).click();
    }

    public async CaptureOrderNumber() {
        await reportGeneration.getScreenshot(this.web.getPage(), "After Clicking on Confirm , Capture Order Number", world);
        return await (await this.web.getPageLocator('#oj_gop1_pageSubtitle')).textContent()
    }

    // public async IsOrderConfirmationPageLoaded(orderConfHeading: string) {
    //     try {
    //         //await this.web.getPage().waitForLoadState('domcontentloaded');
    //         const getOrderConfirmationHeadingEle = this.web.getPage().locator("#oj_gop1_pageTitle");
    //         await expect(getOrderConfirmationHeadingEle).toBeVisible({timeout:30000});
    //         await reportGeneration.getScreenshot(this.web.getPage(), "Order Confirmation Page for Order Number - " + await this.CaptureOrderNumber(), world);
    //         return await (getOrderConfirmationHeadingEle).textContent() == orderConfHeading;
    //     } catch (error) {
    //         console.log(error)
    //         return false;
    //     }
    // }

    public async IsOrderConfirmationPageLoaded(orderConfHeading: string): Promise<boolean> {
    try {
        await this.web.getPage().waitForLoadState('domcontentloaded')
        const getOrderConfirmationHeadingEle = this.web.getPage().locator("#oj_gop1_pageTitle");

        await expect(getOrderConfirmationHeadingEle).toBeVisible({ timeout: 30000 });

        await reportGeneration.getScreenshot(
            this.web.getPage(),
            "Order Confirmation Page for Order Number - " + await this.CaptureOrderNumber(),
            world
        );

        const actualHeading = (await getOrderConfirmationHeadingEle.textContent())?.trim();

        console.log("Expected Heading:", orderConfHeading);
        console.log("Actual Heading:", actualHeading);

        return actualHeading?.toLowerCase().includes(orderConfHeading.toLowerCase()) ?? false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

    public async IsCreateShipmentButtonDisplayed(buttonName: string): Promise<boolean> {
        await reportGeneration.getScreenshot(this.web.getPage(), "Create Shipment button displayed after submitting the Order " + await this.CaptureOrderNumber(), world);
        return await (await this.web.getPageLocator("button[aria-label='Create Shipment']")).isVisible({ timeout: 9000 });
        return false;
    }

    public async IsOrderSuccessSubmitMessageDisplayed(orderNumber: string) {
        await expect.poll(async () => {
            const count = await this.web.getPage()
                .locator('div.oj-message-summary.oj-message-title')
                .count();
            return count ?? 0;   // ensures a number is always returned
        }, {
            timeout: 5000
        }).toBeGreaterThan(0);


    }

    //** Below are the duplication methods of Order Capture UI , this will be used when the fix for navigating OC UI page 
    //    without login in to SSO  */

    public async SelectCustomerSCM(customer: string) {
        (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).getByText('Click to select a customer').waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).getByText('Click to select a customer').click({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        const clickOnCustomerDrpDwn = (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator("div[class='fake-dropdown oj-flex oj-sm-justify-content-space-between']").
            filter({ has: this.web.getPage().locator("//span[text()='Customer']") });
        await clickOnCustomerDrpDwn.click();
        const customerSearchInput = (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator("input[aria-label='Customer Search']");
        await customerSearchInput.fill(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
        const customerSearchResultsAvailable = (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator('oj-table.customer-table');
        await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 })
        const selectCustomerListed = (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).getByText(customer)
        await reportGeneration.getScreenshot(this.web.getPage(), "Select the Customer Listed for " + customer, world);
        await selectCustomerListed.click();
        const clickOnSaveOnSelectCusomter = (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator("button[aria-label='Save']");
        await clickOnSaveOnSelectCusomter.click();
        (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator("span[title*='" + customer + "']").waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getFrameLocatorObject(FRAME_LOCATOR_TEXT)).locator(".oj-badge-sm").waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "Customer selected as below  ", world);
    }

    public async AddAddressfor508200(){
        // const clickonThreeDots = this.web.getPage().locator("button[aria-label='Actions for collect basket group']");
        // await clickonThreeDots.click();
        await this.web.getPage().locator("//button[@aria-label='Actions for product 508200']").click({force : true});
        await this.web.getPage().locator('[data-oj-key="move"]').click();
        await (await this.web.getPageLocator('div[role="button"]:has(.wol-fulfillment-menu-item-subtitle)')).click();
        await (await this.web.getElementByLabel('Address line 1')).fill('Buckingham Palace');
        await (await this.web.getElementByLabel('City')).fill('London');
        await (await this.web.getElementByLabel('Postcode')).fill('SW1A 1AA');
        // await (await this.web.getPageLocator("//input[@id='_tp6mo83iof-input']")).fill('def', {timeout : 100000});
        // await (await this.web.getPageLocator("//input[@aria-describedby='_63444n6exyr-ua _7qcx3abu7pw']")).fill('def');
        // await (await this.web.getPageLocator("//input[@aria-describedby='_7bvyior3f0d-ua _6ikd8f23fiq']")).fill('def');
        // await (await this.web.getPageLocator("//input[@aria-describedby='_ckqtrqvxrzd-ua _ywc0qf8cgq']")).fill('def');
        await (await this.web.getElementByLabel('First name')).fill('def');
        await (await this.web.getElementByLabel('Surname')).fill('def');
        await (await this.web.getElementByLabel('Phone Number')).fill('+447123456789');
        await (await this.web.getElementByLabel('Email Address')).fill('newone@gmail.com');
        await reportGeneration.getScreenshot(this.web.getPage(), "Add address for the same", world);
//        await (await this.web.getElementByRolebyExactText('button', 'Add Item')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getElementByRolebyExactText('button', 'Continue')).click();
        await (await this.web.getElementByRolebyExactText('button','Confirm')).click({timeout: 90000});


    }

      public async AddAddress(){
        const clickonThreeDots = this.web.getPage().locator("button[aria-label='Actions for collect basket group']");
        await clickonThreeDots.click();
        //await this.web.getPage().locator("//button[@aria-label='Actions for product 508200']").click({force : true});
        await this.web.getPage().locator('[data-oj-key="move"]').click();
        await (await this.web.getPageLocator('div[role="button"]:has(.wol-fulfillment-menu-item-subtitle)')).click();
        await (await this.web.getElementByLabel('Address line 1')).fill('Buckingham Palace');
        await (await this.web.getElementByLabel('City')).fill('London');
        await (await this.web.getElementByLabel('Postcode')).fill('SW1A 1AA');
        // await (await this.web.getPageLocator("//input[@id='_tp6mo83iof-input']")).fill('def', {timeout : 100000});
        // await (await this.web.getPageLocator("//input[@aria-describedby='_63444n6exyr-ua _7qcx3abu7pw']")).fill('def');
        // await (await this.web.getPageLocator("//input[@aria-describedby='_7bvyior3f0d-ua _6ikd8f23fiq']")).fill('def');
        // await (await this.web.getPageLocator("//input[@aria-describedby='_ckqtrqvxrzd-ua _ywc0qf8cgq']")).fill('def');

        await (await this.web.getElementByLabel('First name')).fill('def');
        await (await this.web.getElementByLabel('Surname')).fill('def');
        await (await this.web.getElementByLabel('Phone Number')).fill('+447123456789');
        await (await this.web.getElementByLabel('Email Address')).fill('newone@gmail.com');
        await reportGeneration.getScreenshot(this.web.getPage(), "Add address for the same", world);
//        await (await this.web.getElementByRolebyExactText('button', 'Add Item')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getElementByRolebyExactText('button', 'Continue')).click();
        await (await this.web.getElementByRolebyExactText('button','Confirm')).click({timeout: 90000});
        await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));

    


    }

    public async CollectAndDeliveryBucket(){
        await expect(await this.web.getPageLocator("//span[text()='COLLECT']")).toBeVisible({timeout: 200000});
        await expect(await this.web.getPageLocator("//span[text()='DELIVERY']")).toBeVisible({timeout: 200000});
        await reportGeneration.getScreenshot(this.web.getPage(), "Collect and deliver bucket", world);

    }

    public async modeOfPayment(){
        await expect(await this.web.getPageLocator('p.oj-typography-bold')).toBeVisible({timeout : 10000});
        await (await this.web.getPageLocator('input[type="radio"][value="card"]')).click();
        await (await this.web.getPageLocator('input[id="customerNotPresentCheck"]')).click();
        
        
    }

    public async TickTheCheckbox(){
        await (await this.web.getPageLocator("//input[@id='customerNotPresentCheck']")).click();
    }


    
    public async ValidateCheckoutPage(){
        //await expect(await this.web.getElementByText('Checkout')).toBeVisible({timeout : 70000});
        await expect(await this.web.getPageLocator("#oj_gop1_pageTitle")).toBeVisible({timeout: 30000});
        await reportGeneration.getScreenshot(this.web.getPage(), "Checkout page", world);

        //await expect(await this.web.getPageLocator('')).toBeVisible({timeout : 10000});
    }
    
    public async AccountPaymentValidation(){
        await expect(await this.web.getPageLocator('p.oj-typography-bold')).toBeVisible({timeout : 10000});
        await (await this.web.getPageLocator("//span[@class='oj-button-text' and text()='Account']")).click();
        //await (await this.web.getPageLocator("//input[@id='customerNotPresentCheck']")).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "Payment Validation", world);

    }

    public async ClickonPlaceOrder(){
        const placeOrderButton = this.web.getPage().locator("button[aria-label='Place Order']");
        await placeOrderButton.click({timeout: 40000});
        await reportGeneration.getScreenshot(this.web.getPage(), "Click on place order", world);
        await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
        

    }

    public async VPEDPageVisibility(){
        const heading = this.web.getPage().locator("//div[@role='heading' and @aria-level='1']");
        await expect(heading).toBeVisible({timeout : 8000});
    }

    public async UpdatedAccNumber(){
        const AccountName = this.web.getPage().locator("//div[@title='SMITH AND BYFORD LTD']");
              // await expect(customerSearchResultsAvailable).toBeVisible({ timeout: 6000 }) 
        await expect(AccountName).toBeVisible({timeout : 20000});
        const AccountNumber = this.web.getPage().locator("//span[@title='7060F14 (Credit)']");
        await expect(AccountNumber).toBeVisible({timeout: 20000});
        await reportGeneration.getScreenshot(this.web.getPage(), "After updating customer", world);

    }
    public async IncrementProductQty(){
        const IncrementButton = this.web.getPage().locator("//button[@aria-label='Increase']").last();
        await IncrementButton.waitFor({state: 'visible', timeout: 30000 });
        await IncrementButton.click({force : true});
        await expect (this.web.getPage().locator("//input[@aria-valuenow='2']")).toHaveCount(1);
        await reportGeneration.getScreenshot(this.web.getPage(), "After icrementing the product quantity", world);

    }
    public async DecrementProductQty(){
        const DecrementButton = this.web.getPage().locator("//button[@aria-label='Decrease']").last();

         
        await DecrementButton.waitFor({state: 'visible'});        
        await DecrementButton.click({force : true});
            await expect (this.web.getPage().locator("//input[@aria-valuenow='1']")).toHaveCount(3);
        await reportGeneration.getScreenshot(this.web.getPage(), "After decrementing the product quantity", world);

    
    }
}      