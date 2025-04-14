import UIActions from "../../actions/UIActions";


export default class ExamTestsPage {

    private GET_TEXT_EXAM_PAGE = "#current_question_text";

    constructor(private web: UIActions){}

    public async waitForExamTestsPage():Promise<string>{
        return await this.web.element(this.GET_TEXT_EXAM_PAGE,"GET TEXT FROM EXAM PAGE").getTextValue();
    }

    public async clickOnAnyChoice(){
        await (await this.web.getElementRoleByText('label','Hunter-gatherers')).click();
    }

    public async isCheckButtonEnabled():Promise<boolean>{
        return await (await this.web.clickOnElementByRolebyHasText('button','Check')).isEnabled();
    }
}