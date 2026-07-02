import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import Assert from "../../../src/asserts/Assert";
import JSONUtils from "../../../src/utils/JSONUtils";
import type { ICustomWorld } from "../../../src/support/CustomWorld";
import { sharedData } from "../../../src/support/SharedData";
import { CustomerSalesOrderData } from "../../../src/support/CustomerSalesOrderData";

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

When('Update the customer name to {string}',async function (this: ICustomWorld, customer2){
    await this.orderCaptureUIPage.UpdatingCustomer(customer2)
})



When('Search  and add  {string} to the basket', async function (this: ICustomWorld, product) {
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

When('Search and add {string} to basket', async function(this: ICustomWorld, kit){
    await this.orderCaptureUIPage.SelectProduct(kit);
    await this.orderCaptureUIPage.AddKitToBasket(kit);
    await this.orderCaptureUIPage.IsKitAddedToBasket(kit);
    await this.orderCaptureUIPage.ClickOnBackBtnBasketPane();
    

})

When('Search and add variable {string} to basket', async function(this: ICustomWorld, kit){
    await this.orderCaptureUIPage.SelectProduct(kit);
    await this.orderCaptureUIPage.AddVariableKitToBasket(kit);
    await this.orderCaptureUIPage.IsKitAddedToBasket(kit);
    //await this.orderCaptureUIPage.ClickOnBackBtnBasketPane();
    

})

Then('Increment the product qty', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.IncrementProductQty();
})

Then('Decrement the product qty',async function(this: ICustomWorld){
    await this.orderCaptureUIPage.DecrementProductQty();
})

Then('Delete the product qty',async function(this: ICustomWorld){
    await this.orderCaptureUIPage.IsDeleteBtnAvailable();
})

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

// Then('User Should see {string} page', async function (this: ICustomWorld, OrderConfirmPage) {
//     await Assert.AssertTrue(await this.orderCaptureUIPage.IsOrderConfirmationPageLoaded("Confirmation"));
// });

Then(
  'User Should see {string} page',
  async function (this: ICustomWorld, OrderConfirmPage: string) {
    await Assert.AssertTrue(
      await this.orderCaptureUIPage.IsOrderConfirmationPageLoaded(OrderConfirmPage)
    );
  }
);

// Then('User Should see {string} page', async function (this: ICustomWorld, OrderConfirmPage): Promise<boolean> {
//     await Assert.AssertTrue(await this.orderCaptureUIPage.IsOrderConfirmationPageLoaded(OrderConfirmPage));
// });

// Then('User Should see "Confirmation" page', async function (this: ICustomWorld){

// })


Then('User Should see {string} button', async function (this: ICustomWorld, buttonName){
    await Assert.AssertTrue(await this.orderCaptureUIPage.IsCreateShipmentButtonDisplayed(buttonName));

});

When('Add delivery address', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.AddAddress();
})

When('Add delivery address for 508200',async function (this:ICustomWorld){
    await this.orderCaptureUIPage.AddAddressfor508200();
});

Then('User should see collect bucket and a delivery bucket', async function(this:ICustomWorld){
    await this.orderCaptureUIPage.CollectAndDeliveryBucket();
})

When('User should see Checkout Page', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.ValidateCheckoutPage();
});

When('User should choose account payment', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.AccountPaymentValidation();
})


When('User Click on Place Order', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.ClickonPlaceOrder();
})

Then('User should see the VPED page', async function(this: ICustomWorld){
    await this.orderCaptureUIPage.VPEDPageVisibility();
})

// Then('Add delivery address',async function(this: ICustomWorld){
//     await this.orderCaptureUIPage.AddAddress();
// });

// Then('User Click on Place Order', async function(this: ICustomWorld){
//    // await Assert.AssertTrue(await this.orderCaptureUIPage.ClickonPlaceOrderButton());
//    await this.orderCaptureUIPage.ClickonPlaceOrderButton(); 
// });

// Then('User should see Checkout Page',async function(this: ICustomWorld){

// });

Then('User should choose card payment',async function(this: ICustomWorld){
    await this.orderCaptureUIPage.modeOfPayment();
})

Then('User should tick the checkbox',async function(this: ICustomWorld){
    await this.orderCaptureUIPage.TickTheCheckbox();
})
Then('User should be able to see the updated account number and name',async function(this: ICustomWorld){
    await this.orderCaptureUIPage.UpdatedAccNumber();
})
