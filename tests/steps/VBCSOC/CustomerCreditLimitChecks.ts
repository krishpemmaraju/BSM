import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import CustomerSelectionPage from "../../../src/webui/pages/vbcsoc/CustomerSelectionPage";
import OrderCaptureUIPage from "../../../src/webui/pages/vbcsoc/OrderCaptureUIPage";
import Assert from "../../../src/asserts/Assert";

setDefaultTimeout(60 * 10 * 1000);

let accountStatusFromCustSel;
let accountStatusFromOCUI;
When('Select customer as {string} to get {string}', async function (customer, colHeaderValue) {
    accountStatusFromCustSel = await this.orderCaptureUIPage.getCustomerAccountHeaderDetails(customer, colHeaderValue)
    await new OrderCaptureUIPage(this.web).SaveCustomerSelection(customer);
});

Then('Should match with the Account Status as {string} on Order Capture UI', async function (statusOnOCUI) {
    if (statusOnOCUI != 'Cash Account') {
        accountStatusFromOCUI = await this.orderCaptureUIPage.GetCustomerAccountStatusFromUI(statusOnOCUI);
        // accountStatusFromOCUI = accountStatusFromOCUI == "OK" ? "OK to Trade" : accountStatusFromOCUI;
        await Assert.assertEquals(accountStatusFromCustSel, accountStatusFromOCUI)
    }
});

Then('Available balance should display according to the {string}', async function (accountStatus) {
    if (accountStatus != 'Cash Account') {
        let availableBalance = await this.orderCaptureUIPage.getCustomerAccountBalance();
        accountStatus == 'OK to Trade' ? await Assert.AssertTrue((parseFloat(availableBalance) > 0)) : await Assert.AssertTrue((parseFloat(availableBalance) <= 0))
    }
});


