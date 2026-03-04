import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import SCMLoginPage from "../../../src/webui/pages/scm/SCMLoginPage";
import Assert from "../../../src/asserts/Assert";
import SCMHomePage from "../../../src/webui/pages/scm/SCMHomePage";
import type { ICustomWorld } from "../../../src/support/CustomWorld";

setDefaultTimeout(3000000);

let getExistingSOH: number;
let getTransactionQty: number;
let getNewSOH: number;
let transactionType: string = "";


Given('User login into SCM application', async function (this:ICustomWorld) {
   await this.scmLoginPage.loginIntoSCMApp(this.SCMURL, this.SCMUSER, this.SCMPASSWORD);
   await Assert.AssertTrue(await new SCMHomePage(this.web).isHomePageDisplayed());
});

When('User navigate to Inventory Management', async function (this:ICustomWorld) {
   await this.scmHomePage.navigateToInventoryManagement();
   const getInvMgmtHeaderText = await this.inventoryManagamentPage.getInventoryManagmentDashboardHeader();
   await Assert.assertEquals("Inventory Management", getInvMgmtHeaderText??'');
});

When('Select the {string} on InventoryManagement Screen', async function (this:ICustomWorld,branchSel) {
   await this.inventoryManagamentPage.selectSubInventoryBranch(branchSel);
});

When('User clicks on Item Quantities- under Actions', async function () {
   await this.inventoryManagamentPage.ClickOnItemQuantities();
});


When('User enter {string} to search for existing availability', async function (product) {
   await this.inventoryManagamentPage.SearchProductExistingStock(product);
});



Then('User should see deatils of existing stock values', async function () {
   getExistingSOH = Number(await this.inventoryManagamentPage.GetExistingSOH("On Hand"));
});

When('User clicks on Create Miscellaneous Transactions', async function () {
   await this.createMiscelleneousTransactionPage.ClickOnMiscellaneousTransactions();
});


Then('User should see {string} dashboard', async function (MiscellaneousTransDashboardHeader) {
   await Assert.AssertTrue(await this.createMiscelleneousTransactionPage.IsMiscellaneousTransactionsHeaderVisible(MiscellaneousTransDashboardHeader));
});


When('User clicks on Edit icon', async function () {
   await this.createMiscelleneousTransactionPage.ClickOnEditIcon();
});

When('User select Transaction Type as {string} and Account Alias as {string} and click on Save', async function (transactionType, accountAlias) {
   this.transactionType = transactionType;
   await this.createMiscelleneousTransactionPage.SelectTransactionType(transactionType, accountAlias);
});


Then('User should see option to {string}', async function (addItemBtn) {
   Assert.AssertTrue(await this.createMiscelleneousTransactionPage.IsAddItemButtonAvailable(addItemBtn));
});


When('User clicks on {string} button', async function (addItemBtn) {
   await this.createMiscelleneousTransactionPage.ClickOnAddItemButton(addItemBtn);
});

When('User enter product as {string}', async function (product) {
   await this.createMiscelleneousTransactionPage.EnterProductInfo(product);
});


When('User select subinventory as {string} and Locator as {string}', async function (this:ICustomWorld,subInventory, locator) {
   await this.createMiscelleneousTransactionPage.SelectSubInventoryAndLocator(subInventory, locator);
});


When('User enter quantity as {string}', async function (quantity) {
   await this.createMiscelleneousTransactionPage.EnterProductQuantity(quantity);
});


When('User select reason code as {string} from Additional Fields', async function (reasonCode) {
   await this.createMiscelleneousTransactionPage.SelectReason(reasonCode);
});

When('User enter Product Reference as {string}', async function (reference) {
   await this.createMiscelleneousTransactionPage.EnterProductRefrence(reference);
});



When('User clicks on Done', async function () {
   await this.createMiscelleneousTransactionPage.ClickOnDoneBtn();
});


Then('User should see {string} dashboard with line details', async function (string) {
   getTransactionQty = Number(await this.inventoryManagamentPage.GetExistingSOH("Transaction Quantity"))
});


When('User clicks on checkout button', async function (this:ICustomWorld) {
   await this.createMiscelleneousTransactionPage.ClickOnCheckoutBtn();
});

Then('User should see pop up as {string}', async function (textToBeDisplayed) {
   Assert.assertContains(await this.createMiscelleneousTransactionPage.GetItemReceivedTextDisplayed(textToBeDisplayed), textToBeDisplayed);
   getNewSOH = Number(await this.inventoryManagamentPage.GetExistingSOH("On Hand"));
   if (transactionType == "Account Alias Receipt") {
      Assert.assertEqualsInt((getExistingSOH + getTransactionQty), getNewSOH);
   }
   if (transactionType == "Account Alias Issue") {
      Assert.assertEqualsInt((getExistingSOH - getTransactionQty), getNewSOH);
   }
});