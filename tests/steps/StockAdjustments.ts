import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import SCMLoginPage from "../../src/webui/pages/scm/SCMLoginPage";
import * as data from "../../src/config/env/envDetails.json"
import Assert from "../../src/asserts/Assert";
import SCMHomePage from "../../src/webui/pages/scm/SCMHomePage";
import InventoryManagementPage from "../../src/webui/pages/scm/InventoryManagementPage";
import CreateMiscellaneousTransactions from "../../src/webui/pages/scm/CreateMiscellaneousTransactionsPage";
import { Console } from "console";

setDefaultTimeout(60 * 1000 * 2);

let getExistingSOH: number;
let getTransactionQty: number;
let getNewSOH: number;
let transactionType: string="";


Given('User login into SCM application', async function () {
   await new SCMLoginPage(this.web).loginIntoSCMApp(data.SCMDEV[0].SCMDEVURL, data.SCMDEV[0].SCMDEVUSERNAME, data.SCMDEV[0].SCMDEVPASSWORD);
   Assert.AssertTrue(await new SCMHomePage(this.web).isHomePageDisplayed());
});

When('User navigate to Inventory Management', async function () {
   await new SCMHomePage(this.web).navigateToInventoryManagement();
   const getInvMgmtHeaderText = await new InventoryManagementPage(this.web).getInventoryManagmentDashboardHeader();
   await Assert.assertEquals("Inventory Management", getInvMgmtHeaderText);
});

When('User clicks on Item Quantities- under Actions', async function () {
   await new InventoryManagementPage(this.web).ClickOnItemQuantities();
});


When('User enter {string} to search for existing availability', async function (product) {
   await new InventoryManagementPage(this.web).SearchProductExistingStock(product);
});



Then('User should see deatils of existing stock values', async function () {
   getExistingSOH = Number(await new InventoryManagementPage(this.web).GetExistingSOH("On Hand"));
});

When('User clicks on Create Miscellaneous Transactions', async function () {
   await new CreateMiscellaneousTransactions(this.web).ClickOnMiscellaneousTransactions();
});


Then('User should see {string} dashboard', async function (MiscellaneousTransDashboardHeader) {
   await Assert.AssertTrue(await new CreateMiscellaneousTransactions(this.web).IsMiscellaneousTransactionsHeaderVisible(MiscellaneousTransDashboardHeader));
});


When('User clicks on Edit icon', async function () {
   await new CreateMiscellaneousTransactions(this.web).ClickOnEditIcon();
});

When('User select Transaction Type as {string} and Account Alias as {string} and click on Save', async function (transactionType, accountAlias) {
   this.transactionType = transactionType;
   await new CreateMiscellaneousTransactions(this.web).SelectTransactionType(transactionType,accountAlias);
 });


Then('User should see option to {string}', async function (addItemBtn) {
   Assert.AssertTrue(await new CreateMiscellaneousTransactions(this.web).IsAddItemButtonAvailable(addItemBtn));
});


When('User clicks on {string} button', async function (addItemBtn) {
   await new CreateMiscellaneousTransactions(this.web).ClickOnAddItemButton(addItemBtn);
});

When('User enter product as {string}', async function (product) {
   await new CreateMiscellaneousTransactions(this.web).EnterProductInfo(product);
});


When('User select subinventory as {string}', async function (subInventory) {
   await new CreateMiscellaneousTransactions(this.web).SelectSubInventory(subInventory);
});


When('User enter quantity as {string}', async function (quantity) {
   await new CreateMiscellaneousTransactions(this.web).EnterProductQuantity(quantity);
});


When('User select reason code as {string} from Additional Fields', async function (reasonCode) {
   await new CreateMiscellaneousTransactions(this.web).SelectReason(reasonCode);
});

When('User enter Product Reference as {string}', async function (reference) {
   await new CreateMiscellaneousTransactions(this.web).EnterProductRefrence(reference);
});



When('User clicks on Done', async function () {
   await new CreateMiscellaneousTransactions(this.web).ClickOnDoneBtn();
});


Then('User should see {string} dashboard with line details', async function (string) {
   getTransactionQty = Number(await new InventoryManagementPage(this.web).GetExistingSOH("Transaction Quantity"))
});


When('User clicks on submit', async function () {
   await new CreateMiscellaneousTransactions(this.web).ClickOnSubmit();
});

Then('User should see pop up as {string}', async function (textToBeDisplayed) {
   Assert.assertContains(await new CreateMiscellaneousTransactions(this.web).GetItemReceivedTextDisplayed(textToBeDisplayed), textToBeDisplayed);
   getNewSOH = Number(await new InventoryManagementPage(this.web).GetExistingSOH("On Hand"));
   if (transactionType == "Account Alias Receipt") {
      Assert.assertEqualsInt((getExistingSOH + getTransactionQty), getNewSOH);
   }
   if (transactionType == "Account Alias Issue") {
      Assert.assertEqualsInt((getExistingSOH - getTransactionQty), getNewSOH);
   }

});