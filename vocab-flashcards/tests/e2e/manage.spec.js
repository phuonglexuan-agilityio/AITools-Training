const fs = require('fs');
const { test, expect } = require('./fixtures');

const item = (page, word) => page.locator('.word-item', { has: page.locator('.w', { hasText: new RegExp(`^${word}$`) }) });

async function addWord(page, word, meaning, extra = {}) {
  await page.fill('#f-word', word);
  await page.fill('#f-meaning', meaning);
  if (extra.sub) await page.fill('#f-sub', extra.sub);
  if (extra.example) await page.fill('#f-example', extra.example);
  await page.click('#save-btn');
}

test.describe('Manage words tab', () => {
  test.beforeEach(async ({ app }) => {
    app.on('dialog', (d) => d.accept());
    await app.click('[data-view=manage]');
  });

  test('lists the sample words', async ({ app }) => {
    await expect(app.locator('.word-item')).toHaveCount(6);
    await expect(item(app, 'ephemeral')).toContainText('Lasting for a very short time');
    await expect(item(app, 'ephemeral').locator('.badge')).toHaveText('learning');
  });

  test('adds a word that then appears in Study', async ({ app }) => {
    await addWord(app, 'resilient', 'Able to recover quickly', { sub: '(adj)', example: 'Children are resilient.' });
    await expect(app.locator('.word-item')).toHaveCount(7);
    await expect(item(app, 'resilient')).toContainText('Children are resilient.');
    await expect(app.locator('#f-word')).toHaveValue('');
    await expect(app.locator('#toast')).toHaveText('Word added');

    await app.click('[data-view=study]');
    await expect(app.locator('#position')).toHaveText('1 / 7');
  });

  test('requires a word and a meaning', async ({ app }) => {
    await app.fill('#f-word', 'lonely');
    await app.click('#save-btn');
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('asks before adding a duplicate and respects "cancel"', async ({ app }) => {
    app.removeAllListeners('dialog');
    app.once('dialog', (d) => d.dismiss());
    await addWord(app, 'Ephemeral', 'again');
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('edits a word', async ({ app }) => {
    await item(app, 'concise').getByRole('button', { name: 'Edit' }).click();
    await expect(app.locator('#form-title')).toHaveText('Edit word');
    await expect(app.locator('#f-word')).toHaveValue('concise');
    await app.fill('#f-meaning', 'Short and clear');
    await app.click('#save-btn');

    await expect(item(app, 'concise')).toContainText('Short and clear');
    await expect(app.locator('.word-item')).toHaveCount(6);
    await expect(app.locator('#form-title')).toHaveText('Add a word');
  });

  test('cancelling an edit leaves the word unchanged', async ({ app }) => {
    await item(app, 'concise').getByRole('button', { name: 'Edit' }).click();
    await app.fill('#f-meaning', 'changed');
    await app.click('#cancel-edit');
    await expect(item(app, 'concise')).not.toContainText('changed');
    await expect(app.locator('#cancel-edit')).toBeHidden();
  });

  test('deletes a word', async ({ app }) => {
    await item(app, 'mitigate').getByRole('button', { name: 'Delete' }).click();
    await expect(app.locator('.word-item')).toHaveCount(5);
    await expect(item(app, 'mitigate')).toHaveCount(0);
  });

  test('searches by word and by meaning', async ({ app }) => {
    await app.fill('#search', 'ubiq');
    await expect(app.locator('.word-item')).toHaveCount(1);
    await app.fill('#search', 'interpretation');
    await expect(app.locator('.word-item .w')).toHaveText(['ambiguous']);
    await app.fill('#search', 'zzz');
    await expect(app.locator('#empty-list')).toHaveText('No matching words.');
  });

  test('renders user input as text, not HTML', async ({ app }) => {
    const evil = '<img src=x onerror="window.__xss=1">';
    await addWord(app, evil, 'test');
    await expect(app.locator('.word-item .w', { hasText: evil })).toHaveCount(1);
    expect(await app.evaluate(() => window.__xss)).toBeUndefined();
  });

  test('imports CSV lines and skips duplicates', async ({ app }) => {
    await app.setInputFiles('#import', {
      name: 'words.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('resilient,Able to recover quickly,She is resilient, even now\nephemeral,duplicate\n'),
    });
    await expect(app.locator('#toast')).toHaveText('Imported 1 word(s), skipped 1 duplicate(s)');
    await expect(item(app, 'resilient')).toContainText('She is resilient, even now');
    await expect(app.locator('.word-item')).toHaveCount(7);
  });

  test('imports tab-separated lines', async ({ app }) => {
    await app.setInputFiles('#import', {
      name: 'words.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('candid\tTruthful and straightforward\n'),
    });
    await expect(item(app, 'candid')).toContainText('Truthful and straightforward');
  });

  test('imports JSON', async ({ app }) => {
    const data = [{ word: 'candid', meaning: 'Truthful', known: true }, { word: 'no meaning' }];
    await app.setInputFiles('#import', { name: 'w.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
    await expect(app.locator('#toast')).toHaveText('Imported 1 word(s)');
    await expect(item(app, 'candid').locator('.badge')).toHaveText('known');
  });

  test('reports a file it cannot read', async ({ app }) => {
    await app.setInputFiles('#import', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('[not json') });
    await expect(app.locator('#toast')).toHaveText('Could not read that file');
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('exports the deck as JSON', async ({ app }) => {
    const [download] = await Promise.all([app.waitForEvent('download'), app.click('#export')]);
    expect(download.suggestedFilename()).toBe('vocabulary.json');
    const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    expect(exported.map((w) => w.word)).toContain('ephemeral');
    expect(exported).toHaveLength(6);
    expect(Object.keys(exported[0]).sort()).toEqual(['example', 'id', 'known', 'meaning', 'sub', 'word']);
  });

  test('reset restores the sample deck', async ({ app }) => {
    await item(app, 'mitigate').getByRole('button', { name: 'Delete' }).click();
    await addWord(app, 'resilient', 'Able to recover quickly');
    await app.click('#reset');
    await expect(app.locator('.word-item')).toHaveCount(6);
    await expect(item(app, 'mitigate')).toHaveCount(1);
    await expect(item(app, 'resilient')).toHaveCount(0);
  });

  test('changes persist after reload', async ({ app }) => {
    await addWord(app, 'resilient', 'Able to recover quickly');
    await app.reload();
    await app.click('[data-view=manage]');
    await expect(item(app, 'resilient')).toHaveCount(1);
  });
});
