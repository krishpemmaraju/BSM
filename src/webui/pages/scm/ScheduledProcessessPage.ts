
import { setDefaultTimeout, world } from "@cucumber/cucumber";
import ReportGeneration from "../../../helper/reportGeneration";
import UIActions from "../../actions/UIActions";
import { expect, TestInfo } from "@playwright/test";
import { TEST_CONFIG } from "../../../config/test-config";
import StringUtils from "../../../utils/StringUtils";

let reportGeneration: ReportGeneration;
let testInfo: TestInfo;
let getColValue: string;

//setDefaultTimeout(1200000);
setDefaultTimeout(1200000);

export default class ScheduledProcessesPage {

    constructor(private web: UIActions, testInfo?: TestInfo) {
        reportGeneration = new ReportGeneration();
        testInfo = testInfo!;
    }


    public async isScheduledProcessesPageDisplayed(): Promise<boolean> {
        await (await this.web.getElementByRoleByName('button', 'Schedule New Process')).waitFor({ timeout: 120000 })
        await reportGeneration.getScreenshot(this.web.getPage(), "SCHEDULED PROCESSES PAGE SECTION LAUNCHED", world);
        return await (await this.web.getElementByRoleByName('button', 'Schedule New Process')).isVisible();
    }

    public async ClickOnScheduleNewProcesses() {
        await (await this.web.getElementByRoleByName('button', 'Schedule New Process')).click();
    }

    public async isScheduleNewProcessPopUpDisplayed(): Promise<boolean> {
        await (await this.web.getPageLocator("div.AFPopupSelector")).waitFor({ timeout: 20000 });
        await reportGeneration.getScreenshot(this.web.getPage(), "SCHEDULED NEW PROCESSES POP UP LAUNCHED", world);
        return await (await this.web.getPageLocator("div.AFPopupSelector")).isVisible();
    }

    public async SearchForJobName(jobName: string) {
        await (await this.web.getPageLocator("span[id*='selectOneChoice2'] input")).fill(jobName.trim());
        await reportGeneration.getScreenshot(this.web.getPage(), "JOB NAME ENTERED AS " + jobName.trim(), world);
        await this.web.keyPress('Enter');
        await (expect(await this.web.getPageLocator("button[id*='snpokbtnid']"))).toBeEnabled({ timeout: 9000 })
        await (await this.web.getPageLocator("button[id*='snpokbtnid']")).click()
    }

    public async isProcessDetailsPoPUpDisplayed(): Promise<boolean> {
        await (await this.web.getPageLocator("div.AFPopupSelector")).waitFor({ state: 'visible', timeout: 12000 })
        await reportGeneration.getScreenshot(this.web.getPage(), " PROCESS DETAILS POP UP DISPLAYED  ", world);
        return await (await this.web.getPageLocator("div.AFPopupSelector")).isVisible();
    }

    public async FillProcessDetails(subinventory: string) {
        await (await this.web.getPageLocator("input[id*='requestHeader:reqDesc']")).fill("TestSubmission");
        await (await this.web.getPageLocator("input[name*='basicReqBody:paramDynForm_Attribute']")).fill(subinventory)
    }

    public async ClickOnSubmit() {
        await (await this.web.getPageLocator("div[id*='submitButton'] a")).click()
    }

    public async IsProcessDetailConfirmationPopUpDisplayed() {
        await (await this.web.getPageLocator("td[id*='confirmationPopup:confirmSubmitDialog::_hce'] div[id*='confirmSubmitDialog::_ttxt']")).waitFor({ state: 'visible', timeout: 9000 })
        return await (await this.web.getPageLocator("td[id*='confirmationPopup:confirmSubmitDialog::_hce'] div[id*='confirmSubmitDialog::_ttxt']")).isVisible();
    }

    public async CaptureProcessID() {
        let getProcessID = await (await this.web.getPageLocator("span[id*='confirmationPopup:pt_ol1'] label")).textContent()
        await (await this.web.getPageLocator("button[id*='confirmSubmitDialog']")).click()
        return StringUtils.getStringBetweenTwoStrings(getProcessID ?? '', 'Process', 'was');
    }

    public async SearchForProcessID(processID: string) {
        //48008259 
        if (await (await this.web.getPageLocator("a[aria-label='Expand Search']")).isVisible({ timeout: 9000 })) {
            await (await this.web.getPageLocator("a[aria-label='Expand Search']")).click();
        }
        await (await this.web.getPageLocator("input[aria-label*=' Process ID']")).fill(processID);
        await (await this.web.getPageLocator("button[id*='search']")).click()
    }


    public async IsStatusOfProcessIDSuccess(colname: string) {
        let getIndexOfColumn = await (await this.web.getPageLocator("th[id*='"+colname+"']")).getAttribute('_d_index');
        getColValue = await (await this.web.getPageLocator("//table[@summary='List of Processes Meeting Search Criteria']//tr[1]//td[" + getIndexOfColumn + "]")).textContent() ?? '';

        let attempt = 0;
        while (attempt < 30) {
            attempt++;
            getColValue = await (await this.web.getPageLocator("//table[@summary='List of Processes Meeting Search Criteria']//tr[1]//td[" + getIndexOfColumn + "]")).textContent() ?? '';
            if (getColValue === 'Succeeded') {
                return true;
            } else {
                await (await this.web.getPageLocator("button[id*='search']")).click()
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        return false;
    }


}