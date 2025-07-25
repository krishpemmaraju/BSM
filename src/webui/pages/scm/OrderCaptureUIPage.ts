import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

let reportGeneration: ReportGeneration;
let ENTER_CUSTOMER: string = "input[placeholder='Search by Customer Name, Account Code or Postcode']";
let SELECT_CUSTOMER: string = "div[title='Select Customer...']";
let ENTER_PRODUCT:string= "input[placeholder='Search by Product Code, Description, Supplier Part Code or Barcode']";
let CLICK_PRINT_CLOSE = "oj-button[title='Close']"
let PRINT_TEXT = ".oj-message-title"

setDefaultTimeout(60 * 10 * 1000);

export default class OrderCaptureUIPage {


    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async SelectCustomer(customer: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").clickWithTimeOut(5);
        await reportGeneration.getScreenshot(this.web.getPage(), "Selecting Customer " + customer, world);
        await this.web.element(ENTER_CUSTOMER,'Input for Customer Search').setText(customer);
        await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer " + customer, world);
     //   await this.web.RetryElementFindingsByRoleText( customer,'visible',3,TEST_CONFIG.TIMEOUTS.element);
        console.log( await (await this.web.getElementByText(customer)).isVisible())
        if(await (await this.web.getElementByText(customer)).isVisible()){
            await reportGeneration.getScreenshot(this.web.getPage(), "Enter Customer is visible " + customer, world);
            await (await this.web.getElementByText(customer)).waitFor({state:'attached',timeout: TEST_CONFIG.TIMEOUTS.element});
        }else{
            await this.web.getPage().reload();
            await this.web.element(ENTER_CUSTOMER,'Input for Customer Search').setText(customer);
            await (await this.web.getElementByText(customer)).waitFor({state:'attached',timeout: TEST_CONFIG.TIMEOUTS.element});
        }
        await (await this.web.getElementByText(customer)).click({timeout:TEST_CONFIG.TIMEOUTS.element});
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Customer " + customer, world);
    }

    public async SelectProduct(product: string) {
        await this.web.element(ENTER_PRODUCT,'Input for Product Info').setText(product);
        await expect (await this.web.getElementByText(product)).toBeVisible({timeout: TEST_CONFIG.TIMEOUTS.element});
        await reportGeneration.getScreenshot(this.web.getPage(), "After Entering Product " + product, world);
        (await this.web.getElementByText(product)).click({timeout: 5000});
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Product " + product, world);
    }

    public async AddProductsToBasket(product: string) {
        await expect(await this.web.getElementByRolebyExactText('button', 'Add to Basket')).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getElementByRolebyExactText('button', 'Add to Basket')).click({timeout: 5000});
        await expect(await this.web.getElementByRolebyExactText('button', 'Clear All')).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getElementByRolebyExactText('button', 'Clear All')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world);
    }

    public async IsProductAddedToBasket(product: string){
        return await expect (await this.web.getElementByText(product)).toBeVisible({timeout:TEST_CONFIG.TIMEOUTS.element});
    }

    public async WaitForCheckOutPopUp() {
      //  await this.web.RetryElementFindingsByRole('button','Confirm','enable',2,TEST_CONFIG.TIMEOUTS.element);
        await expect(await this.web.getElementByRolebyExactText('button', 'Confirm')).toBeEnabled({ timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After clicking on Submit", world);
        return (await this.web.getElementByRolebyExactText('heading','Checkout')).isVisible({timeout:TEST_CONFIG.TIMEOUTS.element});
    }

    public async ClickOnConfirm(isPrintRequired: string) {
        if( isPrintRequired == "Yes"){
          (await this.web.getElementByRolebyExactText('button','Print')).click();
          await (await this.web.getPageLocator(PRINT_TEXT)).filter({hasText:'Printing...'}).waitFor({state:'visible',timeout:TEST_CONFIG.TIMEOUTS.element});
          await expect ((await this.web.getPageLocator(PRINT_TEXT)).filter({hasText:'Printing...'})).toBeVisible();
          await this.web.element(CLICK_PRINT_CLOSE,"Click on Print close").click();
          (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();
        }else{
        (await this.web.getElementByRolebyExactText('button', 'Confirm')).click();}
    }

    public async CaptureOrderNumber() {
        await reportGeneration.getScreenshot(this.web.getPage(), "After Clicking on Confirm , Capture Order Number", world);
        return this.web.element('#oj_gop1_h_pageSubtitle', 'Capture the Order Number').getTextValue();
    }

    public async IsOrderConfirmationPageLoaded(orderConfHeading: string): Promise<boolean> {
        await reportGeneration.getScreenshot(this.web.getPage(), "Order Confirmation Page for Order Number - " + await this.CaptureOrderNumber(), world);
        return await (await this.web.getElementByRolebyExactText('heading', orderConfHeading)).textContent() == orderConfHeading;
    }
}      