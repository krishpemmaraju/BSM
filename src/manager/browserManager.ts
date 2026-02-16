import { chromium, firefox } from "playwright";

let headlessConfig: boolean = false;

export default class WebBrowserManager {

    public static async launch(browser: string) {
        const browserOptions = {
            slowMo: 800,
            headless: headlessConfig,
            timeout: 60000,
            ignoreDefaultArgs: ['--enable-automation']
        }
        switch (browser.toLowerCase()) {
            case 'chrome':
            case 'chromium':
                return await chromium.launch({
                    ...browserOptions,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins", "--no-sandbox", "--disable-dev-shm-usage"]
                })
            case 'firefox':
                return await firefox.launch({
                    ...browserOptions,
                    args: ['-width', '1920', '-height', '1080'],
                    ignoreDefaultArgs: ['--enable-automation'],
                    firefoxUserPrefs: {
                        'browser.startup.homepage': 'about:blank',
                        "browser.tabs.warnOnClose": false,
                        'browser.tabs.loadInBackground': false
                    }
                })
            case 'webkit':
                return await chromium.launch({
                    ...browserOptions,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
                })
            default:
                return await chromium.launch({
                    ...browserOptions,
                    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
                });

        }
    }
}