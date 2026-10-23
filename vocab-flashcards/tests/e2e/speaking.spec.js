const { test, expect } = require('./fixtures');

test.describe('Speaking tab', () => {
  test.beforeEach(async ({ app }) => {
    // Record speech instead of playing it, and finish each utterance at once.
    await app.evaluate(() => {
      window.__spoken = [];
      window.speechSynthesis.speak = (u) => {
        window.__spoken.push({ text: u.text, rate: u.rate, lang: u.lang });
        if (u.onend) setTimeout(() => u.onend(), 0);
      };
      window.__played = 0;
      HTMLMediaElement.prototype.play = function play() {
        window.__played += 1;
        setTimeout(() => this.dispatchEvent(new Event('ended')), 0);
        return Promise.resolve();
      };
    });
    await app.click('[data-view=speak]');
  });

  test('shows the first meeting phrase with stress, pauses and tone', async ({ app }) => {
    await expect(app.locator('#sp-position')).toHaveText('1 / 72');
    await expect(app.locator('#sp-confident-count')).toHaveText('0 / 72 confident');
    await expect(app.locator('#sp-sit-label')).toHaveText('Meetings');
    await expect(app.locator('#sp-text .stress')).toHaveText(['start', 'first', 'a', 'lease']);
    await expect(app.locator('#sp-text .pause')).toHaveCount(2);
    await expect(app.locator('#sp-text .tone.fall')).toHaveCount(1);
    await expect(app.locator('#sp-chunk')).toHaveText('item on the agenda');
    await expect(app.locator('#sp-vi')).toContainText('Chúng ta bắt đầu');
  });

  test('hides the Vietnamese meaning when unticked', async ({ app }) => {
    await app.uncheck('#sp-show-vi');
    await expect(app.locator('#sp-vi')).toBeHidden();
    await app.click('#sp-next');
    await expect(app.locator('#sp-vi')).toBeHidden();
  });

  test('filters by situation', async ({ app }) => {
    await app.selectOption('#sp-sit', 'calls');
    await expect(app.locator('#sp-position')).toHaveText('1 / 24');
    await expect(app.locator('#sp-sit-label')).toHaveText('Client calls');
    await expect(app.locator('#sp-chunk')).toHaveText('thanks for joining (the call)');
  });

  test('listens in American English at slow and normal speed, without the markup', async ({ app }) => {
    await app.click('#sp-slow');
    await app.keyboard.press('s');
    const spoken = await app.evaluate(() => window.__spoken);
    expect(spoken.map((s) => s.text)).toEqual(Array(2).fill("Let's get started. The first item on the agenda is the release date."));
    expect(spoken[0].rate).toBeLessThan(spoken[1].rate);
    expect(spoken.every((s) => s.lang === 'en-US')).toBe(true);
  });

  test('shadowing plays the phrase three times with a turn to repeat after each', async ({ app }) => {
    // The gap after each round is at least 1.5 s; drive it with a fake clock.
    await app.clock.install();
    await app.click('#sp-shadow');
    await app.clock.runFor(100);
    await expect(app.locator('#sp-status')).toHaveText('Your turn: say it now (1/3)');
    await app.clock.runFor(1600);
    await expect(app.locator('#sp-status')).toHaveText('Your turn: say it now (2/3)');
    await app.clock.runFor(1600);
    await expect(app.locator('#sp-status')).toHaveText('Your turn: say it now (3/3)');
    await app.clock.runFor(1600);
    await expect(app.locator('#sp-status')).toHaveText('Nice. Now record yourself and compare.');
    expect(await app.evaluate(() => window.__spoken.length)).toBe(3);
  });

  test('records the learner, plays it back and compares with the model', async ({ app }) => {
    await expect(app.locator('#sp-play-mine')).toBeDisabled();
    await app.click('#sp-record');
    await expect(app.locator('#sp-record')).toHaveText('■ Stop');
    await expect(app.locator('#sp-status')).toContainText('Recording');
    await app.waitForTimeout(600);
    await app.keyboard.press('r');
    await expect(app.locator('#sp-record')).toHaveText('🎙 Record');
    await expect(app.locator('#sp-play-mine')).toBeEnabled();

    await app.click('#sp-play-mine');
    await expect.poll(() => app.evaluate(() => window.__played)).toBe(1);

    await app.click('#sp-compare');
    await expect(app.locator('#sp-status')).toHaveText('Which words sounded different? Try again, or mark it.');
    expect(await app.evaluate(() => [window.__spoken.length, window.__played])).toEqual([1, 2]);

    // The recording belongs to its phrase.
    await app.click('#sp-next');
    await expect(app.locator('#sp-play-mine')).toBeDisabled();
    await app.click('#sp-prev');
    await expect(app.locator('#sp-play-mine')).toBeEnabled();
  });

  test('marks phrases confident, filters them and keeps them after a reload', async ({ app }) => {
    await app.click('#sp-mark-confident');
    await expect(app.locator('#sp-confident-count')).toHaveText('1 / 72 confident');
    await expect(app.locator('#sp-position')).toHaveText('2 / 72');

    await app.selectOption('#sp-filter', 'confident');
    await expect(app.locator('#sp-position')).toHaveText('1 / 1');
    await expect(app.locator('#sp-card')).toHaveClass(/confident/);
    await expect(app.locator('#sp-chunk')).toHaveText('item on the agenda');

    await app.reload();
    await app.click('[data-view=speak]');
    await expect(app.locator('#sp-confident-count')).toHaveText('1 / 72 confident');

    await app.selectOption('#sp-filter', 'practising');
    await expect(app.locator('#sp-position')).toHaveText('1 / 71');
    await app.locator('#sp-text').click();
    await app.keyboard.press('1');
    await expect(app.locator('#sp-position')).toHaveText('2 / 71');
  });

  test('IPA practice still speaks British English', async ({ app }) => {
    await app.click('[data-view=ipa]');
    await app.locator('.ipa-tile').first().click();
    await app.locator('.detail-words .speak').first().click();
    const spoken = await app.evaluate(() => window.__spoken);
    expect(spoken.at(-1).lang).toBe('en-GB');
  });
});
