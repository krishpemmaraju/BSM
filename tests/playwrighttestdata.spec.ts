import test from "playwright/test";
import * as data from "../src/config/env/envDetails.json"
import SCMLoginPage from "../src/webui/pages/scm/SCMLoginPage";
import UIActions from "../src/webui/actions/UIActions";
import SCMHomePage from "../src/webui/pages/scm/SCMHomePage";

let SCM_URL = data.SCMDEV[0].SCMDEVURL;
let SCM_USERNAME=  data.SCMDEV[0].SCMDEVUSERNAME;
let SCM_PASSWORD =  data.SCMDEV[0].SCMDEVPASSWORD;
test('login into SCM homepage', async ({page}) => {
    await new SCMLoginPage(new UIActions(page)).loginIntoSCMApp(SCM_URL,SCM_USERNAME,SCM_PASSWORD);
    await new SCMHomePage(new UIActions(page)).isHomePageDisplayed();
})