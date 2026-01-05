import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import OrderCaptureUIPage from "../../../src/webui/pages/vbcsoc/OrderCaptureUIPage";
import SCMHomePage from "../../../src/webui/pages/scm/SCMHomePage";
import Assert from "../../../src/asserts/Assert";
import JSONUtils from "../../../src/utils/JSONUtils";
import VBSOCHomePage from "../../../src/webui/pages/vbcsoc/VBSOCHomePage";

setDefaultTimeout(60 * 10 * 1000);
let productInfo: string;
let filePath: string = "src/data/OrderCaptureData/OrderCaptureData.json"

When('User navigate to Wolseley Order Capture', async function () {
    await this.scmHomePage.NavigateToOrderCaptureUI();
});


Then('User should see Order Capture dashboard', async function () {
    Assert.AssertTrue(await this.vbsocHomePage.IsOrderCaptureUILoaded())
});


When('Select customer as {string}', async function (customer) {
    await this.orderCaptureUIPage.SelectCustomer(customer);
});


 When('Search  and add  {string} to basket', async function (product){
    productInfo = product;
    if (productInfo.includes(',')) {
        let productsData = productInfo.split(',');
        for (const prod of productsData) {
            await this.orderCaptureUIPage.SelectProduct(prod);
            await this.orderCaptureUIPage.AddProductsToBasket(prod);
            await this.orderCaptureUIPage.IsProductAddedToBasket(prod);
        }

    } else {
        await this.orderCaptureUIPage.SelectProduct(product);
        await this.orderCaptureUIPage.AddProductsToBasket(product);
        await this.orderCaptureUIPage.IsProductAddedToBasket(product);
    }
});


Then('User should see Checkout popup', async function () {
    Assert.AssertTrue(await this.orderCaptureUIPage.WaitForCheckOutPopUp());
});


When('User Clicks on Confirm depends on {string}', async function (isPrintRequired) {
    await this.orderCaptureUIPage.ClickOnConfirm(isPrintRequired);
  });

Then('Capture the Order Number', async function () {
    let orderNumber = await this.orderCaptureUIPage.CaptureOrderNumber();
    const result = new Date();
    await JSONUtils.WriteJsonFileNotArray(filePath, 'OrderNumber-' + productInfo + "-" + result.getDate() + (result.getMonth() + 1) + result.getMinutes() + result.getSeconds(), orderNumber);
});

Then('User Should see {string} page', async function (OrderConfirmPage) {
    Assert.AssertTrue(await this.orderCaptureUIPage.IsOrderConfirmationPageLoaded(OrderConfirmPage));
});
