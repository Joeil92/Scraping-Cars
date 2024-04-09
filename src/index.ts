import Puppeteer from "./services/puppeteer";
import laCentrale from "./websites/laCentrale";
import dotenv from 'dotenv';

dotenv.config();

(async () => {

    // launch puppeteer
    const puppeteer = new Puppeteer();
    await puppeteer.initializeBrowser();
    
    // websites
    await laCentrale(puppeteer);

})();