const  { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const driverProvider = require('./driverProvider.js');

async function pageCrawler(serialNumber, modelNumber) {
    
    const driver = await driverProvider.getDriver('./', true);
    
    try {
        await driver.get('https://support.hp.com/us-en/checkwarranty');
        await driver.sleep(5000);
        driver.findElement(By.id('wFormSerialNumber')).sendKeys(`${serialNumber}\n`);

        // Wait for the cookies privacy popup
        await driver.sleep(5000);
        try {
            let cookieWindow = await driver.findElement(By.id('onetrust-accept-btn-handler'));
            cookieWindow.click()
        } catch(e) {
            console.log("privacy popup not found");
        }

        await driver.sleep(5000);
        try {
            // Try to find the input for product number if required
            let productNumberForm = await driver.findElement(By.id('wFormProductNum'));
            productNumberForm.sendKeys(`${modelNumber}\n`);
        } catch(e) { 
            console.log(" product number input not found");
        }

        // Waits for the next page load and save the source
        await driver.sleep(3000);
        const source = await driver.getPageSource();

        return source;
    } finally {
        console.log("done");
        await driver.quit();
    }
}

module.exports = pageCrawler;

