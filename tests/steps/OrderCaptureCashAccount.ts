import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import OrderCaptureUIPage from "../../src/webui/pages/scm/OrderCaptureUIPage";
import SCMHomePage from "../../src/webui/pages/scm/SCMHomePage";
import Assert from "../../src/asserts/Assert";
import JSONUtils from "../../src/utils/JSONUtils";

setDefaultTimeout(60 * 10 * 1000);
let productInfo: string;
let filePath: string = "src/data/OrderCaptureData/OrderCaptureData.json"

When('User navigate to Wolseley Order Capture', async function () {
    await new SCMHomePage(this.web).NavigateToOrderCaptureUI();
});


Then('User should see Order Capture dashboard', async function () {
    Assert.AssertTrue(await new SCMHomePage(this.web).IsOrderCaptureUILoaded())
});


When('Select customer as {string}', async function (customer) {
    await new OrderCaptureUIPage(this.web).SelectCustomer(customer);
});


When('Search for {string}', async function (product) {
    productInfo = product;
    if (productInfo.includes(',')) {
        let productsData = productInfo.split(',');
        for (const prod of productsData) {
            await new OrderCaptureUIPage(this.web).SelectProduct(prod);
            await new OrderCaptureUIPage(this.web).AddProductsToBasket(prod);
            await new OrderCaptureUIPage(this.web).IsProductAddedToBasket(prod);
        }

    } else {
        await new OrderCaptureUIPage(this.web).SelectProduct(product);
        await new OrderCaptureUIPage(this.web).AddProductsToBasket(product);
        await new OrderCaptureUIPage(this.web).IsProductAddedToBasket(product);
    }
});



When('add products {string} to the basket', async function (product) {
    if(!product.includes(',')){
    await new OrderCaptureUIPage(this.web).AddProductsToBasket(product);}
});



Then('User should see {string} added to the basket list', async function (product) {
    if(!product.includes(',')){
    await new OrderCaptureUIPage(this.web).IsProductAddedToBasket(product); }
});


Then('User should see Checkout popup', async function () {
    Assert.AssertTrue(await new OrderCaptureUIPage(this.web).WaitForCheckOutPopUp());
});


When('User Clicks on Confirm depends on {string}', async function (isPrintRequired) {
    await new OrderCaptureUIPage(this.web).ClickOnConfirm(isPrintRequired);
  });

Then('Capture the Order Number', async function () {
    let orderNumber = await new OrderCaptureUIPage(this.web).CaptureOrderNumber();
    const result = new Date();
    await JSONUtils.WriteJsonFileNotArray(filePath, 'OrderNumber-' + productInfo + "-" + result.getDate() + (result.getMonth() + 1) + result.getMinutes() + result.getSeconds(), orderNumber);
});

Then('User Should see {string} page', async function (OrderConfirmPage) {
    Assert.AssertTrue(await new OrderCaptureUIPage(this.web).IsOrderConfirmationPageLoaded(OrderConfirmPage));
});
