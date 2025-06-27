import { TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";

setDefaultTimeout(60 * 10 * 1000);


let reportGeneration: ReportGeneration;
let PROD_SEARCH_INPUT: string = "#tbProductSearch";
let CLICK_ON_QUICK_ENTRY: string = ".oj-ux-ico-terminal";
let UPLOAD_FILE: string = "input[type='file']";
let GET_PROD_INFO: string = "div.product-popup-info span.oj-text-color-secondary"
export default class QuickOrderEntryPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }

    public async ClickOnQuickOrderEntry(){
        await this.web.element(PROD_SEARCH_INPUT,'CLICK ON INPUT SEARCH').click();
        await (await this.web.getElementByText('Quick Entry')).isVisible({timeout: TEST_CONFIG.TIMEOUTS.element});
        await this.web.element(CLICK_ON_QUICK_ENTRY,'CLICK ON QUICK ORDER ENTRY').click();
        await reportGeneration.getScreenshot(this.web.getPage(),'AFTER CLICKING ON QUICK ORDER ENTRY',world);
    }

    public async isQuickOrderEntryPageDisplayed(): Promise<boolean> {
       return  (await this.web.getElementByRolebyExactText('button','Clear All')).isVisible();
    }

    public async EnterProductData(products: string){
        if (products.includes(',')) {
            let productsData = products.split(',');
            for (const prod of productsData) {
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').click();
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').setType(prod);
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').getLocator().press('Enter');
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').getLocator().press('Enter');   
            }
            await (await this.web.getElementByRolebyExactText('button','Add to Basket')).click();
        }else{
            const getTextAreaLoc = (await this.web.getPageLocator('.wol-quick-entry-panel'));
                await getTextAreaLoc.filter({has: this.web.getPage().locator('#textarea-main')}).click();
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').setText(products);
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').getLocator().press('Enter');
                await this.web.element('#textarea-main','ENTER TEXT IN TEXTAREA').getLocator().press('Enter');
                await (await this.web.getElementByRolebyExactText('button','Add to Basket')).click();
        }
    }

    public async UploadFileOrderEntry(filePath: string){
        await this.web.element(UPLOAD_FILE,'UPLOADING FILE').getLocator().setInputFiles(filePath);
    }

    public async GetProductsListAfterUpload():Promise<string[]>{
        let products: string[] = [];
        const getProductLocators =  this.web.getPage().locator(GET_PROD_INFO);
        for(let i=0; i<await getProductLocators.count();i++){
            const loc = await getProductLocators.nth(i);
            products.push(await loc.textContent());
        }
        return products;
    }
    
    public async ClickOnAddToBasket(){
        await (await this.web.getElementByRolebyExactText('button','Add to Basket')).click();
    }
}