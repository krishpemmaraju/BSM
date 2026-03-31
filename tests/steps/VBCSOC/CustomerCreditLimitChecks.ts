import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import Assert from "../../../src/asserts/Assert";
import type { ICustomWorld } from "../../../src/support/CustomWorld";
import { Frame, FrameLocator } from "playwright";

setDefaultTimeout(60 * 10 * 1000);

let accountStatusFromCustSel: any;
let accountStatusFromOCUI: any;
let frame: Frame;
Then('User should see Order Capture screen', async function (this: ICustomWorld) {
    frame = await this.web.getFrameByUrl("iframe[src*='wol-order-capture']")
    await frame.getByRole('heading', { name: 'Order Capture' }).waitFor({ state: 'visible', timeout: 30000 })
    console.log(await frame.locator("button[aria-label='Branch: 1BL']").textContent())
});

When('Select customer as {string} to get {string}', async function (this: ICustomWorld, customer, colHeaderValue) {
    accountStatusFromCustSel = await this.orderCaptureUISCMPage.getCustomerAccountHeaderDetails(frame, customer, colHeaderValue)
    await this.orderCaptureUISCMPage.SaveCustomerSelection(frame, customer);
});

Then('Should match with the Account Status as {string} on Order Capture UI', async function (this: ICustomWorld, statusOnOCUI) {
    if (statusOnOCUI != 'Cash Account') {
        accountStatusFromOCUI = await this.orderCaptureUISCMPage.GetCustomerAccountStatusFromUI(frame, statusOnOCUI);
        // accountStatusFromOCUI = accountStatusFromOCUI == "OK" ? "OK to Trade" : accountStatusFromOCUI;
        await Assert.assertEquals(accountStatusFromCustSel, accountStatusFromOCUI)
    }
});

Then('Available balance should display according to the {string}', async function (this: ICustomWorld, accountStatus) {
    if (accountStatus != 'Cash Account') {
        let availableBalance = await this.orderCaptureUISCMPage.getCustomerAccountBalance(frame);
        accountStatus == 'OK to Trade' ? await Assert.AssertTrue((parseFloat(availableBalance) > 0)) : await Assert.AssertTrue((parseFloat(availableBalance) <= 0))
    }
});


