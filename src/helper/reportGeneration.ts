import { ITestCaseHookParameter, IWorld } from "@cucumber/cucumber";
import { Page } from "@playwright/test";

export default class ReportGeneration {

    async getScreenshotData(page:Page,message:string,messageToAttach:string,world:IWorld)     {
        const screensshotExtn: string = '.png';
        const screenshot = await page.screenshot({path:`./test-result/screenshots/${message}${screensshotExtn}`,fullPage:true});
        world.attach(messageToAttach,'text/plain');
        world.attach(screenshot,'image/png');
     }

     async getScreenshot(page:Page,messageToAttach:string,world:IWorld)     {
        const screenshot = await page.screenshot();
        world.attach(messageToAttach,'text/plain');
        world.attach(screenshot,'image/png');
     }

     static async attachReportForAPI(messageToAttach: string,world: IWorld){
          world.attach(messageToAttach,'text/plain');
     }

}
