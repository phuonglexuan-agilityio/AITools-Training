(() => {
  'use strict';

  const STORAGE_KEY = 'vocab-flashcards.v1';

  const SAMPLE_WORDS = [
    { word: 'ephemeral', vi: 'phù du, chóng tàn', sub: '/ɪˈfem.ər.əl/ (adj)', meaning: 'Lasting for a very short time', example: 'Fame in the age of social media is often ephemeral.' },
    { word: 'meticulous', vi: 'tỉ mỉ, kỹ lưỡng', sub: '/məˈtɪk.jə.ləs/ (adj)', meaning: 'Showing great attention to detail; very careful and precise', example: 'She kept meticulous records of every test case.' },
    { word: 'ubiquitous', vi: 'có mặt ở khắp nơi', sub: '/juːˈbɪk.wə.təs/ (adj)', meaning: 'Present, appearing, or found everywhere', example: 'Smartphones have become ubiquitous.' },
    { word: 'mitigate', vi: 'giảm nhẹ, làm dịu bớt', sub: '/ˈmɪt.ɪ.ɡeɪt/ (v)', meaning: 'To make something less severe or harmful', example: 'Automated tests help mitigate the risk of regressions.' },
    { word: 'concise', vi: 'ngắn gọn, súc tích', sub: '/kənˈsaɪs/ (adj)', meaning: 'Giving a lot of information clearly in few words', example: 'Write concise acceptance criteria.' },
    { word: 'ambiguous', vi: 'mơ hồ, có thể hiểu nhiều cách', sub: '/æmˈbɪɡ.ju.əs/ (adj)', meaning: 'Open to more than one interpretation', example: 'The requirement was ambiguous, so we asked the client.' },
  ];

  // ---------- State ----------
  let words = load();
  let order = [];       // ids of cards in current study order
  let index = 0;
  let shuffled = false;

  const $ = (id) => document.getElementById(id);
  const el = {
    tabs: document.querySelectorAll('.tab'),
    filter: $('filter'), frontMode: $('front-mode'), shuffle: $('shuffle'),
    position: $('position'), barFill: $('bar-fill'), knownCount: $('known-count'),
    emptyStudy: $('empty-study'), cardWrap: $('card-wrap'), card: $('card'),
    frontLabel: $('front-label'), frontText: $('front-text'), frontSub: $('front-sub'),
    backLabel: $('back-label'), backText: $('back-text'), backSub: $('back-sub'), backExtra: $('back-extra'), backExample: $('back-example'),
    prev: $('prev'), next: $('next'), markKnown: $('mark-known'), markLearning: $('mark-learning'),
    form: $('word-form'), formTitle: $('form-title'), editId: $('edit-id'),
    fWord: $('f-word'), fSub: $('f-sub'), fMeaning: $('f-meaning'), fVi: $('f-vi'), fExample: $('f-example'),
    saveBtn: $('save-btn'), cancelEdit: $('cancel-edit'),
    search: $('search'), list: $('word-list'), emptyList: $('empty-list'),
    exportBtn: $('export'), importInput: $('import'), reset: $('reset'),
    toast: $('toast'),
  };

  // ---------- Persistence ----------
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function normalize(w) {
    return {
      id: w.id || uid(),
      word: String(w.word || '').trim(),
      sub: String(w.sub || '').trim(),
      meaning: String(w.meaning || '').trim(),
      example: String(w.example || '').trim(),
      vi: String(w.vi || '').trim(),
      known: Boolean(w.known),
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Decks saved before Vietnamese was added get it for the sample words.
        const sampleVi = new Map(SAMPLE_WORDS.map((s) => [s.word, s.vi]));
        if (Array.isArray(parsed)) {
          return parsed.map((w) => normalize({ ...w, vi: w.vi || sampleVi.get(w.word) }));
        }
      }
    } catch (_) { /* fall through to sample deck */ }
    return SAMPLE_WORDS.map(normalize);
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(words)); } catch (_) { /* storage unavailable */ }
  }

  // ---------- Study ----------
  function filteredIds() {
    const f = el.filter.value;
    return words
      .filter((w) => f === 'all' || (f === 'known' ? w.known : !w.known))
      .map((w) => w.id);
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildOrder(keepCurrent = true) {
    const currentId = order[index];
    order = filteredIds();
    if (shuffled) shuffleArray(order);
    const pos = keepCurrent ? order.indexOf(currentId) : -1;
    index = pos >= 0 ? pos : Math.min(index, Math.max(order.length - 1, 0));
    renderCard();
  }

  function current() {
    return words.find((w) => w.id === order[index]);
  }

  function renderCard() {
    const total = order.length;
    const knownTotal = words.filter((w) => w.known).length;
    el.knownCount.textContent = `${knownTotal} / ${words.length} known`;
    el.barFill.style.width = words.length ? `${(knownTotal / words.length) * 100}%` : '0';

    const w = current();
    el.emptyStudy.hidden = Boolean(w);
    el.cardWrap.hidden = !w;
    [el.prev, el.next, el.markKnown, el.markLearning].forEach((b) => { b.disabled = !w; });
    el.position.textContent = w ? `${index + 1} / ${total}` : '0 / 0';
    if (!w) return;

    el.card.classList.remove('flipped');
    el.card.classList.toggle('known', w.known);

    // Front shows the chosen side; the back shows the rest. A word with no
    // Vietnamese meaning falls back to the English meaning on a Vietnamese front.
    const mode = el.frontMode.value === 'vi' && !w.vi ? 'meaning' : el.frontMode.value;
    const word = { label: 'Word', text: w.word, sub: w.sub, lang: 'en' };
    const sides = {
      word,
      meaning: { label: 'Meaning', text: w.meaning, sub: '', lang: 'en' },
      vi: { label: 'Tiếng Việt', text: w.vi, sub: '', lang: 'vi' },
    };
    const front = sides[mode];
    const back = mode === 'word' ? sides.meaning : word;
    const extra = mode === 'vi' ? sides.meaning : (w.vi ? sides.vi : null);
    el.frontLabel.textContent = front.label;
    el.frontText.textContent = front.text;
    el.frontText.lang = front.lang;
    el.frontSub.textContent = front.sub;
    el.backLabel.textContent = back.label;
    el.backText.textContent = back.text;
    el.backSub.textContent = back.sub;
    el.backExtra.textContent = extra ? `${extra.label}: ${extra.text}` : '';
    el.backExtra.lang = extra ? extra.lang : '';
    el.backExample.textContent = w.example ? `“${w.example}”` : '';
  }

  function flip() {
    if (current()) el.card.classList.toggle('flipped');
  }

  function go(delta) {
    if (!order.length) return;
    index = (index + delta + order.length) % order.length;
    renderCard();
  }

  function mark(known) {
    const w = current();
    if (!w) return;
    w.known = known;
    save();
    // If the card no longer matches the filter, it drops out; otherwise advance.
    const stillVisible = el.filter.value === 'all' || (el.filter.value === 'known') === known;
    if (stillVisible) {
      go(1);
    } else {
      order.splice(index, 1);
      if (index >= order.length) index = 0;
      renderCard();
    }
    renderList();
  }

  // ---------- Manage ----------
  // Lower-case and drop Vietnamese tone and vowel marks, so "pho bien" finds "phổ biến".
  function fold(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
  }

  function renderList() {
    const q = fold(el.search.value.trim());
    const items = words.filter((w) =>
      !q || [w.word, w.meaning, w.vi].some((field) => fold(field).includes(q)));

    el.list.replaceChildren(...items.map((w) => {
      const li = document.createElement('li');
      li.className = 'word-item';

      const info = document.createElement('div');
      info.className = 'info';
      const head = document.createElement('div');
      const name = document.createElement('span');
      name.className = 'w';
      name.textContent = w.word;
      head.append(name);
      if (w.sub) {
        const s = document.createElement('span');
        s.className = 's';
        s.textContent = w.sub;
        head.append(s);
      }
      const badge = document.createElement('span');
      badge.className = `badge ${w.known ? 'known' : 'learning'}`;
      badge.textContent = w.known ? 'known' : 'learning';
      head.append(badge);

      const m = document.createElement('p');
      m.className = 'm';
      m.textContent = w.meaning;
      info.append(head, m);
      if (w.vi) {
        const v = document.createElement('p');
        v.className = 'v';
        v.lang = 'vi';
        v.textContent = w.vi;
        info.append(v);
      }
      if (w.example) {
        const e = document.createElement('p');
        e.className = 'e';
        e.textContent = w.example;
        info.append(e);
      }

      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.append(
        actionBtn('Edit', () => startEdit(w.id)),
        actionBtn('Delete', () => removeWord(w.id), 'danger'),
      );

      li.append(info, actions);
      return li;
    }));

    el.emptyList.hidden = items.length > 0;
    el.emptyList.textContent = words.length ? 'No matching words.' : 'No words yet.';
  }

  function actionBtn(label, onClick, extra = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn small ghost ${extra}`.trim();
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function startEdit(id) {
    const w = words.find((x) => x.id === id);
    if (!w) return;
    el.editId.value = id;
    el.fWord.value = w.word;
    el.fSub.value = w.sub;
    el.fMeaning.value = w.meaning;
    el.fVi.value = w.vi;
    el.fExample.value = w.example;
    el.formTitle.textContent = 'Edit word';
    el.saveBtn.textContent = 'Save changes';
    el.cancelEdit.hidden = false;
    el.form.scrollIntoView({ behavior: 'smooth' });
    el.fWord.focus();
  }

  function resetForm() {
    el.form.reset();
    el.editId.value = '';
    el.formTitle.textContent = 'Add a word';
    el.saveBtn.textContent = 'Add word';
    el.cancelEdit.hidden = true;
  }

  async function removeWord(id) {
    const w = words.find((x) => x.id === id);
    if (!w || !(await window.askConfirm(`Delete "${w.word}"?`, 'Delete'))) return;
    words = words.filter((x) => x.id !== id);
    save();
    buildOrder();
    renderList();
    toast('Word deleted');
  }

  async function onSubmit(e) {
    e.preventDefault();
    const data = normalize({
      word: el.fWord.value, sub: el.fSub.value,
      meaning: el.fMeaning.value, vi: el.fVi.value, example: el.fExample.value,
    });
    if (!data.word || !data.meaning) return;

    const editId = el.editId.value;
    if (editId) {
      const w = words.find((x) => x.id === editId);
      if (w) Object.assign(w, { word: data.word, sub: data.sub, meaning: data.meaning, vi: data.vi, example: data.example });
      toast('Word updated');
    } else {
      const dup = words.some((w) => w.word.toLowerCase() === data.word.toLowerCase());
      if (dup && !(await window.askConfirm(`"${data.word}" already exists. Add anyway?`, 'Add anyway'))) return;
      words.push(data);
      toast('Word added');
    }
    save();
    resetForm();
    buildOrder();
    renderList();
    el.fWord.focus();
  }

  // ---------- Import / export ----------
  function exportWords() {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vocabulary.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Header names accepted in CSV/TSV files, mapped to word fields.
  const COLUMNS = {
    word: 'word', meaning: 'meaning', english: 'meaning', example: 'example',
    vi: 'vi', vietnamese: 'vi', 'tiếng việt': 'vi', pronunciation: 'sub',
  };

  // Accepts JSON (array of {word, meaning, vi, ...}) or CSV/TSV lines.
  // Without a header row each line is word,meaning[,example]. With a header row
  // (e.g. "word,meaning,vi,example") columns are matched by name.
  function parseImport(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith('[')) return JSON.parse(trimmed);
    const lines = trimmed.split(/\r?\n/).filter(Boolean);
    const split = (line) => (line.includes('\t') ? line.split('\t') : line.split(',')).map((p) => p.trim());
    const header = split(lines[0]).map((h) => COLUMNS[h.toLowerCase()]);
    if (header.includes('word') && header.includes('meaning')) {
      return lines.slice(1).map((line) => {
        const w = {};
        split(line).forEach((value, i) => { if (header[i]) w[header[i]] = value; });
        return w;
      });
    }
    return lines.map((line) => {
      const [word, meaning, ...rest] = split(line);
      return { word, meaning, example: rest.join(', ') };
    });
  }

  function importWords(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = parseImport(String(reader.result))
          .map((w) => normalize({ ...w, id: undefined }))
          .filter((w) => w.word && w.meaning);
        const existing = new Set(words.map((w) => w.word.toLowerCase()));
        const fresh = incoming.filter((w) => !existing.has(w.word.toLowerCase()));
        words.push(...fresh);
        save();
        buildOrder();
        renderList();
        toast(`Imported ${fresh.length} word(s)` + (incoming.length > fresh.length ? `, skipped ${incoming.length - fresh.length} duplicate(s)` : ''));
      } catch (_) {
        toast('Could not read that file');
      }
      el.importInput.value = '';
    };
    reader.readAsText(file);
  }

  // ---------- UI helpers ----------
  let toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  function switchView(name) {
    el.tabs.forEach((t) => t.classList.toggle('active', t.dataset.view === name));
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${name}`));
    if (name === 'study') buildOrder();
  }

  // ---------- Events ----------
  el.tabs.forEach((t) => t.addEventListener('click', () => switchView(t.dataset.view)));
  el.card.addEventListener('click', flip);
  el.prev.addEventListener('click', () => go(-1));
  el.next.addEventListener('click', () => go(1));
  el.markKnown.addEventListener('click', () => mark(true));
  el.markLearning.addEventListener('click', () => mark(false));
  el.filter.addEventListener('change', () => { index = 0; buildOrder(false); });
  el.frontMode.addEventListener('change', renderCard);
  el.shuffle.addEventListener('click', () => {
    shuffled = true;
    index = 0;
    buildOrder(false);
    toast('Shuffled');
  });

  el.form.addEventListener('submit', onSubmit);
  el.cancelEdit.addEventListener('click', resetForm);
  el.search.addEventListener('input', renderList);
  el.exportBtn.addEventListener('click', exportWords);
  el.importInput.addEventListener('change', () => {
    if (el.importInput.files[0]) importWords(el.importInput.files[0]);
  });
  el.reset.addEventListener('click', async () => {
    if (!(await window.askConfirm('Replace all words with the sample deck? This cannot be undone.', 'Reset'))) return;
    words = SAMPLE_WORDS.map(normalize);
    save();
    shuffled = false;
    index = 0;
    buildOrder(false);
    renderList();
    toast('Reset to sample deck');
  });

  document.addEventListener('keydown', (e) => {
    if (!$('view-study').classList.contains('active')) return;
    if (e.target.matches('input, textarea, select')) return;
    switch (e.key) {
      case ' ': case 'Enter': e.preventDefault(); flip(); break;
      case 'ArrowLeft': go(-1); break;
      case 'ArrowRight': go(1); break;
      case '1': mark(false); break;
      case '2': mark(true); break;
      default: break;
    }
  });

  // ---------- Init ----------
  save();
  buildOrder(false);
  renderList();
})();
