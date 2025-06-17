import { expect, Locator, Page } from "@playwright/test";
import UIElementActions from "./UIElementsActions";
import DropdownActions from "./DropdownActions";
import CheckBoxActions from "./CheckBoxActions";
import TextFillActions from "./TextFillActions";
import AlertActions from "./AlertActions";
import RealityActions from "./RealityActions";


export default class UIActions {

    private elementActions: UIElementActions;
    private dropdownActions: DropdownActions;
    private checkboxActions: CheckBoxActions;
    private textFillActions: TextFillActions;
    private alertActions: AlertActions;

    constructor(private page: Page) {
        this.elementActions = new UIElementActions(page);
        this.dropdownActions = new DropdownActions(page);
        this.checkboxActions = new CheckBoxActions(page);
        this.textFillActions = new TextFillActions(page);
        this.alertActions = new AlertActions(page);
    }

    /**
   * Returns page object
   * @returns
   */

    public getPage(): Page {
        return this.page;
    }

    /**
  * Sets the page
  * @param page
  */

    public setPage(page: Page) {
        this.page = page;
        this.elementActions = new UIElementActions(page);
        this.dropdownActions = new DropdownActions(page);
        this.checkboxActions = new CheckBoxActions(page);
        this.textFillActions = new TextFillActions(page);
        this.alertActions = new AlertActions(page);
    }

    /**
 * Close page 
 * @returns 
 */

    public closePage() {
        this.page.close();
    }

    /**
   * Returns the instance of Alert
   * @returns
   */

    public alert() {
        return this.alertActions;
    }

    /**
    * Returns the instance of UIElements actions
    * @param selector
    * @param description
    * @returns
    */

    public element(selector: string, description: string) {
        return this.elementActions.setElement(selector, description);
    }

    /**
    * Returns the instance of Dropdown actions
    * @param selector
    * @param description
    * @returns
    */

    public dropdown(selector: string, description?: string) {
        return this.dropdownActions.setLocator(this.elementActions.setElement(selector, description).getLocator(), description);
    }

    /**
   * Navigate to specified URL
   * @param URL
   * @param defualt timeout = 3 seconds
   * @param description
   */

    public async gotToURL(URL: string) {
        await this.page.goto(URL, { timeout: 3000, waitUntil: "load" });
    }

    /**
 * Navigate to previous URL
 * @param description
 */

    public async navigateToPrevURL() {
        await this.page.goBack({ timeout: 3000, waitUntil: "load" });
    }

    /**
   * Page Refresh
   */

    public async pageRefresh() {
        await this.page.reload({ timeout: 3000, waitUntil: "load" });
    }

    /**
  * Press a key on web page
  * @param key
  * @param description
  */

    public async keyPress(key: string) {
        await this.page.keyboard.press(key);
    }

    /**
  * Returns when the required load state has been reached.
  */

    public async waitForLoadState() {
        await this.page.waitForLoadState("load", { timeout: 3000 });
    }

    /**
    * Returns when the required dom content is in loaded state.
    */

    public async waitForDOMContentLoaded() {
        await this.page.waitForLoadState("domcontentloaded", { timeout: 3000 })
    }

    /**
  * Gets the handle of the new window
  * @param selector
  * @param description
  */

    public async switchToNewWindow(selector: string, description: string): Promise<Page> {
        let [newPage] = [this.page];
        [newPage] = await Promise.all([
            this.page.context().waitForEvent("page"),
            await this.elementActions.setElement(selector, description).click(),
        ]);
        await this.waitForDOMContentLoaded();
        return newPage;
    }

    /**
  * Gets the page Title
  * @returns
  */

    public async getPageTitle() {
        let title: string;
        title = await this.page.title();
        return title;
    }

    /**
 * Click on Element by Role by has Text
 * @param role
 * @param isHasText
 * @returns
 */

    public async getElementByRolebyHasText(roleVal: Parameters<Page['getByRole']>[0], isHasText: string): Promise<Locator> {
        return this.page.getByRole(roleVal).filter({ hasText: isHasText });
    }

    /**
* Click on Element by Role by has Text
* @param role
* @returns
*/

    public async getElementByLabel(labelText: string): Promise<Locator> {
        return this.page.getByLabel(labelText, { exact: true });
    }

    /**
* Click on Element by Role by Placeholder
* @param placeholderText
* @returns
*/

    public async getElementByPlaceholder(placeholderText: string): Promise<Locator> {
        return this.page.getByPlaceholder(placeholderText, { exact: true });
    }

    /**
* Click on Element by Role by Text
* @param textValue
* @returns
*/

    public async getElementByText(textValue: string): Promise<Locator> {
        return this.page.getByText(textValue, { exact: true });
    }

    /**
* Click on Element by Role by Exact Text
* @param role
* @param isHasText
* @returns
*/

    public async getElementByRolebyExactText(roleVal: Parameters<Page['getByRole']>[0], isHasText: string): Promise<Locator> {
        return this.page.getByRole(roleVal, { exact: true }).filter({ hasText: isHasText });
    }

    /**
* Click on Element by Role by name
* @param role
* @param name
* @returns
*/

    public async getElementByRoleByName(roleVal: Parameters<Page['getByRole']>[0], nameToIdentify: string): Promise<Locator> {
        return this.page.getByRole(roleVal, { name: nameToIdentify, exact: true });
    }

    /**
* Identify Element By Text
* @param textVal
* @returns
*/

    public async getElementRoleByText(roleVal: string, textVal: string): Promise<Locator> {
        return this.elementActions.setElementByPageByTexts(roleVal, textVal);
    }

    /**
     * Return the locator Object
     * @param locatorText
     */

    public async getPageLocator(locatorText: string): Promise<Locator> {
        return this.page.locator(locatorText);
    }

    /**
     * Perform Retry logic
     * @param locatorText
     * @paran - forOperation - visible , enable
     */

    public async RetryElementFindingsByLocatorTextVisible(locatorText: string, forOperation: string, maxRetries: number, timeout: number) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                if (forOperation === 'visible') {
                    await expect(this.page.locator(locatorText)).toBeVisible({ timeout: timeout });
                    return;
                }
                if (forOperation === 'enable') {
                    await expect(this.page.locator(locatorText)).toBeEnabled({ timeout: timeout });
                    return;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1} failed, retrying...`);
                await this.page.waitForLoadState('networkidle');
            }
        }
        throw new Error(locatorText + 'never became enabled after ' + maxRetries + ' retries');
    }

    /**
    * Perform Retry logic
    * @param locatorText
    * @paran - forOperation - visible , enable
    */

    public async RetryElementFindingsByRole(roleVal: Parameters<Page['getByRole']>[0], nameToIdentify: string, forOperation: string, maxRetries: number, timeout: number) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                if (forOperation === 'visible') {
                    await expect(this.page.getByRole(roleVal, { name: nameToIdentify })).toBeVisible({ timeout: timeout });
                    return;
                }
                if (forOperation === 'enable') {
                    await expect(this.page.getByRole(roleVal, { name: nameToIdentify })).toBeEnabled({ timeout: timeout });
                    return;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1} failed, retrying...`);
                await this.page.waitForLoadState('networkidle');
            }
        }
        throw new Error(' Locator ' + roleVal + ' with name' + nameToIdentify + 'never became enabled after ' + maxRetries + ' retries');
    }

}