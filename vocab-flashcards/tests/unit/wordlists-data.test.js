const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// wordlists-data.js is a browser script that assigns to window.*; run it in a sandbox.
function loadList() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', '..', 'wordlists-data.js'), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window.WORD_LIST));
}

const LIST = loadList();
const entries = LIST.topics.flatMap((t) => t.words.map((w) => ({ topic: t, w })));
const POS = new Set(['n', 'v', 'adj', 'adv']);

test('has 500 words across uniquely named topics', () => {
  assert.equal(entries.length, 500);
  const ids = LIST.topics.map((t) => t.id);
  const labels = LIST.topics.map((t) => t.label);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(labels).size, labels.length);
  LIST.topics.forEach((t) => assert.ok(t.words.length > 0, `${t.id} is empty`));
});

test('every word is unique (ignoring case)', () => {
  const seen = new Set();
  entries.forEach(({ w }) => {
    const key = w[0].toLowerCase();
    assert.ok(!seen.has(key), `duplicate: ${w[0]}`);
    seen.add(key);
  });
});

test('every entry has all six fields filled in', () => {
  entries.forEach(({ w }) => {
    assert.equal(w.length, 6, `${w[0]} should have 6 fields`);
    w.forEach((field, i) => assert.ok(typeof field === 'string' && field.trim(), `${w[0]}: field ${i} is empty`));
    assert.ok(POS.has(w[2]), `${w[0]}: unknown part of speech "${w[2]}"`);
  });
});

test('transcriptions use American IPA characters only', () => {
  entries.forEach(({ w }) => {
    const ipa = w[1];
    assert.match(ipa, /^[a-zæɑɔəɚɝɛɪʊʌθðʃʒŋɡˈˌː. ]+$/, `${w[0]}: unexpected character in /${ipa}/`);
    assert.doesNotMatch(ipa, /g/, `${w[0]}: use ɡ, not g`);
    // British-only symbols should not appear in a General American list.
    assert.doesNotMatch(ipa, /ɒ|əʊ|eə|ɪə|ʊə/, `${w[0]}: British vowel in /${ipa}/`);
    // One-syllable words have no stress mark, like in the dictionary.
    if (/[. ]/.test(ipa)) assert.match(ipa, /ˈ/, `${w[0]}: no primary stress mark`);
  });
});
