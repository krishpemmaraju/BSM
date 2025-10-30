import { Given, setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import SCMHomePage from "../../../src/webui/pages/scm/SCMHomePage";


setDefaultTimeout(60 * 10 * 1000);

When('User navigate to Order Management', async function () {
   await new SCMHomePage(this.web).navigateToOrdermanagement();
});

When('User clicks on Create Order', async function () {

});

Then('User should see Create Order page', async function () {

});

When('User select customer as {string}', async function (string) {

});

When('Select order type as {string}', async function (string) {

});

When('User enter item as {string}', async function (string) {

});

When('click on Add', async function () {

});

Then('User should see {string} in item search results', async function (string) {

});


When('User clicks on submit on Create Order Page', async function () {

});

When('User should see Confirmation pop with order number', async function () {

});

When('User clicks on Done on Create Order Page', async function () {

});

Then('User should see Order Management page', async function () {

});

When('User search for the order created above', async function () {

});

Then('User should see the Manage Order page with Order created', async function () {

});