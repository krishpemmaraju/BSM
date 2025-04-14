import { Given, When, Then } from '@cucumber/cucumber'
import * as data from "../../src/config/env/envDetails.json" 
import HomePage from '../../src/webui/pages/web/HomePage';
import TestsPage from '../../src/webui/pages/web/TestsPage';
import Assert from '../../src/asserts/Assert';
import ExamTestsPage from '../../src/webui/pages/web/ExamTestPage';

Given('User landed on Life in UK webpage', async function () {
     await new HomePage(this.web).navigateToURL(data.prdReality[0].url);
});

When('User click on Tests', async function () {
    await new HomePage(this.web).clickOnTests();
});


Then('User should see {string} page', async function (pageTextValue) {
    const expectedTestsPageData = await new TestsPage(this.web).getTextOfTestsLandingPage(pageTextValue);
    await Assert.assertEquals(pageTextValue,expectedTestsPageData);
});


When('User clicks on any test exam', async function () {
    await new TestsPage(this.web).clickOnTestExam("Life in the UK Test 1");
});


Then('User should see the exam page with choice question', async function () {
    await Assert.assertContains(await new ExamTestsPage(this.web).waitForExamTestsPage(),"Question");
});

When('User selects a option for the question and click on check', async function () {
    await new ExamTestsPage(this.web).clickOnAnyChoice();
});



Then('User should see Next button enabled if {string}', async function (string) {
      Assert.AssertTrue(await new ExamTestsPage(this.web).isCheckButtonEnabled());
});



Then('User should see Previous button enabled if {string}', async function (string) {
     
});
