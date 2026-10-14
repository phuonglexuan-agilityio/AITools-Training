(() => {
  'use strict';

  const STATS_KEY = 'vocab-flashcards.ipa-stats.v1';
  const GROUPS = window.IPA_GROUPS;
  const SOUNDS = window.IPA_SOUNDS;

  // One practice item per example word.
  const ITEMS = SOUNDS.flatMap((sound) => sound.words.map(([word, marked]) => ({
    word, marked, ipa: marked.replace(/[[\]]/g, ''), sound,
  })));
  const bySymbol = new Map(SOUNDS.map((s) => [s.symbol, s]));
  const groupLabel = (id) => GROUPS.find((g) => g.id === id).label;

  const $ = (id) => document.getElementById(id);
  const view = $('view-ipa');
  const el = {
    modes: view.querySelectorAll('[data-ipa-mode]'),
    scope: $('ipa-scope'),
    panes: { chart: $('ipa-chart'), cards: $('ipa-cards'), quiz: $('ipa-quiz') },
    detail: $('ipa-detail'), groups: $('ipa-groups'),
    cardPos: $('ipa-card-pos'), card: $('ipa-card'), reverse: $('ipa-reverse'), shuffle: $('ipa-shuffle'),
    frontLabel: $('ipa-front-label'), frontText: $('ipa-front-text'),
    backLabel: $('ipa-back-label'), backText: $('ipa-back-text'), backSound: $('ipa-back-sound'), backTip: $('ipa-back-tip'),
    cardPrev: $('ipa-prev'), cardNext: $('ipa-next'), cardSpeak: $('ipa-card-speak'),
    quizType: $('ipa-quiz-type'), score: $('ipa-score'), resetStats: $('ipa-reset-stats'),
    qLabel: $('ipa-q-label'), qText: $('ipa-q-text'), qSpeak: $('ipa-q-speak'),
    options: $('ipa-options'), feedback: $('ipa-feedback'), qNext: $('ipa-q-next'),
  };

  let mode = 'chart';
  let selected = null;               // symbol shown in the chart detail panel
  let cards = { order: [], index: 0, shuffled: false };
  let quiz = { q: null, answered: false, right: 0, total: 0, streak: 0, lastWord: null };
  let stats = loadStats();

  // ---------- Helpers ----------
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveStats() {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (_) { /* storage unavailable */ }
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function make(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Render "/ʃ[ɪ]p/" with the bracketed focus sound highlighted.
  function ipaNode(marked, highlight = true) {
    const span = make('span', 'ipa');
    const m = marked.match(/^(.*)\[(.*)\](.*)$/);
    if (!m || !highlight) {
      span.textContent = `/${marked.replace(/[[\]]/g, '')}/`;
      return span;
    }
    span.append(`/${m[1]}`, make('mark', 'focus', m[2] || '·'), `${m[3]}/`);
    return span;
  }

  const canSpeak = 'speechSynthesis' in window;
  function speak(text) {
    if (!canSpeak) return;
    const u = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find((v) => v.lang === 'en-GB');
    u.lang = 'en-GB';
    if (voice) u.voice = voice;
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  function speakBtn(text, label = '🔊') {
    const b = make('button', 'btn small ghost speak', label);
    b.type = 'button';
    b.title = `Hear "${text}"`;
    b.setAttribute('aria-label', `Hear ${text}`);
    b.disabled = !canSpeak;
    b.addEventListener('click', (e) => { e.stopPropagation(); speak(text); });
    return b;
  }

  function accuracy(symbol) {
    const s = stats[symbol];
    return s && s.total ? Math.round((s.right / s.total) * 100) : null;
  }

  function scopedItems() {
    const [kind, value] = el.scope.value.split(':');
    if (kind === 'group') return ITEMS.filter((i) => i.sound.group === value);
    if (kind === 'sound') return ITEMS.filter((i) => i.sound.symbol === value);
    return ITEMS.slice();
  }

  // ---------- Mode / scope ----------
  function setMode(next) {
    mode = next;
    el.modes.forEach((b) => b.classList.toggle('active', b.dataset.ipaMode === mode));
    Object.entries(el.panes).forEach(([k, pane]) => { pane.hidden = k !== mode; });
    el.scope.closest('label').hidden = mode === 'chart';
    if (mode === 'chart') renderChart();
    if (mode === 'cards') buildCards();
    if (mode === 'quiz' && !quiz.q) nextQuestion();
  }

  function setScope(value) {
    el.scope.value = value;
    cards.index = 0;
    quiz.q = null;
    if (mode === 'cards') buildCards();
    if (mode === 'quiz') nextQuestion();
  }

  function populateScope() {
    const all = make('option', '', 'All sounds');
    all.value = 'all';
    el.scope.append(all);
    GROUPS.forEach((g) => {
      const o = make('option', '', g.label);
      o.value = `group:${g.id}`;
      el.scope.append(o);
    });
    GROUPS.forEach((g) => {
      const og = document.createElement('optgroup');
      og.label = `${g.label} — single sound`;
      SOUNDS.filter((s) => s.group === g.id).forEach((s) => {
        const o = make('option', '', `/${s.symbol}/  ${s.words[0][0]}`);
        o.value = `sound:${s.symbol}`;
        og.append(o);
      });
      el.scope.append(og);
    });
  }

  // ---------- Sound chart ----------
  function renderChart() {
    el.groups.replaceChildren(...GROUPS.map((g) => {
      const wrap = make('div', 'ipa-group');
      wrap.append(make('h3', '', g.label));
      const grid = make('div', 'ipa-grid');
      SOUNDS.filter((s) => s.group === g.id).forEach((s) => {
        const tile = make('button', 'ipa-tile');
        tile.type = 'button';
        tile.classList.toggle('selected', s.symbol === selected);
        const acc = accuracy(s.symbol);
        tile.append(
          make('span', 'sym ipa', `/${s.symbol}/`),
          make('span', 'ex', s.words[0][0]),
          make('span', `acc ${acc === null ? '' : acc >= 80 ? 'high' : acc >= 50 ? 'mid' : 'low'}`, acc === null ? '–' : `${acc}%`),
        );
        tile.title = `${s.name} — ${acc === null ? 'not practised yet' : `${acc}% correct in quizzes`}`;
        tile.addEventListener('click', () => {
          selected = s.symbol;
          renderChart();
          el.detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        grid.append(tile);
      });
      wrap.append(grid);
      return wrap;
    }));
    renderDetail();
  }

  function renderDetail() {
    const s = bySymbol.get(selected);
    if (!s) {
      el.detail.replaceChildren(make('p', 'muted', 'Pick a sound below to see example words and how to make it. The % shows your quiz accuracy for that sound.'));
      return;
    }
    const head = make('div', 'detail-head');
    head.append(make('span', 'detail-sym ipa', `/${s.symbol}/`));
    const meta = make('div');
    meta.append(make('strong', '', s.name), make('div', 'muted', groupLabel(s.group)));
    head.append(meta);

    const list = make('ul', 'detail-words');
    s.words.forEach(([word, marked]) => {
      const li = make('li');
      li.append(make('span', 'w', word), ipaNode(marked), speakBtn(word));
      list.append(li);
    });

    const actions = make('div', 'detail-actions');
    const toCards = make('button', 'btn ghost', 'Flashcards for this sound');
    const toQuiz = make('button', 'btn primary', 'Quiz this sound');
    toCards.addEventListener('click', () => { setScope(`sound:${s.symbol}`); setMode('cards'); });
    toQuiz.addEventListener('click', () => { setScope(`sound:${s.symbol}`); setMode('quiz'); });
    actions.append(toCards, toQuiz);

    el.detail.replaceChildren(head, make('p', 'tip', s.tip), list, actions);
  }

  // ---------- Flashcards ----------
  function buildCards() {
    cards.order = scopedItems();
    if (cards.shuffled) shuffle(cards.order);
    cards.index = Math.min(cards.index, Math.max(cards.order.length - 1, 0));
    renderCard();
  }

  function renderCard() {
    const item = cards.order[cards.index];
    el.cardPos.textContent = item ? `${cards.index + 1} / ${cards.order.length}` : '0 / 0';
    if (!item) return;
    el.card.classList.remove('flipped');
    const reverse = el.reverse.checked;
    el.frontLabel.textContent = reverse ? 'IPA — say it' : 'Word — what is the IPA?';
    el.backLabel.textContent = reverse ? 'Word' : 'IPA';
    el.frontText.replaceChildren(reverse ? ipaNode(item.marked, false) : item.word);
    el.backText.replaceChildren(reverse ? item.word : ipaNode(item.marked));
    el.backSound.replaceChildren('Focus sound ', make('span', 'ipa', `/${item.sound.symbol}/`), ` — ${item.sound.name}`);
    el.backTip.textContent = item.sound.tip;
    el.frontText.classList.toggle('ipa', reverse);
  }

  function flipCard() { el.card.classList.toggle('flipped'); }
  function moveCard(delta) {
    if (!cards.order.length) return;
    cards.index = (cards.index + delta + cards.order.length) % cards.order.length;
    renderCard();
  }

  // ---------- Quiz ----------
  // Word → IPA: wrong options swap the focus sound for a commonly confused one.
  function ipaOptions(item) {
    const opts = new Set([item.ipa]);
    item.sound.alt.forEach((a) => opts.add(item.marked.replace(/\[[^\]]*\]/, a)));
    shuffle(ITEMS.slice()).forEach((i) => { if (opts.size < 4) opts.add(i.ipa); });
    return [...opts].slice(0, 4).map((text) => ({ text, correct: text === item.ipa }));
  }

  // IPA → word: wrong options prefer words built on confusable sounds.
  function wordOptions(item) {
    const others = ITEMS.filter((i) => i.word !== item.word);
    const confusable = shuffle(others.filter((i) => item.sound.alt.includes(i.sound.symbol)));
    const sameGroup = shuffle(others.filter((i) => i.sound.group === item.sound.group));
    const picks = [];
    [...confusable, ...sameGroup, ...shuffle(others)].forEach((i) => {
      if (picks.length < 3 && !picks.includes(i.word)) picks.push(i.word);
    });
    return [{ text: item.word, correct: true }, ...picks.map((text) => ({ text, correct: false }))];
  }

  function nextQuestion() {
    const pool = scopedItems();
    const candidates = pool.length > 1 ? pool.filter((i) => i.word !== quiz.lastWord) : pool;
    const item = candidates[Math.floor(Math.random() * candidates.length)];
    const type = el.quizType.value;
    quiz.q = { item, type, options: shuffle(type === 'word-ipa' ? ipaOptions(item) : wordOptions(item)) };
    quiz.answered = false;
    quiz.lastWord = item.word;
    renderQuestion();
  }

  function renderQuestion() {
    const { item, type, options } = quiz.q;
    const wordFirst = type === 'word-ipa';
    el.qLabel.textContent = wordFirst ? 'Which IPA transcription matches this word?' : 'Which word is this?';
    el.qText.replaceChildren(wordFirst ? item.word : ipaNode(item.marked, false));
    el.qText.classList.toggle('ipa', !wordFirst);
    el.qSpeak.hidden = !wordFirst;  // hearing the word would give away IPA → word
    el.feedback.replaceChildren();
    el.feedback.className = 'feedback';
    el.qNext.disabled = true;

    el.options.replaceChildren(...options.map((opt, n) => {
      const b = make('button', `opt${wordFirst ? ' ipa' : ''}`);
      b.type = 'button';
      b.append(make('kbd', '', String(n + 1)), wordFirst ? `/${opt.text}/` : opt.text);
      b.addEventListener('click', () => answer(n));
      return b;
    }));
    renderScore();
  }

  function answer(n) {
    if (quiz.answered || !quiz.q) return;
    const { item, options } = quiz.q;
    const chosen = options[n];
    if (!chosen) return;
    quiz.answered = true;
    quiz.total += 1;
    if (chosen.correct) { quiz.right += 1; quiz.streak += 1; } else { quiz.streak = 0; }

    const s = stats[item.sound.symbol] || { right: 0, total: 0 };
    s.total += 1;
    if (chosen.correct) s.right += 1;
    stats[item.sound.symbol] = s;
    saveStats();

    [...el.options.children].forEach((b, i) => {
      b.disabled = true;
      if (options[i].correct) b.classList.add('correct');
      else if (i === n) b.classList.add('wrong');
    });

    el.feedback.className = `feedback ${chosen.correct ? 'good' : 'bad'}`;
    el.feedback.replaceChildren(
      make('strong', '', chosen.correct ? 'Correct! ' : 'Not quite. '),
      `${item.word} = `, ipaNode(item.marked),
      ` — focus sound `, make('span', 'ipa', `/${item.sound.symbol}/`), ` (${item.sound.name}). ${item.sound.tip} `,
      speakBtn(item.word, '🔊 Hear it'),
    );
    el.qNext.disabled = false;
    el.qNext.focus();
    renderScore();
  }

  function renderScore() {
    el.score.textContent = `Score ${quiz.right} / ${quiz.total} · Streak ${quiz.streak}`;
  }

  // ---------- Events ----------
  el.modes.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.ipaMode)));
  el.scope.addEventListener('change', () => setScope(el.scope.value));

  el.card.addEventListener('click', flipCard);
  el.cardPrev.addEventListener('click', () => moveCard(-1));
  el.cardNext.addEventListener('click', () => moveCard(1));
  el.cardSpeak.disabled = !canSpeak;
  el.cardSpeak.addEventListener('click', () => { const i = cards.order[cards.index]; if (i) speak(i.word); });
  el.reverse.addEventListener('change', renderCard);
  el.shuffle.addEventListener('click', () => { cards.shuffled = true; cards.index = 0; buildCards(); });

  el.quizType.addEventListener('change', nextQuestion);
  el.qSpeak.disabled = !canSpeak;
  el.qSpeak.addEventListener('click', () => quiz.q && speak(quiz.q.item.word));
  el.qNext.addEventListener('click', nextQuestion);
  el.resetStats.addEventListener('click', async () => {
    if (!(await window.askConfirm('Clear your quiz accuracy for every sound?', 'Clear'))) return;
    stats = {};
    saveStats();
    quiz = { ...quiz, right: 0, total: 0, streak: 0 };
    renderScore();
  });

  // Re-render the chart when returning to the tab so accuracy is current.
  document.querySelectorAll('.tab[data-view="ipa"]').forEach((t) => t.addEventListener('click', () => setMode(mode)));

  document.addEventListener('keydown', (e) => {
    if (!view.classList.contains('active')) return;
    if (e.target.matches('input, textarea, select')) return;
    if (mode === 'cards') {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
      else if (e.key === 'ArrowLeft') moveCard(-1);
      else if (e.key === 'ArrowRight') moveCard(1);
      else if (e.key.toLowerCase() === 's') el.cardSpeak.click();
    } else if (mode === 'quiz') {
      if (/^[1-4]$/.test(e.key)) answer(Number(e.key) - 1);
      else if ((e.key === 'Enter' || e.key === 'ArrowRight') && quiz.answered) { e.preventDefault(); nextQuestion(); }
    }
  });

  // ---------- Init ----------
  populateScope();
  setMode('chart');
})();
