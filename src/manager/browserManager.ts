import { chromium, firefox, LaunchOptions, webkit } from "playwright";


const browserOptions: LaunchOptions = {
    slowMo: 2000,
    headless:false,
    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
    timeout: 9000
}

export default class WebBrowserManager {

    public static async launch(browser: string){
        if( browser === "chrome")
            return chromium.launch(browserOptions);
        if( browser === "firefox")
            return firefox.launch(browserOptions);
        if ( browser === "opera" || browser === "safari")
            return webkit.launch(browserOptions);
    }
}