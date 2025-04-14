import { Page } from "@playwright/test";
import ReportGeneration from "../../../helper/reportGeneration";
import RealityActions from "../../actions/RealityActions";

let reportGeneration: ReportGeneration;
let realityAct: RealityActions;
export default class RealityLogoutPage {
   
    constructor(private page: Page){
        reportGeneration = new ReportGeneration();
        realityAct = new RealityActions(this.page);
    }

    async LogoutReality(){
        let getLoggedOffTxt = true;
        while(getLoggedOffTxt){
        await realityAct.realityKeyPress("F1");
        if(await realityAct.isElementVisible("Logged off"))
            getLoggedOffTxt = false;
        }
    }
}