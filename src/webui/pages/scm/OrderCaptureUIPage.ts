import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";
import Assert from "../../../asserts/Assert";

let reportGeneration: ReportGeneration;
let ENTER_CUSTOMER: string = "input[placeholder='Search by Customer Name, Account Code or Postcode']";
let SELECT_CUSTOMER: string = "div[title='Select Customer...']";
let ENTER_PRODUCT:string= "input[placeholder='Search by Product Code, Description, Supplier Part Code or Barcode']";
let CLICK_PRINT_CLOSE = "oj-button[title='Close']"
let PRINT_TEXT = ".oj-message-title"

export default class OrderCaptureUIPage {


    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async SelectCustomer(customer: string) {
        await this.web.element(SELECT_CUSTOMER, "Click to Select Customer").click();
        await this.web.element(ENTER_CUSTOMER,'Input for Customer Search').setText(customer);
        await (await this.web.getElementByText(customer)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Customer " + customer, world);
    }

    public async SelectProduct(product: string) {
        await this.web.element(ENTER_PRODUCT,'Input for Product Info').setText(product);
        (await this.web.getElementByText(product)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "After Selecting Product " + product, world);
    }

    public async AddProductsToBasket(product: string) {
        (await this.web.getElementByRolebyExactText('button', 'Add to Basket')).click();
        await expect(await this.web.getElementByRolebyExactText('button', 'Clear All')).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.element });
        (await this.web.getElementByRolebyExactText('button', 'Clear All')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "After adding " + product + " to basket", world);
    }

    public async IsProductAddedToBasket(product: string){
        return await expect (await this.web.getElementByText(product)).toBeVisible({timeout:TEST_CONFIG.TIMEOUTS.element});
    }

    public async WaitForCheckOutPopUp() {
        await this.web.RetryElementFindingsByRole('button','Confirm','enable',2,TEST_CONFIG.TIMEOUTS.element);
     //   await expect(await this.web.getElementByRolebyExactText('button', 'Confirm')).toBeEnabled({ timeout: TEST_CONFIG.TIMEOUTS.element });
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
        return this.web.element('#oj_gop1_h_pageSubtitle', 'Capture the Order Number').getTextValue();
    }

    public async IsOrderConfirmationPageLoaded(orderConfHeading: string): Promise<boolean> {
        return await (await this.web.getElementByRolebyExactText('heading', orderConfHeading)).textContent() == orderConfHeading;
    }
}      