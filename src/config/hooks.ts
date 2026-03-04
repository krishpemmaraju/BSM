import { After, AfterAll, Before, BeforeAll, context, formatterHelpers, ITestCaseHookParameter, setDefaultTimeout, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, firefox } from "@playwright/test";
import WebBrowserManager from "../manager/browserManager";
import UIActions from "../webui/actions/UIActions";
import * as data from "../config/env/envDetails.json"
import RealityLogoutPage from "../webui/pages/reality/RealityLogoutPage";
import RestRequest from "../api/actions/RESTRequest";
import SCMLogoutPage from "../webui/pages/scm/SCMLogoutPage";
import CustomWorld from "../support/CustomWorld";
import { shouldSkipScenario } from "../support/SkippingTestCases";
import { sharedData } from "../support/SharedData";
import { handleFailScenarioBeforeScenario } from "../support/SkippingScenariosPreviousFail";
import { InitSCMApplicationConfig } from "../support/InitApplicationConfig";

const timeInMin: number = 60 * 1000;
//setDefaultTimeout(Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin);
let browser: Browser | undefined;
setWorldConstructor(CustomWorld);

// BeforeAll(async function () {

// });

// AfterAll({tags:"@SCM"},async function() {
//     await browser.close();
// });



Before({ tags: "@reality" }, async function ({ pickle }) {
    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
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

Before({ tags: "@api" }, async function (this: CustomWorld, { pickle }) {

    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");

    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const scmConfig: any = data[`SCM_${envKey}`][0];
    const onpremConfig: any = data[`ONPREM_${envKey}`][0];

    Object.assign(this, {
        SCMURL: scmConfig[`SCM${envKey}URL`],
        SCMUSER: scmConfig[`SCM${envKey}USERNAME`],
        SCMPASSWORD: scmConfig[`SCM${envKey}PASSWORD`],
        SCMSTOCKCHKAPI: scmConfig[`SCM${envKey}STOCKCHKAPI`],
        SCMCHKAVAILABILITY: scmConfig[`SCM${envKey}CHKAVAILABILITY`],
        ONPREMOSBURL: onpremConfig[`ONPREM${envKey}OSBURL`],
        ONPREMSOAURL: onpremConfig[`ONPREM${envKey}SOAURL`],
        ONPREMUSER: onpremConfig[`ONPREM${envKey}USERNAME`],
        ONPREMPASSWORD: onpremConfig[`ONPREM${envKey}PASSWORD`]
    })
    await this.init('api');
});

Before("@DB", async function (this: CustomWorld, { pickle }) {

    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");

    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'


    const hjConfig: any = data[`HIGHJUMP_${envKey}`][0];
    const odsConfig: any = data[`ODS_${envKey}`][0];

    Object.assign(this, {
        HJURL: hjConfig[`HJ${envKey}ALIAS`],
        HJUSER: hjConfig[`HJ${envKey}USERNAME`],
        HJPASSWORD: hjConfig[`HJ${envKey}PASSWORD`],
        ODSURL: odsConfig[`ODS${envKey}ALIAS`],
        ODSUSER: odsConfig[`ODS${envKey}USERNAME`],
        ODSPASSWORD: odsConfig[`ODS${envKey}PASSWORD`],
    })
    await this.init('db');
});

// Before({ tags: "@api" }, async function ({ pickle }) {
//     console.log(" **********************   TEST STARTED **************************************************** \n");
//     console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
//     this.context = await browser.newContext({
//         viewport: null,
//         ignoreHTTPSErrors: true,
//         acceptDownloads: true,
//     });
//     this.page = await this.context?.newPage();
//     this.rest = new RestRequest(this.page);
// })

Before({ tags: "@web" }, async function ({ pickle }: ITestCaseHookParameter) {
    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + "******************* \n");
    browser = await WebBrowserManager.launch("chrome");
    this.context = await browser.newContext({
        viewport: null,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
    });
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
})

Before({ tags: "@VBSOC" }, async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {

    console.log(" *************************   TEST STARTED *************************  \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");
    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const scmConfig: any = data[`SCM_${envKey}`][0];
    const vbcsConfig: any = data[`ONPREM_${envKey}`][0];

    Object.assign(this, {
        SCMURL: scmConfig[`SCM${envKey}URL`],
        SCMUSER: scmConfig[`SCM${envKey}USERNAME`],
        SCMPASSWORD: scmConfig[`SCM${envKey}PASSWORD`],
        SCMSTOCKCHKAPI: scmConfig[`SCM${envKey}STOCKCHKAPI`],
        SCMCHKAVAILABILITY: scmConfig[`SCM${envKey}CHKAVAILABILITY`],
        VBCSURL: vbcsConfig[`VBCS${envKey}OCURL`],
        VBCSUSER: vbcsConfig[`VBCS${envKey}OCUSERNAME`],
        VBCSPASSWORD: vbcsConfig[`VBCS${envKey}OCPASSWORD`]
    })
    await this.init('vbsoc');
    this.web = new UIActions(this.page);
    this.rest = new RestRequest(this.page);
})

Before({ tags: "@SCM" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {

    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");

    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const scmConfig: any = data[`SCM_${envKey}`][0];
    const vbcsConfig: any = data[`VBCSOC_${envKey}`][0];
    const onpremConfig:any = data[`ONPREM_${envKey}`][0];

    Object.assign(this, {
        SCMURL: scmConfig[`SCM${envKey}URL`],
        SCMUSER: scmConfig[`SCM${envKey}USERNAME`],
        SCMPASSWORD: scmConfig[`SCM${envKey}PASSWORD`],
        SCMSTOCKCHKAPI: scmConfig[`SCM${envKey}STOCKCHKAPI`],
        SCMCHKAVAILABILITY: scmConfig[`SCM${envKey}CHKAVAILABILITY`],
        VBCSURL: vbcsConfig[`VBCS${envKey}OCURL`],
        VBCSUSER: vbcsConfig[`VBCS${envKey}OCUSERNAME`],
        VBCSPASSWORD: vbcsConfig[`VBCS${envKey}OCPASSWORD`],
        ONPREMOSBURL: onpremConfig[`ONPREM${envKey}OSBURL`],
        ONPREMSOAURL: onpremConfig[`ONPREM${envKey}SOAURL`],
        ONPREMUSER: onpremConfig[`ONPREM${envKey}USERNAME`],
        ONPREMPASSWORD: onpremConfig[`ONPREM${envKey}PASSWORD`]
    })
    await this.init('scm');
    this.envData = envKey
    this.web = new UIActions(this.page);
    this.rest = new RestRequest(this.page);
})

Before({ tags: "@MFT" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {

    console.log(" **********************   TEST STARTED **************************************************** \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");

    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const mftConfig: any = data[`MFT_${envKey}`][0]

    Object.assign(this, {
        MFTURL: mftConfig[`MFT${envKey}URL`],
        MFTUSER: mftConfig[`MFT${envKey}USERNAME`],
        MFTPASSWORD: mftConfig[`MFT${envKey}PASSWORD`],
        MFTNAVIGATION: mftConfig[`MFT${envKey}NAVIGATION`],
    })
    await this.init('mft');
    this.web = new UIActions(this.page);
    this.rest = new RestRequest(this.page);
})

Before({ tags: "@conditionalSkipping" }, async function () {
    if (shouldSkipScenario()) {
        return "skipped"
    }
})

Before({ tags: "@SCMVBSOC" }, async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {

    console.log(" *************************   TEST STARTED *************************  \n");
    console.log(" ****************** EXECUTION STARTED FOR SCENARIO - " + pickle.name + " ******************* \n");

    type Env = 'dev' | 'stg' | 'staging' | 'tst'
    type EnvKey = 'DEV' | 'STG' | 'TST'

    const envMap: Record<Env, EnvKey> = {
        dev: 'DEV',
        stg: 'STG',
        staging: 'STG',
        tst: 'TST'
    }

    const env = (process.env.ENV?.toLowerCase() as Env) || 'dev';
    const envKey: EnvKey = envMap[env] || 'DEV'

    const scmConfig: any = data[`SCM_${envKey}`][0];
    const vbcsConfig: any = data[`VBCSOC_${envKey}`][0];

    Object.assign(this, {
        SCMURL: scmConfig[`SCM${envKey}URL`],
        SCMUSER: scmConfig[`SCM${envKey}USERNAME`],
        SCMPASSWORD: scmConfig[`SCM${envKey}PASSWORD`],
        SCMSTOCKCHKAPI: scmConfig[`SCM${envKey}STOCKCHKAPI`],
        SCMCHKAVAILABILITY: scmConfig[`SCM${envKey}CHKAVAILABILITY`],
        VBCSURL: vbcsConfig[`VBCS${envKey}OCURL`],
        VBCSUSER: vbcsConfig[`VBCS${envKey}OCUSERNAME`],
        VBCSPASSWORD: vbcsConfig[`VBCS${envKey}OCPASSWORD`]
    })
    await this.init('scmvbsoc');
})

After({ tags: "@web" }, async function ({ result, pickle }: ITestCaseHookParameter) {
    const status = result?.status;
    const scenario = pickle.name;
    console.log("************************ " + pickle.name + " is completed with " + status + "*******************");
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    await this.page.close();
    await this.context?.close();
})

After({ tags: "@MFT" }, async function (this: CustomWorld, this1: ITestCaseHookParameter) {
    const result = this1.result;
    const pickle = this1.pickle;
    const status = result?.status;
    const scenario = pickle.name;
    if (status === 'SKIPPED') { return; }
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    if (!sharedData.previousScenarioStatusFailed) {
        await this.mftActionsPage.ClickOnMFTLogout()
    }
    console.log("************************ " + pickle.name + " is completed with " + status + " *******************");
    this.page ? await this.page.close() : console.warn('No Pages Found')
    this.context ? await this.context.close() : console.warn('No Context Found')
})

After({ tags: "@api" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {
    const status = result?.status;
    const scenario = pickle.name;
    console.log("************************ " + pickle.name + " is completed with " + status + "*******************");
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
})

After({ tags: "@SCM" }, async function (this: CustomWorld, this1: ITestCaseHookParameter) {
    const result = this1.result;
    const pickle = this1.pickle;
    const status = result?.status;
    const scenario = pickle.name;
    if (status === 'SKIPPED') { return; }
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    if (!sharedData.previousScenarioStatusFailed) {
        await new SCMLogoutPage(this.web).LogoutApplication();
    }
    console.log("************************ " + pickle.name + " is completed with " + status + " *******************");
    this.page ? await this.page.close() : console.warn('No Pages Found')
    this.context ? await this.context.close() : console.warn('No Context Found')
})

After({ tags: "@api" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {
    const status = result?.status;
    const scenario = pickle.name;
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    console.log("************************ " + scenario + " API is completed with " + status + "*******************");
})

After({ tags: "@reality" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {
    const status = result?.status;
    const scenario = pickle.name;
    console.log("************************ " + scenario + " is completed with " + status + "*******************");
    await new RealityLogoutPage(this.page).LogoutReality();
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    this.page.close();
    this.context?.close();
})

After({ tags: "@VBSOC" }, async function (this: CustomWorld, { result, pickle }: ITestCaseHookParameter) {
    const status = result?.status;
    const scenario = pickle.name;
    this.page ? await this.page.close() : console.warn('No Pages Found')
    this.context ? await this.context.close() : console.warn('No Context Found')
    this.browser ? await this.browser.close() : console.log("No Browser Found")
    if (status === 'FAILED') { sharedData.previousScenarioStatusFailed = true; sharedData.previousScenarioName = pickle.name }
    console.log("************************ " + scenario + " is completed with " + status + " *******************");
})