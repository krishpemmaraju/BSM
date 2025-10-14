import { ITestCaseHookParameter, IWorld } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import path from "path";
import fs from 'fs';
import {generate} from 'multiple-cucumber-html-reporter'

export default class ReportGeneration {

   async getScreenshotData(page: Page, message: string, messageToAttach: string, world: IWorld) {
      const screensshotExtn: string = '.png';
      const screenshot = await page.screenshot({ path: `./test-result/screenshots/${message}${screensshotExtn}`, fullPage: true });
      world.attach(messageToAttach, 'text/plain');
      world.attach(screenshot, 'image/png');
   }

   async getScreenshot1(page: Page, messageToAttach: string, world: IWorld) {
      const screensshotExtn: string = '.png';
      const screenshotExtn = '.png';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const scenarioName = world.pickle.name.replace(/\s+/g, '_')
      const featureName = world.gherkinDocument?.feature?.name?.replace(/\s+/g, '_') || 'UnknownFeature';
      const filenameBase = `${scenarioName}-${timestamp}`;
      const outputDir = path.join('test-result', 'scenario-reports', featureName);

      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const screenshotPath = path.join(outputDir, `${filenameBase}${screenshotExtn}`);
      const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });

      world.attach(messageToAttach, 'text/plain');
      world.attach(screenshot, 'image/png');

      const jsonPath = path.join(outputDir, `${filenameBase}.json`);
      const scenarioData = [
         {
            feature: featureName,
            name: world.pickle.name,
            status: world.result?.status,
            screenshot: screenshotPath,
            steps: world.pickle.steps.map(step => step.text),
         },
      ];
      fs.writeFileSync(jsonPath, JSON.stringify(scenarioData, null, 2));

      // Generate HTML report
      generate({
         theme: 'bootstrap',
         jsonFile: jsonPath,
         output: path.join(outputDir, `${filenameBase}.html`),
         reportSuiteAsScenarios: true,
         scenarioTimestamp: true,
         launchReport: false,
         metadata: {
            browser: 'Chrome',
            platform: 'Windows 11',
         },
      });

   }


   async getScreenshot(page: Page, messageToAttach: string, world: IWorld) {
      const screenshot = await page.screenshot();
      world.attach(messageToAttach, 'text/plain');
      world.attach(screenshot, 'image/png');
   }

   static async attachReportForAPI(messageToAttach: string, world: IWorld) {
      world.attach(messageToAttach, 'text/plain');
   }
}


