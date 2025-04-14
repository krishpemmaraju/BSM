import { Given, Then, When } from "@cucumber/cucumber";
import SelectDBHost from "../../src/webui/pages/reality/SelectDBHost";
import RealityLoginPage from "../../src/webui/pages/reality/RealityLoginPage";
import LoginIntoDBPage from "../../src/webui/pages/reality/LoginDBPage";
import Assert from "../../src/asserts/Assert";
import RealityActions from "../../src/webui/actions/RealityActions";
import SalesOrderProcessingPage from "../../src/webui/pages/reality/SalesOrderingProcessingPage";

Given('User select the DBHost as {string}', async function (dbHost) {
    await new SelectDBHost(this.web).selectDBHost(dbHost);
});

When('User login with valid {string} and {string}', async function (username, password) {
    await new RealityLoginPage(this.web.getPage()).loginIntoRealityPage(username,password);
    await new LoginIntoDBPage(this.web.getPage()).selectDB('Enter choice','DB91','.');
});

Then('User should see {string} menu', async function (menuOption) {
    await Assert.AssertTrue(await new RealityActions(this.web.getPage()).isRealityMenuPresent(menuOption));
});

When('User enters option for Logto Branch as {string}', async function (branch) {
    await new LoginIntoDBPage(this.web.getPage()).logToBranch(branch);
  });

When('User enter option for {string}', async function (salesOrderProcessing) {
    await new SalesOrderProcessingPage(this.web.getPage()).enterOptionSalesOrderProcessing(salesOrderProcessing);
});