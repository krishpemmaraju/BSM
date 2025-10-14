import { chromium, firefox } from "playwright";

let headlessConfig: boolean = true;

export default class WebBrowserManager {
    public static async launch(browser: string) {
        switch (browser) {
            case 'chrome':
            case 'chromium':
                return await chromium.launch({
                    slowMo: 3000,
                    headless: headlessConfig,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
                    ignoreDefaultArgs: ['--enable-automation'],
                    timeout: 60000
                })
            case 'firefox':
                return await firefox.launch({
                    slowMo: 3000,
                    headless: headlessConfig,
                    ignoreDefaultArgs: ['--enable-automation'],
                    timeout: 60000,
                    firefoxUserPrefs: {
                        'browser.startup.homepage': 'about:blank'
                    }
                })
            case 'webkit':
                return await chromium.launch({
                    slowMo: 3000,
                    headless: headlessConfig,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
                    timeout: 60000
                })
            default:
                return await chromium.launch({
                    slowMo: 3000,
                    headless: headlessConfig,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
                    ignoreDefaultArgs: ['--enable-automation'],
                    timeout: 60000
                });

        }
    }
}