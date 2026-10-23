const { test, expect } = require('./fixtures');

test.describe('Built-in BA, software & AI word list', () => {
  test('adds 500 words to the deck and keeps the existing ones', async ({ app }) => {
    await expect(app.locator('#topic-field')).toBeHidden();
    await app.click('#add-list');
    await expect(app.locator('#toast')).toHaveText('Added 500 words');
    await expect(app.locator('#known-count')).toHaveText('0 / 506 known');
    await expect(app.locator('#add-list')).toBeHidden();

    // Kept after a reload, and the button does not come back.
    await app.reload();
    await expect(app.locator('#known-count')).toHaveText('0 / 506 known');
    await expect(app.locator('#add-list')).toBeHidden();
  });

  test('filters by topic, with the sample words under My words', async ({ app }) => {
    await app.click('#add-list');
    await expect(app.locator('#topic-field')).toBeVisible();
    const options = await app.locator('#topic option').allTextContents();
    expect(options).toEqual([
      'All topics', 'Business analysis', 'Agile & projects', 'Software & development',
      'Testing & quality', 'Data & cloud', 'AI & machine learning', 'Claude & AI assistants', 'My words',
    ]);

    await app.selectOption('#topic', 'Claude & AI assistants');
    await expect(app.locator('#position')).toHaveText('1 / 46');
    await expect(app.locator('#front-text')).toHaveText('Claude');
    await expect(app.locator('#front-sub')).toHaveText('/klɑːd/ (n)');
    await app.click('#card');
    await expect(app.locator('#back-extra')).toHaveText('Tiếng Việt: Claude (trợ lý AI của Anthropic)');

    await app.selectOption('#topic', 'my-words');
    await expect(app.locator('#position')).toHaveText('1 / 6');
    await expect(app.locator('#front-text')).toHaveText('ephemeral');
  });

  test('adds only the missing words when some are already in the deck', async ({ app }) => {
    await app.click('[data-view="manage"]');
    await app.fill('#f-word', 'API');
    await app.fill('#f-meaning', 'My own meaning');
    await app.click('#save-btn');
    await app.click('[data-view="study"]');
    await app.click('#add-list');
    await expect(app.locator('#toast')).toHaveText('Added 499 words');
    await expect(app.locator('#known-count')).toHaveText('0 / 506 known');
  });

  test('exports the topic with each list word', async ({ app }) => {
    await app.click('#add-list');
    const words = await app.evaluate(() => JSON.parse(localStorage.getItem('vocab-flashcards.v1')));
    const api = words.find((w) => w.word === 'API');
    expect(api.topic).toBe('Software & development');
    expect(api.sub).toBe('/ˌeɪ.piːˈaɪ/ (n)');
    expect(words.find((w) => w.word === 'ephemeral').topic).toBeUndefined();
  });
});
