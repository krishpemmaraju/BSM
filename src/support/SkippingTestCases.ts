
let skipScenarios = false;

export function enableSkipScenario() {
    skipScenarios = true;
}

export function shouldSkipScenario(){
    return skipScenarios;
}

export function resetSkippingStatus() {
    skipScenarios = false;
}