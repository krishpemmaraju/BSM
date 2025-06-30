import test from "playwright/test";




test('login into SCM homepage', async ({page}) => {
    await page.goto("https://egvh-dev1.login.em3.oraclecloud.com/")
    await page.locator('#userid').fill('ABB7375');
    await page.locator('#password').fill('Varahi$$16');
    await page.locator('#btnActive').click()
    await page.locator("a[title='Oracle Logo Home']").waitFor({state:"visible",timeout:90000});
})