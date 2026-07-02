import * as fs from 'fs';
import { execSync } from 'child_process';
 
const report = require('multiple-cucumber-html-reporter');
const singleReport = require('cucumber-html-reporter');
 
report.generate({
  theme: 'bootstrap',
  jsonDir: "./test-result/report",
  reportPath: "./test-result/report",
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  ignoreBadJsonFile: true,
  reportName: "BSM Regression Automation Report",
  pageTitle: "BSM Regression Report",
  displayDuration: false,
  metadata: {
    browser: {
      name: "chrome",
      version: "114",
    },
    device: "SVTSTIF001",
    platform: {
      name: "Windows",
      version: "11",
    },
  },
  customData: {
    title: "Test info",
    data: [
      { label: "Project", value: "BRANCH SYSTEM MODERNAIZATION" },
    ],
  },
});
 
// Detailed report WITH screenshots
singleReport.generate({
  theme: 'bootstrap',
  jsonFile: './test-result/report/cucumber-report.json',
  output: './test-result/report/cucumber-image-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  ignoreBadJsonFile: true,
});
 
fs.renameSync(
  './test-result/report/index.html',
  './test-result/report/Automation-Execution-Dashbaord.html'
);
 
execSync('powershell Compress-Archive -Path ./test-result/report/* -DestinationPath ./test-result/BSMAutomation-Report.zip -Force');