import { Page } from "@playwright/test";
import ReportGeneration from "../../helper/reportGeneration";
import { world } from "@cucumber/cucumber";

let reportGeneration: ReportGeneration;
export default class RealityActions {

    constructor(private page: Page){reportGeneration=new ReportGeneration();}


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
}

  /**
* Close page 
* @returns 
*/

public closePage(){
   this.page.close();
}

   /**
     * This function is for reality 
     * @returns frame Object
     */

   public async returnFrameLocatorForReality(){
    const frameElement = "//iframe[contains(@id,'FVTerm')]";
    const subFrameEle = "//iframe[contains(@id,'termW')]";
    return this.page.frameLocator(frameElement).frameLocator(subFrameEle);
}

public async realityKeyPress(KeyToPress: string){
    await this.page.keyboard.press(KeyToPress);
}

public async typeData(locatorTxt:string,dataToEnter:string){
    let locText = "//span[contains(text(),'" + locatorTxt.trim() + "')]";
    const getFinalFrameObj = await this.returnFrameLocatorForReality();
    const realityLocatorObj = getFinalFrameObj.locator(locText);
    await realityLocatorObj.type(dataToEnter);
}

public async getOptionForSelectingMenu(locatorText:string,delimiter:string,position = ""):Promise<string>{
    const loc = '//span[contains(text(),\"'+locatorText.trim()+'\")]';
    let delimitedText: string = "";
    let textD: any;
    const getTextForFinFrame = await this.returnFrameLocatorForReality();
    const textLoc = ( getTextForFinFrame).locator(loc);
    textD = await textLoc.textContent();
    if (delimiter === ".") {
        delimitedText = textD.split(delimiter)[0].trim();
    }
    if (delimiter === "-") {
            let index1: number = textD.indexOf("│");
            let index2: number = textD.indexOf("- ");
            delimitedText = textD.substring(index1 + 1, index2).trim();
    }
    else if (delimiter === "-" || position != "") {
        let index1: number = textD.indexOf(locatorText);
        delimitedText = textD.substring(index1-5,index1-2).trim();

    }
    return delimitedText;
}

public async isRealityMenuPresent(locatorTxt:string):Promise<boolean>{
    let locText = "//span[contains(text(),'" + locatorTxt.trim() + "')]";
    const getFinalFrameObj = await this.returnFrameLocatorForReality();
    const realityLocatorObj = getFinalFrameObj.locator(locText);
    await realityLocatorObj.waitFor({state:'visible',timeout:5000});
    await reportGeneration.getScreenshot(this.page,`Menu ${locatorTxt.toUpperCase()} displayed`,world);
    return await realityLocatorObj.isVisible();
}

public async isElementVisible(locatorTxt:string):Promise<boolean>{
    let locText = "//span[contains(text(),'" + locatorTxt.trim() + "')]";
    const getFinalFrameObj = await this.returnFrameLocatorForReality();
    const realityLocatorObj = getFinalFrameObj.locator(locText);
    return await realityLocatorObj.isVisible();
}

}

