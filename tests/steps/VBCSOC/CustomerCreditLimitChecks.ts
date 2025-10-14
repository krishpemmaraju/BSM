import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import CustomerSelectionPage from "../../../src/webui/pages/vbcsoc/CustomerSelectionPage";
import OrderCaptureUIPage from "../../../src/webui/pages/vbcsoc/OrderCaptureUIPage";
import Assert from "../../../src/asserts/Assert";

setDefaultTimeout(60 * 10 * 1000);

let accountStatusFromCustSel;
let accountStatusFromOCUI;
When('Select customer as {string} to get {string}', async function (customer, colHeaderValue) {
      accountStatusFromCustSel = await new OrderCaptureUIPage(this.web).getCustomerAccountHeaderDetails(customer,colHeaderValue)
      await new OrderCaptureUIPage(this.web).SaveCustomerSelection(customer);
});

Then('Should match with the Account Status as {string} on Order Capture UI', async function (statusOnOCUI) {
    accountStatusFromOCUI = await new OrderCaptureUIPage(this.web).GetCustomerAccountStatusFromUI(statusOnOCUI);
    // accountStatusFromOCUI = accountStatusFromOCUI == "OK" ? "OK to Trade" : accountStatusFromOCUI;
    await Assert.assertEquals(accountStatusFromCustSel,accountStatusFromOCUI)
});

Then('Available balance should display according to the {string}', async function (accountStatus) {
    let availableBalance = await new OrderCaptureUIPage(this.web).getCustomerAccountBalance();
    accountStatus == 'OK to Trade' ? await Assert.AssertTrue((parseFloat(availableBalance)>0)) : await Assert.AssertTrue((parseFloat(availableBalance)<=0))
});


