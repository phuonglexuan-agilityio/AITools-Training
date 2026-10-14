const path = require('path');
const { pathToFileURL } = require('url');
const base = require('@playwright/test');

const APP_URL = pathToFileURL(path.join(__dirname, '..', '..', 'index.html')).href;

// Opens the app in a fresh context (so localStorage starts empty) and fails
// the test if the page throws, logs a console error or opens a native dialog
// (the app asks with its own in-page confirm box instead).
const test = base.test.extend({
  app: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('dialog', (d) => { errors.push(`native ${d.type()} dialog: ${d.message()}`); d.dismiss(); });
    await page.goto(APP_URL);
    await use(page);
    base.expect(errors, 'page errors').toEqual([]);
  },
});

module.exports = { test, expect: base.expect, APP_URL };
