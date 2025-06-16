import { Locator, Page } from "@playwright/test";


export default class TextFillActions {

    locator: Locator;
    
    constructor(private page: Page){}

    public setLocator(locator: Locator){
        this.locator = locator;
        return this;
    }

}