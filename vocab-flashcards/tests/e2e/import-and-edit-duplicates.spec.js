// Authored in the BA/QA practice (Day 9). Acceptance criteria come from
// ba-qa-practice/day-06/test-matrix.md (rows IMP-1, IMP-2, EDT-1, EDT-2).
//
// The two tests marked test.fail() describe the behaviour we WANT but the app
// does not have yet (bugs BUG-1 and BUG-2, ba-qa-practice/day-06/bug-reports.md).
// Playwright counts a test.fail() test as passing while the bug exists, and as a
// failure the day the bug is fixed, which is the signal to delete the marker.
const { test, expect } = require('./fixtures');

const rowsFor = (page, word) =>
  page.locator('.word-item .w', { hasText: new RegExp(`^${word}$`) });

async function importFile(page, name, mimeType, text) {
  await page.setInputFiles('#import', { name, mimeType, buffer: Buffer.from(text) });
}

test.describe('Import and edit: duplicate words', () => {
  test.beforeEach(async ({ app }) => {
    await app.click('[data-view=manage]');
  });

  test('IMP-1 import skips a word that is already in the deck', async ({ app }) => {
    await importFile(app, 'one.json', 'application/json',
      JSON.stringify([{ word: 'ephemeral', meaning: 'dup of a sample word' }, { word: 'zebra', meaning: 'an animal' }]));
    await expect(app.locator('#toast')).toHaveText('Imported 1 word(s), skipped 1 duplicate(s)');
    await expect(rowsFor(app, 'ephemeral')).toHaveCount(1);
    await expect(rowsFor(app, 'zebra')).toHaveCount(1);
  });

  test('IMP-2 import keeps one copy when the same word appears twice in the file [BUG-1]', async ({ app }) => {
    test.fail(true, 'BUG-1: duplicates inside one file are all imported');
    await importFile(app, 'dup.json', 'application/json',
      JSON.stringify([{ word: 'zebra', meaning: 'an animal' }, { word: 'zebra', meaning: 'an animal again' }]));
    await expect(rowsFor(app, 'zebra')).toHaveCount(1);
  });

  test('EDT-1 editing a word to a new spelling keeps the deck size', async ({ app }) => {
    await app.locator('.word-item', { has: app.locator('.w', { hasText: /^ephemeral$/ }) })
      .getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-word', 'transient');
    await app.click('#save-btn');
    await expect(rowsFor(app, 'transient')).toHaveCount(1);
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('EDT-2 editing a word into an existing word asks first [BUG-2]', async ({ app }) => {
    const other = await app.locator('.word-item .w').nth(1).innerText();
    await app.locator('.word-item').first().getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-word', other);
    await app.click('#save-btn');
    await expect(app.locator('#confirm-overlay')).toBeVisible();
  });
});
