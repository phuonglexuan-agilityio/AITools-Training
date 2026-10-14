const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ipa-data.js is a browser script that assigns to window.*; run it in a sandbox.
// The JSON round trip copies the data out of the sandbox's realm so strict
// deep-equality checks compare plain arrays and objects.
function loadData() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', '..', 'ipa-data.js'), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window));
}

const { IPA_GROUPS, IPA_SOUNDS } = loadData();
const allWords = IPA_SOUNDS.flatMap((s) => s.words.map(([word, marked]) => ({ word, marked, sound: s })));
const swapFocus = (marked, sound) => marked.replace(/\[[^\]]*\]/, sound);
const strip = (marked) => marked.replace(/[[\]]/g, '');

test('covers the 44 sounds of British English, grouped correctly', () => {
  assert.equal(IPA_SOUNDS.length, 44);
  const count = (g) => IPA_SOUNDS.filter((s) => s.group === g).length;
  assert.deepEqual(
    { short: count('short'), long: count('long'), diphthong: count('diphthong'), consonant: count('consonant') },
    { short: 7, long: 5, diphthong: 8, consonant: 24 },
  );
});

test('every sound belongs to a known group', () => {
  const ids = new Set(IPA_GROUPS.map((g) => g.id));
  IPA_SOUNDS.forEach((s) => assert.ok(ids.has(s.group), `${s.symbol} has unknown group ${s.group}`));
});

test('symbols are unique', () => {
  const symbols = IPA_SOUNDS.map((s) => s.symbol);
  assert.equal(new Set(symbols).size, symbols.length);
});

test('every sound has a name, a tip and exactly 3 example words', () => {
  IPA_SOUNDS.forEach((s) => {
    assert.ok(s.name, `${s.symbol} name`);
    assert.ok(s.tip, `${s.symbol} tip`);
    assert.equal(s.words.length, 3, `${s.symbol} word count`);
  });
});

test('example words are unique across the deck', () => {
  const words = allWords.map((w) => w.word);
  const dupes = words.filter((w, i) => words.indexOf(w) !== i);
  assert.deepEqual(dupes, []);
  assert.equal(words.length, 132);
});

test('each transcription marks exactly its own focus sound', () => {
  allWords.forEach(({ word, marked, sound }) => {
    assert.equal((marked.match(/\[/g) || []).length, 1, `${word}: one opening bracket`);
    assert.equal((marked.match(/\]/g) || []).length, 1, `${word}: one closing bracket`);
    assert.ok(marked.includes(`[${sound.symbol}]`), `${word}: marks /${sound.symbol}/ (got ${marked})`);
  });
});

test('transcriptions use IPA ɡ (U+0261), never the ASCII letter g', () => {
  allWords.forEach(({ word, marked }) => assert.ok(!marked.includes('g'), `${word}: ${marked}`));
});

test('transcriptions contain only IPA characters', () => {
  const allowed = /^[a-zɑæɒɔəɜɪʊʌθðʃʒŋɡːˈˌ[\]]+$/;
  allWords.forEach(({ word, marked }) => assert.match(marked, allowed, word));
});

test('each sound has 3 distinct confusable sounds that differ from it', () => {
  IPA_SOUNDS.forEach((s) => {
    assert.equal(s.alt.length, 3, `${s.symbol} alt count`);
    assert.equal(new Set(s.alt).size, 3, `${s.symbol} alt unique`);
    assert.ok(!s.alt.includes(s.symbol), `${s.symbol} alt contains itself`);
  });
});

test('swapping the focus sound always gives 3 wrong options that differ from the answer', () => {
  allWords.forEach(({ word, marked, sound }) => {
    const options = new Set([strip(marked), ...sound.alt.map((a) => swapFocus(marked, a))]);
    assert.equal(options.size, 4, `${word}: ${[...options].join(', ')}`);
  });
});
