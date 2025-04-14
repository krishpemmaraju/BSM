import { Page } from "@playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import RealityActions from "../../actions/RealityActions";
import { world } from "@cucumber/cucumber";

let realityAct: RealityActions;
let reportGeneration: ReportGeneration;
export default class SalesOrderProcessingPage {

    constructor(private page: Page){
        realityAct = new RealityActions(this.page);
        reportGeneration = new ReportGeneration();
    }

    public async enterOptionSalesOrderProcessing(locatorTxt: string){
        let salesOrdProcMenuOption =  await realityAct.getOptionForSelectingMenu(locatorTxt,"-");
        await realityAct.typeData('Select Option',salesOrdProcMenuOption);
        await reportGeneration.getScreenshot(realityAct.getPage(), `Enter ${salesOrdProcMenuOption} for '${locatorTxt}'`, world);
        await realityAct.realityKeyPress('Enter');
    }
}