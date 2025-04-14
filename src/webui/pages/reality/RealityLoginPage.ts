import ReportGeneration from "../../../helper/reportGeneration";
import * as data from "../../../config/env/envDetails.json"
import { world } from "@cucumber/cucumber";
import RealityActions from "../../actions/RealityActions";
import { Page } from "@playwright/test";

let reportGeneration: ReportGeneration;
let realityAct: RealityActions;
export default class RealityLoginPage {

    constructor(private page: Page){
        realityAct = new RealityActions(this.page);
        reportGeneration = new ReportGeneration();}

    public async loginIntoRealityPage(username:string,password:string){
        await realityAct.typeData('login',data.prdReality[0].username);
        await reportGeneration.getScreenshot(realityAct.getPage(),`Enter username as '${data.prdReality[0].username}' to login`,world);
        await realityAct.realityKeyPress('Enter');
        await realityAct.typeData('Password',data.prdReality[0].password);
        await realityAct.realityKeyPress('Enter');
        await reportGeneration.getScreenshot(realityAct.getPage(),'After Entering password',world);
    }
}