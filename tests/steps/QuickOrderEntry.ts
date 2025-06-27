import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import QuickOrderEntryPage from "../../src/webui/pages/scm/OuickOrderEntryPage";
import Assert from "../../src/asserts/Assert";
import FileUtils from "../../src/utils/FileUtils";


setDefaultTimeout(60 * 10 * 1000);
let PROD_FILE_PATH = "src/data/products.csv"


When('Click on Quick Order Entry option', async function () {
    await new QuickOrderEntryPage(this.web).ClickOnQuickOrderEntry();
});


Then('User should see Quick Order Entry pane', async function () {
    await Assert.AssertTrue(await new QuickOrderEntryPage(this.web).isQuickOrderEntryPageDisplayed())
});


When('Enter the products as {string} and Add to Basket', async function (productInfo) {
    await new QuickOrderEntryPage(this.web).EnterProductData(productInfo);
});

When('User clicks on file upload to upload file', async function () {
      await new QuickOrderEntryPage(this.web).UploadFileOrderEntry(PROD_FILE_PATH);
      await Assert.assertEqualsList(await new QuickOrderEntryPage(this.web).GetProductsListAfterUpload(), new FileUtils().getDataFromFileToList(PROD_FILE_PATH,1))
  });

When('User Clicks on Add To Basket', async function () {
    await new QuickOrderEntryPage(this.web).ClickOnAddToBasket();
  });