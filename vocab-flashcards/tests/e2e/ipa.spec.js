const { test, expect } = require('./fixtures');

// Looks up the current quiz question in the app's own data.
function currentQuestion(page) {
  return page.evaluate(() => {
    const text = document.getElementById('ipa-q-text').textContent;
    const items = window.IPA_SOUNDS.flatMap((s) => s.words.map(([word, marked]) => ({
      word, marked, ipa: marked.replace(/[[\]]/g, ''), symbol: s.symbol, group: s.group, alt: s.alt,
    })));
    const options = [...document.querySelectorAll('#ipa-options .opt')].map((o) => o.lastChild.textContent);
    return { text, options, item: items.find((i) => i.word === text || `/${i.ipa}/` === text) };
  });
}

function correctIndex({ options, item }, type) {
  return options.indexOf(type === 'word-ipa' ? `/${item.ipa}/` : item.word);
}

async function openQuiz(page, { scope = 'all', type = 'word-ipa' } = {}) {
  await page.click('[data-ipa-mode=quiz]');
  await page.selectOption('#ipa-scope', scope);
  await page.selectOption('#ipa-quiz-type', type);
  // Shortcuts are ignored while a <select> has focus.
  await page.locator('#ipa-q-text').click();
}

test.describe('IPA practice tab', () => {
  test.beforeEach(async ({ app }) => {
    // Record speech instead of playing it.
    await app.evaluate(() => {
      window.__spoken = [];
      window.speechSynthesis.speak = (u) => window.__spoken.push(u.text);
    });
    await app.click('[data-view=ipa]');
  });

  test.describe('Sound chart', () => {
    test('shows all 44 sounds in 4 groups', async ({ app }) => {
      await expect(app.locator('.ipa-tile')).toHaveCount(44);
      await expect(app.locator('.ipa-group h3')).toHaveText(['Short vowels', 'Long vowels', 'Diphthongs', 'Consonants']);
      await expect(app.locator('.ipa-tile .acc').first()).toHaveText('–');
      await expect(app.locator('#ipa-scope')).toBeHidden();
    });

    test('selecting a sound shows its tip and example words with the sound highlighted', async ({ app }) => {
      await app.locator('.ipa-tile', { hasText: '/θ/' }).click();
      const detail = app.locator('#ipa-detail');
      await expect(detail).toContainText('th (voiceless)');
      await expect(detail).toContainText('Tongue tip lightly between the teeth');
      await expect(detail.locator('.detail-words li')).toHaveCount(3);
      await expect(detail.locator('.detail-words .w')).toHaveText(['think', 'three', 'both']);
      await expect(detail.locator('mark.focus')).toHaveText(['θ', 'θ', 'θ']);
      await expect(detail.locator('.detail-words .ipa').first()).toHaveText('/θɪŋk/');
      await expect(app.locator('.ipa-tile.selected')).toHaveText(/θ/);
    });

    test('speaker buttons say the example word', async ({ app }) => {
      await app.locator('.ipa-tile', { hasText: '/ʃ/' }).click();
      await app.locator('.detail-words li', { hasText: 'wash' }).getByRole('button').click();
      expect(await app.evaluate(() => window.__spoken)).toEqual(['wash']);
    });
  });

  test.describe('Flashcards', () => {
    test('"Flashcards for this sound" opens the 3 words for that sound', async ({ app }) => {
      await app.locator('.ipa-tile', { hasText: '/ɪ/' }).first().click();
      await app.getByRole('button', { name: 'Flashcards for this sound' }).click();

      await expect(app.locator('[data-ipa-mode=cards]')).toHaveClass(/active/);
      await expect(app.locator('#ipa-scope')).toHaveValue('sound:ɪ');
      await expect(app.locator('#ipa-card-pos')).toHaveText('1 / 3');
      await expect(app.locator('#ipa-front-text')).toHaveText('sit');

      await app.keyboard.press('Space');
      await expect(app.locator('#ipa-card')).toHaveClass(/flipped/);
      await expect(app.locator('#ipa-back-text')).toHaveText('/sɪt/');
      await expect(app.locator('#ipa-back-text mark.focus')).toHaveText('ɪ');
      await expect(app.locator('#ipa-back-sound')).toContainText('short i');
    });

    test('navigates and wraps', async ({ app }) => {
      await app.click('[data-ipa-mode=cards]');
      await app.selectOption('#ipa-scope', 'sound:ɪ');
      await app.click('#ipa-next');
      await expect(app.locator('#ipa-front-text')).toHaveText('ship');
      await app.keyboard.press('ArrowLeft');
      await app.keyboard.press('ArrowLeft');
      await expect(app.locator('#ipa-front-text')).toHaveText('milk');
      await expect(app.locator('#ipa-card-pos')).toHaveText('3 / 3');
    });

    test('"IPA first" shows the transcription on the front, without the highlight', async ({ app }) => {
      await app.click('[data-ipa-mode=cards]');
      await app.selectOption('#ipa-scope', 'sound:ɪ');
      await app.check('#ipa-reverse');
      await expect(app.locator('#ipa-front-text')).toHaveText('/sɪt/');
      await expect(app.locator('#ipa-front-text mark')).toHaveCount(0);
      await expect(app.locator('#ipa-back-text')).toHaveText('sit');
    });

    test('a group scope contains every word in that group', async ({ app }) => {
      await app.click('[data-ipa-mode=cards]');
      await app.selectOption('#ipa-scope', 'group:diphthong');
      await expect(app.locator('#ipa-card-pos')).toHaveText('1 / 24');
      await app.selectOption('#ipa-scope', 'all');
      await expect(app.locator('#ipa-card-pos')).toHaveText('1 / 132');
    });

    test('plays the word with the button and the S key', async ({ app }) => {
      await app.click('[data-ipa-mode=cards]');
      await app.selectOption('#ipa-scope', 'sound:ɪ');
      await app.click('#ipa-card-speak');
      await app.locator('body').click({ position: { x: 1, y: 1 } });
      await app.keyboard.press('s');
      expect(await app.evaluate(() => window.__spoken)).toEqual(['sit', 'sit']);
    });

    test('IPA shortcuts do not change the Study tab', async ({ app }) => {
      await app.click('[data-ipa-mode=cards]');
      await app.keyboard.press('2');
      await app.click('[data-view=study]');
      await expect(app.locator('#known-count')).toHaveText('0 / 6 known');
    });
  });

  test.describe('Quiz', () => {
    test('word → IPA: 4 different options, all made by swapping the focus sound', async ({ app }) => {
      await openQuiz(app, { type: 'word-ipa' });
      for (let i = 0; i < 15; i++) {
        const q = await currentQuestion(app);
        expect(q.item, `question "${q.text}"`).toBeTruthy();
        expect(new Set(q.options).size).toBe(4);
        const expected = [q.item.ipa, ...q.item.alt.map((a) => q.item.marked.replace(/\[[^\]]*\]/, a))].map((t) => `/${t}/`);
        expect(q.options.sort()).toEqual(expected.sort());
        await app.keyboard.press('1');
        await app.keyboard.press('Enter');
      }
    });

    test('a correct answer scores and is marked green', async ({ app }) => {
      await openQuiz(app);
      const q = await currentQuestion(app);
      await app.locator('.opt').nth(correctIndex(q, 'word-ipa')).click();

      await expect(app.locator('#ipa-feedback')).toContainText('Correct!');
      await expect(app.locator('#ipa-feedback mark.focus')).toHaveText(q.item.symbol);
      await expect(app.locator('.opt.correct')).toHaveCount(1);
      await expect(app.locator('.opt.wrong')).toHaveCount(0);
      await expect(app.locator('#ipa-score')).toHaveText('Score 1 / 1 · Streak 1');
      for (const opt of await app.locator('.opt').all()) await expect(opt).toBeDisabled();
      await expect(app.locator('#ipa-q-next')).toBeEnabled();
    });

    test('a wrong answer shows the right one and resets the streak', async ({ app }) => {
      await openQuiz(app);
      let q = await currentQuestion(app);
      await app.locator('.opt').nth(correctIndex(q, 'word-ipa')).click();
      await app.click('#ipa-q-next');

      q = await currentQuestion(app);
      const wrong = (correctIndex(q, 'word-ipa') + 1) % 4;
      await app.locator('.opt').nth(wrong).click();

      await expect(app.locator('#ipa-feedback')).toContainText('Not quite.');
      await expect(app.locator('.opt').nth(wrong)).toHaveClass(/wrong/);
      await expect(app.locator('.opt').nth(correctIndex(q, 'word-ipa'))).toHaveClass(/correct/);
      await expect(app.locator('#ipa-score')).toHaveText('Score 1 / 2 · Streak 0');
    });

    test('can only answer once per question', async ({ app }) => {
      await openQuiz(app);
      await app.keyboard.press('1');
      await app.keyboard.press('2');
      await expect(app.locator('#ipa-score')).toContainText('/ 1');
    });

    test('IPA → word: hides the audio until answered, options are words', async ({ app }) => {
      await openQuiz(app, { type: 'ipa-word' });
      const q = await currentQuestion(app);
      expect(q.text).toBe(`/${q.item.ipa}/`);
      expect(q.options).toContain(q.item.word);
      expect(new Set(q.options).size).toBe(4);
      await expect(app.locator('#ipa-q-speak')).toBeHidden();

      await app.locator('.opt').nth(correctIndex(q, 'ipa-word')).click();
      await app.locator('#ipa-feedback').getByRole('button', { name: /Hear/ }).click();
      expect(await app.evaluate(() => window.__spoken)).toEqual([q.item.word]);
    });

    test('questions stay inside the chosen group', async ({ app }) => {
      await openQuiz(app, { scope: 'group:consonant', type: 'ipa-word' });
      for (let i = 0; i < 10; i++) {
        const q = await currentQuestion(app);
        expect(q.item.group).toBe('consonant');
        await app.keyboard.press('1');
        await app.keyboard.press('Enter');
      }
    });

    test('questions stay on a single chosen sound and do not repeat back to back', async ({ app }) => {
      await openQuiz(app, { scope: 'sound:θ' });
      let last = null;
      for (let i = 0; i < 8; i++) {
        const q = await currentQuestion(app);
        expect(q.item.symbol).toBe('θ');
        expect(q.item.word).not.toBe(last);
        last = q.item.word;
        await app.keyboard.press('1');
        await app.keyboard.press('Enter');
      }
    });

    test('accuracy is saved per sound, shown on the chart, and can be reset', async ({ app }) => {
      await openQuiz(app, { scope: 'sound:ʒ' });
      const q = await currentQuestion(app);
      await app.locator('.opt').nth(correctIndex(q, 'word-ipa')).click();

      await app.click('[data-ipa-mode=chart]');
      const tile = app.locator('.ipa-tile', { hasText: '/ʒ/' });
      await expect(tile.locator('.acc')).toHaveText('100%');
      await expect(tile.locator('.acc')).toHaveClass(/high/);

      await app.reload();
      await app.click('[data-view=ipa]');
      await expect(app.locator('.ipa-tile', { hasText: '/ʒ/' }).locator('.acc')).toHaveText('100%');

      await app.click('[data-ipa-mode=quiz]');
      await app.click('#ipa-reset-stats');
      await app.click('#confirm-ok');
      await app.click('[data-ipa-mode=chart]');
      await expect(app.locator('.ipa-tile', { hasText: '/ʒ/' }).locator('.acc')).toHaveText('–');
    });
  });

  test('fits a phone screen without horizontal scrolling', async ({ app }) => {
    await app.setViewportSize({ width: 375, height: 800 });
    for (const mode of ['chart', 'cards', 'quiz']) {
      await app.click(`[data-ipa-mode=${mode}]`);
      const overflow = await app.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${mode} overflows`).toBe(false);
    }
  });
});
