import FileSystem from "../services/fileSystem";
import Puppeteer from "../services/puppeteer";

export default async function aramisAuto(browser: Puppeteer, fs: FileSystem) {
    const url = "https://www.aramisauto.com/achat/recherche?search_nb_doors[]=4+ou+5+portes&brands[]=Opel&brands[]=Ford&brands[]=Seat&models[Opel][]=Corsa&models[Ford][]=Fiesta&models[Seat][]=Ibiza&models[Seat][]=Leon&mileage[to]=120000&price[to]=12500.00&page=0&p=0&klxw=1";
    const maxPrice = Number(process.env.MAX_PRICE);
    const maxKilometers = Number(process.env.MAX_KM);

    await browser.newPage(url);

    // Remove cookies without agreeing
    await browser.clickOnSelector(".didomi-continue-without-agreeing");

    // Select price and submit form
    // await browser.selectOption('select[name="price"]', "12500");
    // await browser.selectOption('select[name="mileage"]', "120000");
    // await browser.clickOnSelector('button[title="Lancer la recherche"]');

    // add filters
    // await browser.clickOnCheckbox('#brand-Opel');

    // load offers
    await browser.scrollPage(10);

    // get cars
    const offers = await browser.getElements('.vehicles-sub-container > div');

    if (!offers) {
        console.log('Aucune offre disponible');
        return;
    }

    // get offer one by one
    for (const offer of offers) {
        let model, price, kilometers, href;

        model = await browser.getTextContentInsideParent(offer, ".vehicle-model");
        href = await browser.getLinkHrefInsideParent(offer, ".vehicle-info-link");

        kilometers = await browser.getTextContentInsideParent(offer, ".vehicle-zero-km");

        if (kilometers) {
            const cleanKilometers = kilometers.split("-")[1].replace(/\s/g, '').replace('km', '');
            kilometers = cleanKilometers;
        }

        price = await browser.getTextContentInsideParent(offer, ".vehicle-loa-offer > span");

        if (price) {
            const cleanPrice = price.replace(/\s/g, '');
            price = cleanPrice;
        }

        // append to file only if price and kilometers are numbers
        if (price && kilometers) {
            if (Number(price) < maxPrice && Number(kilometers) < maxKilometers) {
                const content = `${model} | ${price}€ | ${kilometers}KM | aramisauto.com${href} \n`;

                fs.appendFile(content);
            }
        }

    }
}