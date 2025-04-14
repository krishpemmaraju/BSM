import { setWorldConstructor, World } from "@cucumber/cucumber";


export default class CustomWorld extends World {
      getBaseURL:any = {};
      sampleData: any = {};
}

setWorldConstructor(CustomWorld);