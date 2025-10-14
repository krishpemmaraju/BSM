import { setDefaultTimeout } from "@cucumber/cucumber";
import { TestInfo } from "playwright/test";
import UIActions from "../../actions/UIActions";
import ReportGeneration from "../../../helper/reportGeneration";

setDefaultTimeout(60 * 10 * 1000)
let reportGeneration: ReportGeneration;
export default class CustomerSelectionPage {

        constructor(private web: UIActions, testInfo?: TestInfo) {
            reportGeneration = new ReportGeneration();
            testInfo = testInfo!;
        }
    
    public async getIndexOfHeaderWithName(colname: string){
        const getHeaderElements = this.web.getPage().locator("thead.oj-table-header th");
        let startIndex = -1;
        for( let i=0;i< await getHeaderElements.count();i++){
             const text = await getHeaderElements.nth(i).textContent();
             if(text?.trim() == colname)
                startIndex = i;
                break;
        }
        return startIndex;
    }

    public async GetCustomerAccountStatusFromUI(statusToValidate: string){
        const getAccountStatus = this.web.getPage().locator("div[title='"+statusToValidate+"'");
        return await getAccountStatus.textContent();
    }

    public async getColumnValueFromCustomerSelPanel(){

    }


}