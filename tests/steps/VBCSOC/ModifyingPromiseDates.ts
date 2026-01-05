import { Given, setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import SCMHomePage from "../../../src/webui/pages/scm/SCMHomePage";
import OrderManagementPage from "../../../src/webui/pages/scm/OrderManagementPage";
import Assert from "../../../src/asserts/Assert";
import OrderCaptureUIPage from "../../../src/webui/pages/vbcsoc/OrderCaptureUIPage";
import CreateOrderPage from "../../../src/webui/pages/scm/CreateOrderPage";
import DateUtils from "../../../src/utils/DateUtils";
import { get } from "https";


setDefaultTimeout(60 * 10 * 1000);

// Given('User signs in VBCS DEV', async function () {

// });

// Then('User should see the Order Capture Page Successfully', async function () {

// });

When('User navigate to Order Management', async function () {
   await this.scmHomePage.navigateToOrdermanagement();
});

When('User navigate to {string} Sub section', async function (subSectionMenu) {
   await this.orderManagementPage.navigateToSubSectionMenu(subSectionMenu);
});

// Then('User should see header {string} page', async function (headerTextToDisplay) {
//    await Assert.AssertTrue(await new OrderManagementPage(this.web).IsOrderCaptureUILoaded(headerTextToDisplay));
// });

// When('User clicks on Create Order', async function () {
// });

// Then('User should see Create Order page', async function () {

// });
/*
    These steps are for Order Creation from OCUI page
*/
// When('User select customer as {string}', async function (customer) { 

//    await new OrderCaptureUIPage(this.web).SelectCustomerSCM(customer);
// });

// When('Select order type as {string}', async function (string) {

// });

// When('User enter item as {string}', async function (string) {

// });

// When('click on Add', async function () {

// });

// Then('User should see {string} in item search results', async function (string) {

// });


// When('User clicks on submit on Create Order Page', async function () {

// });

// When('User should see Confirmation pop with order number', async function () {

// });

// When('User clicks on Done on Create Order Page', async function () {

// });

// Then('User should see Order Management page', async function () {

// });

// When('User search for the order created above', async function () {

// });

// Then('User should see the Manage Order page with Order created', async function () {

// });

When('User clicks on Create Order', async function () {
   await this.orderManagementPage.clickOnCreateOrderUnderSCMOM();
});

Then('User should see Create Order Page', async function () {
   await Assert.AssertTrue(await new CreateOrderPage(this.web).IsCreateOrderPageDisplayed());
});

When('User Select Customer as {string}', async function (customer: string) {
   await this.createOrderPage.SelectCustomerSCMOM(customer);
});

When('User select Order Type as {string}', async function (orderType: string) {
   await this.createOrderPage.SelectOrderType(orderType);
});

When('User search and add the product {string}', async function (product: string) {
   await this.createOrderPage.SelectProductSCMOM(product);
});

When('User click on Shipment Details option', async function () {
   await this.createOrderPage.ClickOnShipmentDetailsOrderLineSCMOM();
});

Then('User should see Shipment Details Page', async function () {
   await Assert.AssertTrue(await new CreateOrderPage(this.web).IsShipmentDetailsSectionSCMOM());
});

When('User navigate to supply tab under Shipment Details', async function () {
   await this.createOrderPage.NavigateToSupplyUnderShipmentDetailsSCMOM();
});

When('User enters {string} in warehouse dropdown', async function (location: string) {
   await this.createOrderPage.SelectWarehouseSupplyUnderShipmentDetailsSCMOM(location);
});

When('User clicks on submit under Shipment Details', async function () {
   await this.createOrderPage.ClickOnSubmitButtonSCMOM();
});

Then('User should see Sales Order Confirmation pop up', async function () {
   await Assert.AssertTrue(await new CreateOrderPage(this.web).IsConfirmationPopAvailableSCMOM());
});

Then('Capture the Requested Date for the Order Line', async function () {
   await this.createOrderPage.GetStringMatchNumbers();
});

When('User clicks on OK', async function () {
   await this.createOrderPage.ClickOkOnSOConfirmationPopUpSCMOM();
});


let IsOrderStatusCorrect: boolean = false;
let orderStatus: string;
When('User select Create Revision under actions dropdown', async function () {
   for (let i = 0; i < 40; i++) {
      orderStatus = await new CreateOrderPage(this.web).GetOrderStatusSCMOM();
      if (orderStatus == "Awaiting Shipping") {
         IsOrderStatusCorrect = true;
         break;
      }
      else
         await this.createOrderPage.ClickOnRefreshSCMOM();
   }
   if (!IsOrderStatusCorrect) {
      throw new Error("Order status is not 'Awaiting Shipping'. Skipping remaining steps.");
   } else {
      await this.createOrderPage.ClickOnCreateRevisionUnderSCMOM()
   }
});

let getRequestedDateBefore: string;
When('User selects Override Order Line', async function () {
   if (!IsOrderStatusCorrect) {
      throw new Error("Order status is not 'Awaiting Shipping'. Skipping remaining steps.");
   } else {
      getRequestedDateBefore = await this.createOrderPage.GetRequestedDateSCMOM();
      console.log("Request Date Before " + getRequestedDateBefore);
      await this.createOrderPage.ClickOnOverrideOrderLineActionsSCMOM();
   }
});

Then('User should see the Override Order Line pop up', async function () {
   if (!IsOrderStatusCorrect) {
      throw new Error("Order status is not 'Awaiting Shipping'. Skipping remaining steps.");
   } else {
      await Assert.AssertTrue(await this.createOrderPage.IsOverrideOrderLineVisible())
      await this.createOrderPage.ClickOnOverrideOrderLineSCMOM();
   }

});

let dateToChange: string;
When('User changes the Requested Date', async function () {
   if (!IsOrderStatusCorrect) {
      throw new Error("Order status is not 'Awaiting Shipping'. Skipping remaining steps.");
   } else {
      dateToChange = (await DateUtils.IncreaseDateByDaysWithFormat('DD/MM/YY HH:mm', 12)).toString();
      await this.createOrderPage.ChangeOrderRequestDateSCMOM(dateToChange);
   }
});

Then('User clicks on Ok', async function () {
   if (!IsOrderStatusCorrect) {
      throw new Error("Order status is not 'Awaiting Shipping'. Skipping remaining steps.");
   } else {
      await this.createOrderPage.ClickOnButtonWithAccessKeySCMOM();
      // loop until status changes to Awaiting Shipping
      for (let i = 0; i < 40; i++) {
         orderStatus = await this.createOrderPage.GetOrderStatusSCMOM();
         if (orderStatus == "Awaiting Shipping") {
            IsOrderStatusCorrect = true;
            break;
         }
         else
            await this.createOrderPage.ClickOnRefreshSCMOM();
      }
   }
});

Then('User should see pop up {string}', async function (string) {
   await Assert.AssertTrue(await this.createOrderPage.GetConfirmationTextAfterReqDateChangeSCMOM())
});

Then('User should see the Updated Requested Date under Order Line Details', async function () {
   let getUpdatedValue = await this.createOrderPage.GetRequestDateAfterChangeSCMOM();
      await Assert.AssertTrue(getUpdatedValue.split(' ')[0].includes(dateToChange.split(' ')[0]));
}); 
