const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// phrases-data.js is a browser script that assigns to window.*; run it in a sandbox.
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', '..', 'phrases-data.js'), 'utf8'), sandbox);
// The JSON round trip copies the data out of the sandbox's realm for deepEqual.
const { PHRASE_SITUATIONS, PHRASES } = JSON.parse(JSON.stringify(sandbox.window));
const { PHRASE_MARKUP } = sandbox.window;
const plain = (t) => PHRASE_MARKUP.plain(t);
const groups = (t) => JSON.parse(JSON.stringify(PHRASE_MARKUP.groups(t)));

test('has 24 phrases for each of meetings, client calls and demos', () => {
  assert.deepEqual(PHRASE_SITUATIONS.map((s) => s.id), ['meetings', 'calls', 'demos']);
  PHRASE_SITUATIONS.forEach((s) => assert.equal(PHRASES.filter((p) => p.sit === s.id).length, 24, s.id));
  assert.equal(PHRASES.length, 72);
});

test('ids are unique', () => {
  assert.equal(new Set(PHRASES.map((p) => p.id)).size, PHRASES.length);
});

test('every phrase has text, a key phrase and a Vietnamese meaning', () => {
  PHRASES.forEach((p) => {
    ['text', 'chunk', 'vi'].forEach((k) => assert.ok(String(p[k] || '').trim(), `${p.id} is missing ${k}`));
    if ('tip' in p) assert.ok(p.tip.trim(), `${p.id} has an empty tip`);
  });
});

test('stress marks are paired and every phrase stresses something', () => {
  PHRASES.forEach((p) => {
    const stars = (p.text.match(/\*/g) || []).length;
    assert.equal(stars % 2, 0, `${p.id} has an unpaired *`);
    assert.ok(stars >= 2, `${p.id} has no stress mark`);
    groups(p.text).flat().filter((part) => part.type === 'stress').forEach((part) => {
      assert.equal(part.text, part.text.trim(), `${p.id}: "*${part.text}*" has a space inside the stress mark`);
    });
  });
});

test('every phrase ends with a tone arrow and has no empty thought group', () => {
  PHRASES.forEach((p) => {
    assert.match(p.text, /[↗↘]$/, `${p.id} should end with ↗ or ↘`);
    p.text.split('|').forEach((g) => assert.ok(g.trim(), `${p.id} has an empty group`));
  });
});

test('plain() removes the markup and tidies spacing', () => {
  assert.equal(plain("Let's get *start*ed. | The *first* item on the *a*genda | is the re*lease* date. ↘"),
    "Let's get started. The first item on the agenda is the release date.");
  assert.equal(plain('You can *fil*ter the re*sults* | by *date* ↗ | or by *cus*tomer. ↘'),
    'You can filter the results by date or by customer.');
  assert.equal(plain('Can you *hear* me o*kay*? ↗'), 'Can you hear me okay?');
  PHRASES.forEach((p) => assert.doesNotMatch(plain(p.text), /[*|↗↘]|\s{2}|\s[,.?!]/, p.id));
});

test('groups() splits thought groups into text, stress and tone parts', () => {
  assert.deepEqual(groups('I *see* your *point*, | but no. ↘'), [
    [{ type: 'text', text: 'I ' }, { type: 'stress', text: 'see' }, { type: 'text', text: ' your ' }, { type: 'stress', text: 'point' }, { type: 'text', text: ',' }],
    [{ type: 'text', text: 'but no. ' }, { type: 'tone', text: '↘', dir: 'fall' }],
  ]);
});
