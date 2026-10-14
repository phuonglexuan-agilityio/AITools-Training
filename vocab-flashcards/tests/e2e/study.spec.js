const { test, expect } = require('./fixtures');

const SAMPLE = ['ephemeral', 'meticulous', 'ubiquitous', 'mitigate', 'concise', 'ambiguous'];

test.describe('Study tab', () => {
  test('loads the sample deck on first run', async ({ app }) => {
    await expect(app.locator('#position')).toHaveText('1 / 6');
    await expect(app.locator('#front-text')).toHaveText('ephemeral');
    await expect(app.locator('#known-count')).toHaveText('0 / 6 known');
  });

  test('flips the card by click and by Space', async ({ app }) => {
    const card = app.locator('#card');
    await card.click();
    await expect(card).toHaveClass(/flipped/);
    await expect(app.locator('#back-text')).toHaveText('Lasting for a very short time');
    await expect(app.locator('#back-example')).toContainText('social media');
    await app.keyboard.press('Space');
    await expect(card).not.toHaveClass(/flipped/);
  });

  test('navigates with buttons and arrow keys, wrapping around', async ({ app }) => {
    await app.click('#next');
    await expect(app.locator('#front-text')).toHaveText('meticulous');
    await app.keyboard.press('ArrowLeft');
    await expect(app.locator('#front-text')).toHaveText('ephemeral');
    await app.click('#prev');
    await expect(app.locator('#front-text')).toHaveText('ambiguous');
    await expect(app.locator('#position')).toHaveText('6 / 6');
    await app.keyboard.press('ArrowRight');
    await expect(app.locator('#position')).toHaveText('1 / 6');
  });

  test('marks words known and filters by status', async ({ app }) => {
    await app.click('#mark-known');
    await expect(app.locator('#known-count')).toHaveText('1 / 6 known');
    await expect(app.locator('#position')).toHaveText('2 / 6');

    await app.selectOption('#filter', 'known');
    await expect(app.locator('#position')).toHaveText('1 / 1');
    await expect(app.locator('#front-text')).toHaveText('ephemeral');
    await expect(app.locator('#card')).toHaveClass(/known/);

    await app.selectOption('#filter', 'learning');
    await expect(app.locator('#position')).toHaveText('1 / 5');
    await expect(app.locator('#front-text')).toHaveText('meticulous');
  });

  test('a card marked known drops out of the "still learning" filter', async ({ app }) => {
    await app.selectOption('#filter', 'learning');
    await app.keyboard.press('2');
    await expect(app.locator('#position')).toHaveText('1 / 5');
    await expect(app.locator('#front-text')).toHaveText('meticulous');
    await expect(app.locator('#known-count')).toHaveText('1 / 6 known');
  });

  test('shows an empty state when nothing matches the filter', async ({ app }) => {
    await app.selectOption('#filter', 'known');
    await expect(app.locator('#empty-study')).toBeVisible();
    await expect(app.locator('#card-wrap')).toBeHidden();
    await expect(app.locator('#position')).toHaveText('0 / 0');
    await expect(app.locator('#mark-known')).toBeDisabled();
  });

  test('word front: the back shows the English and Vietnamese meanings', async ({ app }) => {
    await expect(app.locator('#back-text')).toHaveText('Lasting for a very short time');
    await expect(app.locator('#back-extra')).toHaveText('Tiếng Việt: phù du, chóng tàn');
    await expect(app.locator('#back-extra')).toHaveAttribute('lang', 'vi');
  });

  test('"English meaning" front swaps the faces', async ({ app }) => {
    await app.selectOption('#front-mode', 'meaning');
    await expect(app.locator('#front-label')).toHaveText('Meaning');
    await expect(app.locator('#front-text')).toHaveText('Lasting for a very short time');
    await expect(app.locator('#back-text')).toHaveText('ephemeral');
    await expect(app.locator('#back-sub')).toHaveText('/ɪˈfem.ər.əl/ (adj)');
    await expect(app.locator('#back-extra')).toHaveText('Tiếng Việt: phù du, chóng tàn');
  });

  test('"Vietnamese meaning" front: guess the English word', async ({ app }) => {
    await app.selectOption('#front-mode', 'vi');
    await expect(app.locator('#front-label')).toHaveText('Tiếng Việt');
    await expect(app.locator('#front-text')).toHaveText('phù du, chóng tàn');
    await expect(app.locator('#front-text')).toHaveAttribute('lang', 'vi');
    await expect(app.locator('#back-text')).toHaveText('ephemeral');
    await expect(app.locator('#back-extra')).toHaveText('Meaning: Lasting for a very short time');
  });

  test('a word without Vietnamese shows its English meaning on a Vietnamese front', async ({ app }) => {
    await app.click('[data-view=manage]');
    await app.fill('#f-word', 'resilient');
    await app.fill('#f-meaning', 'Able to recover quickly');
    await app.click('#save-btn');
    await app.click('[data-view=study]');
    await app.selectOption('#front-mode', 'vi');
    await app.click('#prev');
    await expect(app.locator('#front-text')).toHaveText('Able to recover quickly');
    await expect(app.locator('#front-label')).toHaveText('Meaning');
    await expect(app.locator('#back-extra')).toHaveText('');
  });

  test('a deck saved before Vietnamese was added gets it for the sample words', async ({ app }) => {
    await app.evaluate(() => localStorage.setItem('vocab-flashcards.v1', JSON.stringify([
      { id: 'a', word: 'ephemeral', meaning: 'Lasting for a very short time', known: true },
      { id: 'b', word: 'mine', meaning: 'My own word' },
    ])));
    await app.reload();
    await expect(app.locator('#back-extra')).toHaveText('Tiếng Việt: phù du, chóng tàn');
    await expect(app.locator('#known-count')).toHaveText('1 / 2 known');
    await app.click('#next');
    await expect(app.locator('#back-extra')).toHaveText('');
  });

  test('shuffle keeps every card in the deck', async ({ app }) => {
    await app.click('#shuffle');
    const seen = [];
    for (let i = 0; i < SAMPLE.length; i++) {
      seen.push(await app.locator('#front-text').textContent());
      await app.click('#next');
    }
    expect(seen.sort()).toEqual([...SAMPLE].sort());
  });

  test('progress persists after reload', async ({ app }) => {
    await app.click('#mark-known');
    await app.click('#mark-known');
    await app.reload();
    await expect(app.locator('#known-count')).toHaveText('2 / 6 known');
  });
});
