import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import timeout from "../utils/timeout";

export default class Puppeteer {
    private browser: Browser | null;
    private page: Page | null;

    constructor() {
        this.browser = null;
        this.page = null;
    }

    public async initializeBrowser() {
        const browser = await puppeteer.launch({
            headless: process.env.env === "dev" ? false : true,
            devtools: process.env.env === "dev" ? true : false,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                '--start-fullscreen'
            ]
        });

        this.browser = browser;
    }

    public sendMessage(msg: string) {
        if(process.env.env === 'dev') {
            console.log(msg);
        }
    } 

    public async newPage(url: string) {
        if (!this.browser) return;

        const page = await this.browser.newPage();
        page.goto(url);

        this.page = page;

        console.log(`Nouvelle page : ${url.split('.')[1]}`);
    }

    public async scrollPage(nbScroll: number) {
        if (!this.page) return;

        this.sendMessage("Chargement des offres");

        for (let i = 0; i < nbScroll; i++) {
            await this.page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await timeout(2000);
        };
    }

    public async clickOnSelector(selector: string) {
        if (!this.page) return;

        try {
            await this.page.waitForSelector(selector);
            await this.page.click(selector);
        } catch (error) {
            throw new Error('Selector not found');
        }
    }

    public async clickOnCheckbox(selector: string) {
        if(!this.page) return;

        try {
            const checkbox = await this.page.waitForSelector(selector);
            console.log(checkbox);
            if(!checkbox) throw new Error('Checkbox not found');

            await checkbox.click();
        } catch (error) {
            console.log(error);
            throw new Error('Checkbox not found');
        }
    }

    public async selectOption(select: string, option: string) {
        if (!this.page) return;

        try {
            await this.page.waitForSelector(select);

            const element = await this.page.$(select);

            if (!element) throw new Error('Select not found');

            await element.select(option);
        } catch (error) {
            throw new Error(`option ${option} not found in ${select}`);
        }
    }

    public async getElements(parentElement: string) {
        if (!this.page) return;

        try {
            await this.page.waitForSelector(parentElement);

            const elements = await this.page.$$(parentElement);

            return elements;
        } catch (error) {
            throw new Error('Element not found');
        }
    }

    public async getLinkHrefInsideParent(parentElement: ElementHandle<Element>, childrenElement: string) {
        try {
            const href = await parentElement.$eval(childrenElement, el => el.getAttribute('href'));
            return href;
        } catch (error) {
            this.sendMessage(error as string);
            return null;
        }
    }

    public async getTextContentInsideParent(parentElement: ElementHandle<Element>, childrenElement: string) {
        try {
            const textContent = await parentElement.$eval(childrenElement, el => el.textContent);
            return textContent;
        } catch (error) {
            this.sendMessage(error as string);
            return null;
        }
    }

    public async getTextContent(element: ElementHandle<Element>) {
        return await element.evaluate(el => el.textContent);
    }

    public async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }

        this.browser = null;

        process.exit(0);
    }
}