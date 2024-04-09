import puppeteer, { Browser, Page } from "puppeteer";

export default class Puppeteer {
    private browser: Browser | null;
    private page: Page | null

    constructor() {
        this.browser = null;
        this.page = null;
    }

    public async initializeBrowser() {
        const browser = await puppeteer.launch({
            headless: process.env.env === "dev" ? false : true
        });

        this.browser = browser;
    }

    public async newPage(url: string) {
        if (!this.browser) return;

        const page = await this.browser.newPage();
        page.goto(url);

        this.page = page;
    }
}