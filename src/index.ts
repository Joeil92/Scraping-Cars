import FileSystem from "./services/fileSystem";
import Puppeteer from "./services/puppeteer";
import aramisAuto from "./websites/aramis-auto";
import laCentrale from "./websites/laCentrale";
import dotenv from 'dotenv';

dotenv.config();

(async () => {

    // launch puppeteer
    const puppeteer = new Puppeteer();
    await puppeteer.initializeBrowser();

    const fs = new FileSystem();
    
    // websites
    // await laCentrale(puppeteer);
    await aramisAuto(puppeteer, fs);

    // await puppeteer.closeBrowser();
})();