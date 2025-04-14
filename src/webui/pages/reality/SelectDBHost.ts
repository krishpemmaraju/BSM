import { world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";

let reportGeneration: ReportGeneration;
export default class SelectDBHost {
   
    constructor(private web: UIActions){
        reportGeneration = new ReportGeneration();
    }

    public async selectDBHost(dbToSelect:string){
        await this.web.dropdown('.w-dropdown-terminal-host',"To select DB Host Dropdown").SelectValueFromDropDown(dbToSelect);
        await reportGeneration.getScreenshot(this.web.getPage(),`'${dbToSelect} has been selected`,world);
        await this.web.element('button[title="Connect"]',"Click on Connect to select DB Host").click();
    }
}