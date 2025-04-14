import { Page } from "@playwright/test";


export default class AlertActions {

    constructor(private page: Page) { }

    async acceptPoPUpMessage(promptText: string): Promise<string> {
        return this.page.waitForEvent("dialog").then(async (dialog) => {
            if (dialog.type() == "prompt") {
                await dialog.accept(promptText);
            } else {
                await dialog.accept();
            }
            return dialog.message().trim();
        });
    }

    async dismissPop(): Promise<string> {
        return this.page.waitForEvent("dialog").then(async (dialog) => {
            await dialog.dismiss();
            return dialog.message().trim();
        })
    }

}