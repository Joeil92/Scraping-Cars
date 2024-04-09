import Puppeteer from "../services/puppeteer";

export default async function laCentrale(browser: Puppeteer) {
    await browser.newPage("https://www.lacentrale.fr/");
}