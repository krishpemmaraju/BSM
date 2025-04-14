import Assert from "../../../asserts/Assert";
import UIActions from "../../actions/UIActions";

export default class TestsPage {

    private GET_LIFE_IN_UK_TEST1_ELE: string = "a[title='Life in the UK Test 1']";
    constructor(private web: UIActions){
    }

    public async getTextOfTestsLandingPage(locatorTextIdentify: string):Promise<string>{
        const getTextOfTestLandPage = await ( await this.web.getElementRoleByText('text',locatorTextIdentify)).textContent();
        return getTextOfTestLandPage;
    }

    public async clickOnTestExam(locatorTextIdentify: string){
        await this.web.element(this.GET_LIFE_IN_UK_TEST1_ELE,"Click on Life in UK First Test").click();
    }

   
    
}