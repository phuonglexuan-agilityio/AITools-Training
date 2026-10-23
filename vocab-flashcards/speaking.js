// Speaking tab: work phrases with stress and intonation marks, listen at two
// speeds, shadow (repeat after the voice) and record yourself to compare.
(() => {
  'use strict';

  const STORAGE_KEY = 'vocab-flashcards.speaking.v1';
  const SITUATIONS = window.PHRASE_SITUATIONS;
  const PHRASES = window.PHRASES;
  const { plain, groups } = window.PHRASE_MARKUP;
  const SHADOW_TIMES = 3;
  const MAX_RECORDING_MS = 20000;
  const RATE = { slow: 0.6, normal: 0.95 };

  const $ = (id) => document.getElementById(id);
  const view = $('view-speak');
  const el = {
    sit: $('sp-sit'), filter: $('sp-filter'), showVi: $('sp-show-vi'), shuffle: $('sp-shuffle'),
    position: $('sp-position'), barFill: $('sp-bar-fill'), confidentCount: $('sp-confident-count'),
    empty: $('sp-empty'), body: $('sp-body'), card: $('sp-card'),
    sitLabel: $('sp-sit-label'), text: $('sp-text'), vi: $('sp-vi'), chunk: $('sp-chunk'), tip: $('sp-tip'),
    slow: $('sp-slow'), normal: $('sp-normal'), shadow: $('sp-shadow'),
    record: $('sp-record'), playMine: $('sp-play-mine'), compare: $('sp-compare'), status: $('sp-status'),
    prev: $('sp-prev'), next: $('sp-next'), markPractise: $('sp-mark-practise'), markConfident: $('sp-mark-confident'),
  };

  const canSpeak = window.speech.canSpeak;
  const canRecord = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  let confident = load();
  let order = [];
  let index = 0;
  let shuffled = false;
  const recordings = new Map();   // phrase id -> object URL of the latest take
  let recorder = null;
  let recordTimer = null;
  let shadowTimer = null;
  let player = null;

  // ---------- Persistence ----------
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Set(saved && Array.isArray(saved.confident) ? saved.confident : []);
    } catch (_) { return new Set(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ confident: [...confident] })); } catch (_) { /* storage unavailable */ }
  }

  // ---------- Helpers ----------
  function make(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const current = () => order[index];
  const sitLabel = (id) => SITUATIONS.find((s) => s.id === id).label;

  function setStatus(msg, kind = '') {
    el.status.textContent = msg;
    el.status.className = `sp-status ${kind}`.trim();
  }

  // ---------- Rendering ----------
  function phraseNode(text) {
    const frag = document.createDocumentFragment();
    groups(text).forEach((parts, gi) => {
      if (gi) frag.append(make('span', 'pause', ' '));
      const g = make('span', 'group');
      parts.forEach((p) => {
        if (p.type === 'stress') g.append(make('strong', 'stress', p.text));
        else if (p.type === 'tone') {
          const t = make('span', `tone ${p.dir}`, p.text);
          t.title = p.dir === 'rise' ? 'Voice goes up' : 'Voice goes down';
          g.append(t);
        } else g.append(p.text);
      });
      frag.append(g);
    });
    return frag;
  }

  function buildOrder(keepCurrent = true) {
    const currentId = current() && current().id;
    const sit = el.sit.value;
    const f = el.filter.value;
    order = PHRASES.filter((p) => (sit === 'all' || p.sit === sit)
      && (f === 'all' || (f === 'confident' ? confident.has(p.id) : !confident.has(p.id))));
    if (shuffled) shuffleArray(order);
    const pos = keepCurrent ? order.findIndex((p) => p.id === currentId) : -1;
    index = pos >= 0 ? pos : Math.min(index, Math.max(order.length - 1, 0));
    render();
  }

  function render() {
    stopAll();
    const total = PHRASES.length;
    el.confidentCount.textContent = `${confident.size} / ${total} confident`;
    el.barFill.style.width = `${(confident.size / total) * 100}%`;

    const p = current();
    el.empty.hidden = Boolean(p);
    el.body.hidden = !p;
    el.position.textContent = p ? `${index + 1} / ${order.length}` : '0 / 0';
    if (!p) return;

    el.sitLabel.textContent = sitLabel(p.sit);
    el.text.replaceChildren(phraseNode(p.text));
    el.vi.textContent = p.vi;
    el.vi.hidden = !el.showVi.checked;
    el.chunk.textContent = p.chunk;
    el.tip.textContent = p.tip ? `💡 ${p.tip}` : '';
    el.card.classList.toggle('confident', confident.has(p.id));
    updateButtons();
    setStatus('');
  }

  function updateButtons() {
    const p = current();
    const has = Boolean(p && recordings.has(p.id));
    el.slow.disabled = el.normal.disabled = el.shadow.disabled = !canSpeak;
    el.record.disabled = !canRecord;
    if (!canRecord) el.record.title = 'Recording is not supported in this browser';
    el.playMine.disabled = !has;
    el.compare.disabled = !has || !canSpeak;
    const recording = Boolean(recorder);
    el.record.textContent = recording ? '■ Stop' : '🎙 Record';
    el.record.classList.toggle('recording', recording);
  }

  // ---------- Audio ----------
  function stopPlayback() {
    window.speech.stop();
    clearTimeout(shadowTimer);
    shadowTimer = null;
    if (player) { player.pause(); player = null; }
  }

  function stopAll() {
    stopPlayback();
    if (recorder) stopRecording();
  }

  function listen(speed) {
    const p = current();
    if (!p) return;
    stopPlayback();
    window.speech.speak(plain(p.text), { rate: RATE[speed] });
    setStatus(speed === 'slow' ? 'Listening slowly. Notice the bold words and where the voice goes up or down.' : 'Listening at normal speed.');
  }

  // Play the phrase, then leave a gap about as long as the phrase for you to
  // repeat it, three times over.
  function shadow() {
    const p = current();
    if (!p) return;
    stopAll();
    const text = plain(p.text);
    let round = 0;
    const play = () => {
      round += 1;
      setStatus(`Listen… (${round}/${SHADOW_TIMES})`);
      const started = Date.now();
      window.speech.speak(text, {
        rate: RATE.normal,
        onend: () => {
          if (current() !== p) return;
          setStatus(`Your turn: say it now (${round}/${SHADOW_TIMES})`, 'turn');
          const gap = Math.max(1500, (Date.now() - started) * 1.3);
          shadowTimer = setTimeout(() => {
            if (round < SHADOW_TIMES) play();
            else setStatus('Nice. Now record yourself and compare.', 'done');
          }, gap);
        },
      });
    };
    play();
  }

  async function startRecording() {
    const p = current();
    if (!p || !canRecord) return;
    stopPlayback();
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (_) {
      setStatus('Microphone blocked. Allow it in the browser address bar, then try again.', 'error');
      return;
    }
    const chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.addEventListener('dataavailable', (e) => { if (e.data.size) chunks.push(e.data); });
    recorder.addEventListener('stop', () => {
      stream.getTracks().forEach((t) => t.stop());
      if (chunks.length) {
        if (recordings.has(p.id)) URL.revokeObjectURL(recordings.get(p.id));
        recordings.set(p.id, URL.createObjectURL(new Blob(chunks, { type: chunks[0].type })));
      }
      if (current() === p) {
        updateButtons();
        setStatus(chunks.length ? 'Saved. Press Compare to hear the model, then your voice.' : 'Nothing was recorded. Try again.', chunks.length ? 'done' : 'error');
      }
    });
    recorder.start();
    recordTimer = setTimeout(stopRecording, MAX_RECORDING_MS);
    updateButtons();
    setStatus('Recording… say the phrase, then press Stop (or R).', 'rec');
  }

  function stopRecording() {
    clearTimeout(recordTimer);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    recorder = null;
    updateButtons();
  }

  function toggleRecording() {
    if (recorder) stopRecording();
    else startRecording();
  }

  function playMine(onend) {
    const p = current();
    const url = p && recordings.get(p.id);
    if (!url) return;
    if (player) player.pause();
    player = new Audio(url);
    player.addEventListener('ended', () => { player = null; if (onend) onend(); });
    player.play().catch(() => setStatus('Could not play your recording.', 'error'));
  }

  function compare() {
    const p = current();
    if (!p || !recordings.has(p.id)) return;
    stopAll();
    setStatus('Model voice…');
    window.speech.speak(plain(p.text), {
      rate: RATE.normal,
      onend: () => {
        if (current() !== p) return;
        setStatus('Your voice…');
        shadowTimer = setTimeout(() => playMine(() => setStatus('Which words sounded different? Try again, or mark it.')), 400);
      },
    });
  }

  // ---------- Navigation ----------
  function go(step) {
    if (!order.length) return;
    index = (index + step + order.length) % order.length;
    render();
  }

  function mark(isConfident) {
    const p = current();
    if (!p) return;
    if (isConfident) confident.add(p.id); else confident.delete(p.id);
    save();
    const before = order.length;
    buildOrder(true);
    // If the phrase stayed in the list, move on; if it dropped out, the next one is already showing.
    if (order.length === before) go(1);
  }

  // ---------- Events ----------
  SITUATIONS.forEach((s) => el.sit.append(new Option(s.label, s.id)));

  el.sit.addEventListener('change', () => { index = 0; buildOrder(false); });
  el.filter.addEventListener('change', () => { index = 0; buildOrder(false); });
  el.showVi.addEventListener('change', () => { el.vi.hidden = !el.showVi.checked; });
  el.shuffle.addEventListener('click', () => { shuffled = true; index = 0; buildOrder(false); });
  el.slow.addEventListener('click', () => listen('slow'));
  el.normal.addEventListener('click', () => listen('normal'));
  el.shadow.addEventListener('click', shadow);
  el.record.addEventListener('click', toggleRecording);
  el.playMine.addEventListener('click', () => { stopPlayback(); playMine(); });
  el.compare.addEventListener('click', compare);
  el.prev.addEventListener('click', () => go(-1));
  el.next.addEventListener('click', () => go(1));
  el.markPractise.addEventListener('click', () => mark(false));
  el.markConfident.addEventListener('click', () => mark(true));

  // Leaving the tab stops any sound or recording.
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => {
    if (t.dataset.view !== 'speak') stopAll();
  }));

  document.addEventListener('keydown', (e) => {
    if (!view.classList.contains('active')) return;
    if (e.target.matches('input, textarea, select')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key.toLowerCase()) {
      case 's': listen('normal'); break;
      case 'd': listen('slow'); break;
      case 'h': shadow(); break;
      case 'r': if (canRecord) toggleRecording(); break;
      case 'p': stopPlayback(); playMine(); break;
      case 'c': compare(); break;
      case 'arrowleft': go(-1); break;
      case 'arrowright': go(1); break;
      case '1': mark(false); break;
      case '2': mark(true); break;
      default: return;
    }
    e.preventDefault();
  });

  // ---------- Init ----------
  buildOrder(false);
})();
