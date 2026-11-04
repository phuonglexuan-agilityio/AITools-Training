// Authored in the BA/QA practice (Day 9). Acceptance criteria come from
// ba-qa-practice/day-06/test-matrix.md (rows IMP-1, IMP-2, EDT-1, EDT-2).
//
// IMP-2 and EDT-2 first shipped with test.fail() while BUG-1 and BUG-2 were open
// (ba-qa-practice/day-06/bug-reports.md). The capstone fix removed the markers.
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

  test('IMP-2 import keeps one copy when the same word appears twice in the file', async ({ app }) => {
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

  test('EDT-2 editing a word into an existing word asks first', async ({ app }) => {
    const other = await app.locator('.word-item .w').nth(1).innerText();
    await app.locator('.word-item').first().getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-word', other);
    await app.click('#save-btn');
    await expect(app.locator('#confirm-overlay')).toBeVisible();
  });

  test('IMP-5 duplicates in a file are matched ignoring letter case', async ({ app }) => {
    await importFile(app, 'case.json', 'application/json',
      JSON.stringify([{ word: 'Zebra', meaning: 'an animal' }, { word: 'zebra', meaning: 'again' }]));
    await expect(app.locator('.word-item .w', { hasText: /^zebra$/i })).toHaveCount(1);
    await expect(app.locator('#toast')).toHaveText('Imported 1 word(s), skipped 1 duplicate(s)');
  });

  test('EDT-3 Cancel on the edit question leaves the deck unchanged', async ({ app }) => {
    const names = await app.locator('.word-item .w').allInnerTexts();
    await app.locator('.word-item').nth(1).getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-word', names[0]);
    await app.click('#save-btn');
    await app.click('#confirm-cancel');
    expect(await app.locator('.word-item .w').allInnerTexts()).toEqual(names);
  });

  test('EDT-4 changing only the meaning does not ask', async ({ app }) => {
    await app.locator('.word-item').first().getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-meaning', 'a new meaning');
    await app.click('#save-btn');
    await expect(app.locator('#confirm-overlay')).toBeHidden();
    await expect(app.locator('#toast')).toHaveText('Word updated');
  });

  test('EDT-5 OK on the edit question saves the word', async ({ app }) => {
    const names = await app.locator('.word-item .w').allInnerTexts();
    await app.locator('.word-item').nth(1).getByRole('button', { name: /edit/i }).click();
    await app.fill('#f-word', names[0]);
    await app.click('#save-btn');
    await app.click('#confirm-ok');
    await expect(app.locator('.word-item .w', { hasText: new RegExp(`^${names[0]}$`) })).toHaveCount(2);
  });
});
