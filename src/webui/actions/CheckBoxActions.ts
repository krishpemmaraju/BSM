import { Locator, Page } from "@playwright/test";


export default class CheckBoxActions {

    constructor(private page: Page) {
    }

    locator: Locator;
    description: string;

    /** 
      Sets the locator with description
      * @param locator
      * @param description
      * @returns
    */

    public setLocator(locator: Locator, description: string): CheckBoxActions {
        this.locator = locator;
        this.description = description;
        return this;
    }

    /**
     *  check radio or checkbox button
     */

    public async check() {
        await this.locator.check();
        return this;
    }

    /**
     *  uncheck radio or checkbox button
     */

    public async Uncheck() {
        await this.locator.uncheck();
        return this;
    }

    /**
     *  return the status of Checkbox with timeout
     */

    public async isCheckWithTimeOut(seconds: number): Promise<boolean> {
        await this.locator.waitFor({ state: 'visible', timeout: seconds * 1000 });
        return await this.locator.isChecked();
    }

    /**
     *  return the status of Checkbox with timeout
     */

    public async isCheckWithOutTimeOut(): Promise<boolean> {
        await this.locator.waitFor({ state: 'visible' });
        return await this.locator.isChecked();
    }

}