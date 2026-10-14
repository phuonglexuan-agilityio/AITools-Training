const { test, expect } = require('./fixtures');

const overlay = (page) => page.locator('#confirm-overlay');

async function openDeleteConfirm(page, word = 'concise') {
  await page.click('[data-view=manage]');
  await page.locator('.word-item', { hasText: word }).getByRole('button', { name: 'Delete' }).click();
  await expect(overlay(page)).toBeVisible();
}

test.describe('In-page confirm box', () => {
  test('is hidden until something asks', async ({ app }) => {
    await expect(overlay(app)).toBeHidden();
  });

  test('focuses the confirm button, and Enter confirms', async ({ app }) => {
    await openDeleteConfirm(app);
    await expect(app.locator('#confirm-ok')).toBeFocused();
    await app.keyboard.press('Enter');
    await expect(overlay(app)).toBeHidden();
    await expect(app.locator('.word-item')).toHaveCount(5);
  });

  test('Escape cancels', async ({ app }) => {
    await openDeleteConfirm(app);
    await app.keyboard.press('Escape');
    await expect(overlay(app)).toBeHidden();
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('clicking the backdrop cancels, clicking the box does not', async ({ app }) => {
    await openDeleteConfirm(app);
    await app.click('#confirm-msg');
    await expect(overlay(app)).toBeVisible();
    await overlay(app).click({ position: { x: 5, y: 5 } });
    await expect(overlay(app)).toBeHidden();
    await expect(app.locator('.word-item')).toHaveCount(6);
  });

  test('returns focus to the button that opened it', async ({ app }) => {
    await openDeleteConfirm(app);
    await app.click('#confirm-cancel');
    await expect(app.locator('.word-item', { hasText: 'concise' }).getByRole('button', { name: 'Delete' })).toBeFocused();
  });

  test('blocks keyboard shortcuts while open', async ({ app }) => {
    await app.click('[data-view=ipa]');
    await app.click('[data-ipa-mode=quiz]');
    await app.click('#ipa-reset-stats');
    await expect(overlay(app)).toBeVisible();
    await app.keyboard.press('1');
    await app.keyboard.press('Escape');
    await expect(app.locator('#ipa-score')).toHaveText('Score 0 / 0 · Streak 0');
    await expect(app.locator('.opt.correct')).toHaveCount(0);
  });
});
