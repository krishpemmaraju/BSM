import { expect, TestInfo } from "playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import { TEST_CONFIG } from "../../../config/test-config";


let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let CLICK_ON_EDIT_ICON = "button[aria-label='Edit']";
let SELECT_TRANSACTION_TYPE = "#transactionType";
let ENTER_QUANTITY = '#Quantity\\|input';
let ENTER_SUBMINVENTORY = '#subinventory\\|input'
let ADD_ITEM_BTN: string;
let GET_CONF_MESSAGE_POP_UP: string = ".oj-message-title";
let ACCOUNT_ALIAS_XPATH = "//span[text()='Account Alias']//ancestor::div[@class='oj-flex-item']//a";
setDefaultTimeout(60 * 1000 * 2);

export default class CreateMiscellaneousTransactions {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }


    public async ClickOnMiscellaneousTransactions() {
        await (await this.web.getElementByRolebyExactText('button', 'Create Miscellaneous Transactions')).click();
        await (await this.web.getElementByRolebyExactText('heading', 'Miscellaneous Transactions')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON MISCELLANEOUS TRANSACTIONS ", world);
    }

    public async IsMiscellaneousTransactionsHeaderVisible(headerDashboardPage: string) {
        return await (await this.web.getElementByRolebyExactText('heading', headerDashboardPage)).isVisible();
    }

    public async ClickOnEditIcon() {
        await this.web.element(CLICK_ON_EDIT_ICON, "Clcik on Edit Icon").click();
    }

    public async SelectTransactionType(transactionType: string, accountAlias: string) {
        await this.web.element(SELECT_TRANSACTION_TYPE, "Click on Transaction Type dropdown").click();
        await (await this.web.getElementRoleByText('text', transactionType)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING TRANSACTION TYPE AS  " + transactionType, world);
        await (await this.web.getElementByRoleByName('combobox', 'Account Alias')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
        await (await this.web.getElementByRoleByName('combobox', 'Account Alias')).click({ timeout: 6000 });
        await (await this.web.getElementRoleByText('text', accountAlias)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING ACCOUNT ALIAS AS " + accountAlias, world);
        await (await this.web.getElementByRolebyExactText('button', 'Save')).click();
        await (await this.web.getElementByRolebyExactText('button', 'Add Item')).waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.element });
    }

    public async IsAddItemButtonAvailable(addItemBtn: string) {
        ADD_ITEM_BTN = addItemBtn;
        return await (await this.web.getElementByRolebyExactText('button', addItemBtn)).isVisible({ timeout: 5000 });
    }

    public async ClickOnAddItemButton(addItemBtn: string) {
        await (await this.web.getElementByRolebyExactText('button', addItemBtn)).click();
        await (await this.web.getElementByRolebyExactText('heading', 'Add line')).waitFor({ state: 'visible', timeout: 5000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER CLICKING ON ADD ITEM OPTION", world);
    }

    public async EnterProductInfo(product: string) {
        await (await this.web.getElementByRoleByName('combobox', 'Items')).fill(product);
        await (await this.web.getElementRoleByText('text', product)).first().click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER ADDING PRODUCT AS " + product, world);
    }

    public async SelectAccountAlias(accountAlias: string) {
        await this.web.element(ACCOUNT_ALIAS_XPATH, "XPATH for Account alias").waitForElementToVisible(30);
        await this.web.element(ACCOUNT_ALIAS_XPATH, "XPATH for Account alias").click();
        await (await this.web.getElementRoleByText('text', accountAlias)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING ACCOUNT ALIAS AS " + accountAlias, world);
    }

    public async SelectSubInventory(subinventory: string) {
        await this.web.element(ENTER_QUANTITY, "Enter Quantity").scrollIntoViewElement();
        //   await (await this.web.getElementByRoleByName('combobox', 'Subinventory')).scrollIntoViewIfNeeded();
        await (await this.web.getElementByRoleByName('combobox', 'Subinventory')).click({ force: true, timeout: 5000 });
        await (await this.web.getElementRoleByText('text', subinventory)).click();
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING SUB INVENTORY AS " + subinventory, world);
    }

    public async EnterProductQuantity(quantity: string) {
        await this.web.element(ENTER_QUANTITY, "Enter Quantity").setText(quantity);
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER ENTERING QUANTITY AS " + quantity, world);
    }

    public async SelectReason(reasonCode: string) {
        await (await this.web.getElementByRoleByName('combobox', 'Reason')).scrollIntoViewIfNeeded({ timeout: 3000 });
        await (await this.web.getElementByRoleByName('combobox', 'Reason')).fill(reasonCode);
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING REASON CODE AS " + reasonCode, world);
    }

    public async EnterProductRefrence(productReference: string) {
        await (await this.web.getElementByLabel('Reference')).fill(productReference);
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SELECTING PRODUCT REFRENCE AS " + productReference, world);
    }

    public async ClickOnDoneBtn() {
        await (await this.web.getElementByRolebyExactText('button', 'Done')).click();
        await (await this.web.getElementByRolebyExactText('button', ADD_ITEM_BTN)).isVisible({ timeout: 5000 });
    }

    public async ClickOnSubmit() {
        await reportGeneration.getScreenshot(this.web.getPage(), "AFTER SAVING THE TRANSACTION ", world);
        await (await this.web.getElementByRolebyExactText('button', 'Submit')).click();
    }

    public async GetItemReceivedTextDisplayed(textToBeDisplayed: string) {
        await this.web.element(GET_CONF_MESSAGE_POP_UP, "Get Text from conf Pop Up").waitForElementToVisible(90);
        await reportGeneration.getScreenshot(this.web.getPage(), "POP UP CONFIRMATION RECEIVED  ", world);
        return await this.web.element(GET_CONF_MESSAGE_POP_UP, "Get Text from conf Pop Up").getTextValue();
    }
}