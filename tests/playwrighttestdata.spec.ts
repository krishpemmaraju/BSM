import test from "playwright/test";
import * as data from "../src/config/env/envDetails.json"


let SCM_URL = data.SCMDEV[0].SCMDEVURL;
let SCM_USERNAME = data.SCMDEV[0].SCMDEVUSERNAME;
let SCM_PASSWORD = data.SCMDEV[0].SCMDEVPASSWORD;

test.describe.serial('Create Order Using Cash Account', () => {

    test('login into SCM homepage', async ({ page }) => {
        console.log(SCM_URL + ' ' +  SCM_USERNAME + ' ' + SCM_PASSWORD)
        await page.goto(SCM_URL);
        await page.locator('#userid').fill(SCM_USERNAME);
        await page.locator('#password').fill(SCM_PASSWORD);
        await page.locator('#btnActive').click()
        await page.locator("a[title='Oracle Logo Home']").waitFor({ state: "visible", timeout: 90000 });
    })

    test('Navigate to Order Capture UI', async ({page}) => {
        await page.locator("a[title='Home']").click();
        await page.locator('#groupNode_order_management').click();
        await page.locator('#cust_site_scm_extension_wol-order-capture_main_0').click();
        await page.getByRole('heading').filter({hasText:'Order Capture'}).waitFor({state:'visible',timeout:9000});
    })

    test('Select the Customer', async ({ page }) => {
        await page.getByText('Select Customer...').click();
        await page.getByPlaceholder('Search by Customer Name, Account Code or Postcode').fill("SMITH AND BYFORD LTD");
        await page.getByText("SMITH AND BYFORD LTD").click();
    })

})