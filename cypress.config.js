const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 10000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'QA Technical Task',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    videoOnFailOnly: true,
    reportDir: 'report'
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: "https://weathershopper.pythonanywhere.com",
  },
});
