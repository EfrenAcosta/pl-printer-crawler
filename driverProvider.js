const RunChomeHeadless = true;
const chromeDriver = require('@sitespeed.io/chromedriver');
const { Builder, logging } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const getDriver = async (downloadFolder, enablePerformanceLogging = false) => {
  const options = new Chrome.Options;
  options.addArguments('--no-sandbox'); //needed to run as root on ubuntu server
  options.addArguments('--incognito');
  options.addArguments('--disable-popup-blocking');
  options.addArguments('--disable-default-apps');
  options.addArguments('--disable-infobars');
  options.addArguments('--disable-extensions');

  options.setUserPreferences({
    'plugins.always_open_pdf_externally': true,
    'Browser.setDownloadBehavior': 'allow',
    'download.default_directory': downloadFolder
  });

  if (enablePerformanceLogging) {
    //set performance logs including network events so we can detect / track downloads
    let logPrefs = new logging.Preferences();
    logPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL.name);
    options.setLoggingPrefs(logPrefs);
    options.set('goog:loggingPrefs', logPrefs);
  }

  if (RunChomeHeadless) {
    options.headless();
  }

  const service = new Chrome.ServiceBuilder(chromeDriver.binPath());
  const driver = await new Builder().forBrowser('chrome').setChromeService(service).setChromeOptions(options).build();
  driver.setDownloadPath(downloadFolder);

  //when running headless, you must enable file downloads manually
  await driver.sendDevToolsCommand('Page.setDownloadBehavior', { 'behavior': 'allow', 'downloadPath': downloadFolder })

  const timeouts = {
    implicit: 0,
    pageLoad: 600000,
    script: 300000
  };

  await driver.manage().setTimeouts(timeouts);
  return driver;
};

module.exports.getDriver = getDriver;