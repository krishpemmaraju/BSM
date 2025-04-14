import { world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import RealityActions from "../../actions/RealityActions";
import { Page } from "@playwright/test";

let reportGeneration: ReportGeneration;
let realityAct: RealityActions;
export default class LoginIntoDBPage {

    constructor(private page: Page) {
        realityAct = new RealityActions(this.page);
        reportGeneration = new ReportGeneration();
    }

    public async selectDB(locatorTxt: string, db: string, delimiter: string) {
        let getTextOption = await realityAct.getOptionForSelectingMenu(db, delimiter);
        await realityAct.typeData(locatorTxt, getTextOption);
        await reportGeneration.getScreenshot(realityAct.getPage(), `Select the '${db}`, world);
        await realityAct.realityKeyPress('Enter');
    }

    public async logToBranch(branch:string){
        let optionForLogToBranch = await realityAct.getOptionForSelectingMenu("Logto Branch","-");
        await realityAct.typeData('Select Option',optionForLogToBranch);
        await reportGeneration.getScreenshot(realityAct.getPage(), `Enter ${optionForLogToBranch} for Logto Branch`, world);
        await realityAct.realityKeyPress('Enter');
        await realityAct.typeData('Enter Branch',branch);
        await reportGeneration.getScreenshot(realityAct.getPage(), `Entered ${branch}`, world);
        await realityAct.realityKeyPress('Enter');
    }
}