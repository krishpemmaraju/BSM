import { Locator, Page } from "@playwright/test";


export default class TextFillActions {

    locator: Locator;
    description: string;
    
    constructor(private page: Page){}

    public setLocator(locator: Locator,description: string){
        this.locator = locator;
        this.description = description;
        return this;
    }
}