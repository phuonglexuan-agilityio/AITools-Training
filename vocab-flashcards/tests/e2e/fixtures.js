const path = require('path');
const { pathToFileURL } = require('url');
const base = require('@playwright/test');

const APP_URL = pathToFileURL(path.join(__dirname, '..', '..', 'index.html')).href;

// Opens the app in a fresh context (so localStorage starts empty) and fails
// the test if the page throws or logs a console error.
const test = base.test.extend({
  app: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(APP_URL);
    await use(page);
    base.expect(errors, 'page errors').toEqual([]);
  },
});

module.exports = { test, expect: base.expect, APP_URL };
