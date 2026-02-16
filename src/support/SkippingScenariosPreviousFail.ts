import { sharedData } from "./SharedData";


export function handleFailScenarioBeforeScenario(worldContext: any, scenarioName: any) {
    console.log("Actual hook context:", worldContext.constructor.name);
    if (sharedData.previousScenarioStatusFailed) {
        console.log("Skipping the scenario " + scenarioName.name + " as previous scenario " + sharedData.previousScenarioName + " got failed.");
        worldContext.skip();
    }
}