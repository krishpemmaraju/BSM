import { Locator, Page } from "@playwright/test";


export default class DropdownActions {

    private locator: Locator;
    private description: string;

    constructor(private page: Page) { }

    public setLocator(locator: Locator, description: string): DropdownActions {
        this.locator = locator;
        this.description = description;
        return this;
    }

    /**
     * Select the value from dropdown
     * @param value
     */

    public async SelectValueFromDropDown(value: string) {
        await this.locator.selectOption({ value });
        return this;
    }

    /**
  * Select the dropdown by Label
  * @param text
  * @returns
  */

    public async SelectByVisibleText(label: string) {
        await this.locator.selectOption({ label });
        return this;
    }

    /**
* Select the dropdown by Label
* @param text
* @returns
*/

    public async SelectByIndex(index: number) {
        await this.locator.selectOption({ index });
        return this;
    }

    /**
 * Gets all the options in dropdown
 * @param index
 * @returns
 */

    public async GetAllOptions(): Promise<string[]> {
        await this.locator.waitFor({ state: 'visible', timeout: 3000 });
        return await this.locator.locator('option').allTextContents();
    }

    /**
* Gets all the selected options in dropdown
* @param index
* @returns
*/

    public async GetAllSelectedOptions(): Promise<string[]> {
        await this.locator.waitFor({ state: 'visible', timeout: 3000 });
        return await this.locator.locator("option[selected='selected']").allTextContents();
    }

}