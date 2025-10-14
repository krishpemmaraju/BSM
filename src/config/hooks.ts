import { After, AfterAll, Before, BeforeAll, context, formatterHelpers, ITestCaseHookParameter, setDefaultTimeout } from "@cucumber/cucumber";
import { Browser } from "@playwright/test";
import WebBrowserManager from "../manager/browserManager";
import UIActions from "../webui/actions/UIActions";
import * as data from "../config/env/envDetails.json"
import RealityLogoutPage from "../webui/pages/reality/RealityLogoutPage";
import RestRequest from "../api/actions/RESTRequest";
import SCMLogoutPage from "../webui/pages/scm/SCMLogoutPage";
import fs from 'fs'
import path from 'path'

const timeInMin: number = 60 * 1000;
setDefaultTimeout(Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin);
let browser: Browser | undefined;

// BeforeAll(async function() {
//     browser = await WebBrowserManager.launch("chrome");
// });

// AfterAll({tags:"@SCM"},async function() {
//     await browser.close();
// });

Before({tags: "@reality"}, async function({pickle,gherkinDocument}) {
    const line = formatterHelpers.PickleParser.getPickleLocation({gherkinDocument,pickle});
    console.log( " **********************   TEST STARTED **************************************************** \n");
    console.log( " ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
    browser = await WebBrowserManager.launch("chrome");
    this.context = await browser.newContext({
         viewport: null,
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
    });
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
    this.web.gotToURL(data.prdReality[0].url);
})

Before({tags: "@api"}, async function({pickle,gherkinDocument}) {
    const line = formatterHelpers.PickleParser.getPickleLocation({gherkinDocument,pickle});
    console.log( " **********************   TEST STARTED **************************************************** \n");
    console.log( " ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
    this.context = await browser.newContext({
         viewport: null,
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
    });
    this.page = await this.context?.newPage();
    this.rest = new RestRequest(this.page);
})


Before({tags: "@web"},async function({pickle,gherkinDocument}: ITestCaseHookParameter) {
    const line = formatterHelpers.PickleParser.getPickleLocation({gherkinDocument,pickle});
    console.log( " **********************   TEST STARTED **************************************************** \n");
    console.log( " ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
    browser = await WebBrowserManager.launch("chrome");
    this.context = await browser.newContext({
         viewport: null,
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
    });
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
})

Before({tags: "@SCM"},async function({pickle,gherkinDocument}: ITestCaseHookParameter) {
    const line = formatterHelpers.PickleParser.getPickleLocation({gherkinDocument,pickle});
    console.log( " **********************   TEST STARTED **************************************************** \n");
    console.log( " ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");
     if(!browser){
    browser = await WebBrowserManager.launch("chrome");}
    this.browser = browser;
    this.context = await browser.newContext({
         viewport: null,
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
         storageState: undefined,
    });
    await this.context.clearCookies();
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
    this.rest = new RestRequest(this.page);
})

Before({tags: "@VBSOC"},async function({pickle,gherkinDocument}: ITestCaseHookParameter) {
    const line = formatterHelpers.PickleParser.getPickleLocation({gherkinDocument,pickle});
    console.log( " **********************   TEST STARTED **************************************************** \n");
    console.log( " ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");
    if(!browser){
    browser = await WebBrowserManager.launch("firefox");}
    this.browser = browser;
    this.context = await this.browser.newContext({
         viewport: null,
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
         storageState: undefined,
    });
    await this.context.clearCookies();
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
    this.rest = new RestRequest(this.page);
})

After({tags:"@web"},async function({result,pickle,gherkinDocument} : ITestCaseHookParameter) {
    const status = result.status;
    const scenario = pickle.name;
    console.log("************************ "+ pickle.name + " is completed with " + status + "*******************");
    await this.page.close();
    await this.context?.close();
})

After({tags:"@SCM"},async function({result,pickle,gherkinDocument} : ITestCaseHookParameter) {
    const status = result.status;
    const scenario = pickle.name;
    await new SCMLogoutPage(this.web).LogoutApplication();
    console.log("************************ "+ pickle.name + " is completed with " + status + " *******************");
    this.page ? await this.page.close() : console.warn('No Pages Found')
    this.context ? await this.context.close() : console.warn('No Context Found')
})

After({tags:"@api"},async function({result,pickle,gherkinDocument} : ITestCaseHookParameter) {
    const status = result.status;
    const scenario = pickle.name;
    console.log("************************ "+ scenario + " API is completed with " + status + "*******************");
})


After({tags:"@reality"},async function({result,pickle,gherkinDocument} : ITestCaseHookParameter) {
    const status = result.status;
    const scenario = pickle.name;
    console.log("************************ "+ scenario + " is completed with " + status + "*******************");
    await new RealityLogoutPage(this.page).LogoutReality();
    this.page.close();
    this.context?.close();
})

After({tags: "@VBSOC"}, async function(scenario) {
     this.page ? await this.page.close() : console.warn('No Pages Found')
      this.context ? await this.context.close() : console.warn('No Context Found')
    // const scenarioName = scenario.pickle.name.replace(/\s+/g,'_');
    // const featureName = scenario.gherkinDocument.feature.name.replace(/\s+/g,'_');
    // const outputDir = path.join('test-result', 'feature-reports',featureName)
    // if( !fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive : true})


    
})