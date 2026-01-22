import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import Assert from "../../../src/asserts/Assert";
import JSONUtils from "../../../src/utils/JSONUtils";
import type { ICustomWorld } from "../../../src/support/CustomWorld";

setDefaultTimeout(300000);
let productInfo: string;
let filePath: string = "src/data/OrderCaptureData/OrderCaptureData.json"

When('User navigate to Wolseley Order Capture', async function (this: ICustomWorld) {
    await this.scmHomePage.NavigateToOrderCaptureUI();
});


Then('User should see Order Capture dashboard', async function (this: ICustomWorld) {
    //  await Assert.AssertTrue(await this.scmWolOrderCaptureHomePage.IsSCMWolOrderCapturePageDisplayed())
    Assert.AssertTrue(await this.vbsocHomePage.IsOrderCaptureUILoaded())
});


When('Select customer as {string}', async function (this: ICustomWorld, customer) {
    await this.orderCaptureUIPage.SelectCustomer(customer);
});


When('Search  and add  {string} to basket', async function (this: ICustomWorld, product) {
    productInfo = product;
    if (productInfo.includes(',')) {
        let productsData = productInfo.split(',');
        for (const prod of productsData) {
            await this.orderCaptureUIPage.SelectProduct(prod);
            await this.orderCaptureUIPage.AddProductsToBasket(prod);
            await this.orderCaptureUIPage.IsProductAddedToBasket(prod);
            await this.orderCaptureUIPage.IsDeleteBtnAvailable();
            await this.orderCaptureUIPage.IsMoveBtnAvailable();
            await this.orderCaptureUIPage.ClickOnBackBtnBasketPane();
        }

    } else {
        await this.orderCaptureUIPage.SelectProduct(product);
        await this.orderCaptureUIPage.AddProductsToBasket(product);
        await this.orderCaptureUIPage.IsProductAddedToBasket(product);
        await this.orderCaptureUIPage.IsDeleteBtnAvailable();
        await this.orderCaptureUIPage.IsMoveBtnAvailable();
        await this.orderCaptureUIPage.ClickOnBackBtnBasketPane();
    }
});


Then('User should see Checkout popup', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.orderCaptureUIPage.WaitForCheckOutPopUp());
});


When('User Clicks on Confirm depends on {string}', async function (this: ICustomWorld, isPrintRequired) {
    await this.orderCaptureUIPage.ClickOnSubmitBthCheckOutPage();
});

let orderNumber: any
Then('Capture the Order Number', async function (this: ICustomWorld) {
    orderNumber = await this.orderCaptureUIPage.CaptureOrderNumber();
    const result = new Date();
    await JSONUtils.WriteJsonFileNotArray(filePath, 'OrderNumber-' + productInfo + "-" + result.getDate() + (result.getMonth() + 1) + result.getMinutes() + result.getSeconds(), orderNumber);
});

Then('User Should see {string} page', async function (this: ICustomWorld, OrderConfirmPage) {
    await Assert.AssertTrue(await this.orderCaptureUIPage.IsOrderConfirmationPageLoaded(OrderConfirmPage));
});

Then('User Should see {string} button', async function (this: ICustomWorld, buttonName) {
    await Assert.AssertTrue(await this.orderCaptureUIPage.IsCreateShipmentButtonDisplayed(buttonName));

});
