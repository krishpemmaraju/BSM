import { world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";

let reportGeneration: ReportGeneration;

export default class HomePage {
    constructor(private web: UIActions){reportGeneration = new ReportGeneration();}

    public async navigateToURL(url: string){
        await this.web.gotToURL(url);
    }

    public async clickOnTests(){
        const isTestsVisible = await (await this.web.clickOnElementByRolebyHasText('button','AGREE')).isVisible();
       if(isTestsVisible){
           await (await this.web.clickOnElementByRolebyHasText('button','AGREE')).click();
       }
       await reportGeneration.getScreenshot(this.web.getPage(),"Home Page",world);
       await (await this.web.clickOnElementByRolebyHasText('link','Tests')).click(); }
}