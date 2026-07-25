const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  defaultCommandTimeout: 8000,
  screenshotsFolder: "cypress/screenshots",
  screenshotOnRunFailure: true,
  video: false,
  viewportHeight: 720,
  viewportWidth: 1280,

  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
    },
  },
});
