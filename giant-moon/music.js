// All the site's sound, made with the Web Audio API (no audio files):
// a music-box Happy Birthday with a sung voice, short sound effects, and a playful loop.
(function () {
  const NOTE = {
    C3: 130.81, F3: 174.61, G3: 196.0, A3: 220.0, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, C6: 1046.5,
  };

  // [note, beats] per phrase; one phrase per lyric line.
  const PHRASES = [
    [["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2]],
    [["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2]],
    [["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2]],
    [["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2.5]],
  ];
  const BEAT = 0.5; // seconds

  // One syllable per note: [vowel, consonant]. Consonant: "h" breathy, "s" hiss, "p" stop, "" glide.
  const HB = [["a", "h"], ["i", "p"], ["er", "p"], ["e", "p"], ["u", "p"], ["u", ""]];
  const SYLLABLES = {
    en: [HB, HB, [["a", "h"], ["i", "p"], ["er", "p"], ["e", "p"], ["i", "p"], ["a", ""], ["u", ""]], HB],
    zh: (() => {
      const line = [["u", "s"], ["i", ""], ["er", "s"], ["i", ""], ["a", "p"], ["er", ""]];
      return [line, line, [...line, ["er", ""]], line];
    })(),
  };

  // Formants (Hz) for a light, female-ish voice.
  const VOWELS = {
    a: [850, 1220, 2810],
    e: [560, 2000, 2700],
    i: [320, 2650, 3200],
    u: [360, 900, 2600],
    er: [500, 1450, 2550],
  };
  const FORMANT_GAIN = [1, 0.55, 0.25];

  let ctx = null;
  let master = null;
  let muted = false;
  let playing = null;
  let loop = null;
  let noiseBuffer = null;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.6;
      master.connect(ctx.destination);
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, { type = "sine", volume = 0.3, attack = 0.01, decay = 1.4, out = master, slideTo = null } = {}) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + decay * 0.8);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + decay + 0.05);
    return osc;
  }

  function noise(start, duration, { volume = 0.1, freq = 4000, out = master } = {}) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    src.connect(filter).connect(gain).connect(out);
    src.start(start);
    src.stop(start + duration + 0.05);
  }

  function musicBoxNote(freq, start, volume, out) {
    [[1, 1], [2, 0.25], [3, 0.08]].forEach(([mult, amp]) => tone(freq * mult, start, { volume: volume * amp, decay: 1.4, out }));
  }

  // A singing voice: two slightly detuned sawtooths with vibrato through vowel formant filters.
  function createVoice(out, startAt) {
    const input = ctx.createGain();
    const oscs = [-7, 7].map((cents) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.detune.value = cents;
      o.connect(input);
      return o;
    });
    const vibrato = ctx.createOscillator();
    const vibratoDepth = ctx.createGain();
    vibrato.frequency.value = 5.4;
    vibratoDepth.gain.value = 0;
    vibrato.connect(vibratoDepth);
    oscs.forEach((o) => vibratoDepth.connect(o.detune));

    const env = ctx.createGain();
    env.gain.value = 0;
    const filters = FORMANT_GAIN.map((g) => {
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 9;
      const fg = ctx.createGain();
      fg.gain.value = g * 3.2;
      input.connect(f).connect(fg).connect(env);
      return f;
    });
    env.connect(out);
    oscs.forEach((o) => o.start(startAt));
    vibrato.start(startAt);

    return {
      sing(freq, vowel, consonant, start, duration, volume) {
        oscs.forEach((o) => o.frequency.setTargetAtTime(freq, start, 0.02));
        VOWELS[vowel].forEach((hz, i) => filters[i].frequency.setTargetAtTime(hz, start, 0.03));
        const g = env.gain;
        g.setTargetAtTime(consonant === "p" || consonant === "s" ? 0.0001 : volume * 0.4, start - 0.03, 0.01);
        g.setTargetAtTime(volume, start + (consonant === "s" ? 0.06 : 0.02), 0.03);
        g.setTargetAtTime(volume * 0.75, start + duration * 0.6, duration * 0.3);
        // vibrato blooms on long notes
        vibratoDepth.gain.setTargetAtTime(0, start, 0.02);
        vibratoDepth.gain.setTargetAtTime(duration > 0.6 ? 22 : 8, start + 0.2, 0.15);
        if (consonant === "h") noise(start - 0.02, 0.09, { volume: volume * 0.25, freq: 1800, out });
        if (consonant === "s") noise(start - 0.04, 0.11, { volume: volume * 0.35, freq: 5200, out });
      },
      end(at) {
        env.gain.setTargetAtTime(0, at, 0.12);
        oscs.forEach((o) => o.stop(at + 1));
        vibrato.stop(at + 1);
      },
    };
  }

  function stop() {
    if (!playing) return;
    playing.timers.forEach(clearTimeout);
    playing.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    const bus = playing.bus;
    setTimeout(() => bus.disconnect(), 400);
    playing = null;
  }

  // Happy Birthday. lang "en" | "zh" adds the sung voice; onPhrase(i) fires as each line starts.
  function play({ volume = 0.35, lang = null, onPhrase, onEnd } = {}) {
    if (!ensureContext()) {
      if (onEnd) onEnd();
      return;
    }
    stop();
    const bus = ctx.createGain();
    bus.connect(master);
    const timers = [];
    let t = ctx.currentTime + 0.12;
    const t0 = t;
    const voice = lang ? createVoice(bus, t0 - 0.05) : null;

    PHRASES.forEach((phrase, i) => {
      const phraseStart = t;
      timers.push(setTimeout(() => onPhrase && onPhrase(i), (phraseStart - t0) * 1000));
      phrase.forEach(([note, beats], j) => {
        const duration = beats * BEAT;
        musicBoxNote(NOTE[note], t, voice ? volume * 0.55 : volume, bus);
        if (voice) {
          const [vowel, consonant] = SYLLABLES[lang][i][j];
          voice.sing(NOTE[note], vowel, consonant, t, duration, 0.22);
        }
        t += duration;
      });
    });
    if (voice) voice.end(t);
    timers.push(setTimeout(() => {
      if (playing && playing.bus === bus) playing = null;
      if (onEnd) onEnd();
    }, (t - t0) * 1000 + 600));

    playing = { bus, timers };
  }

  /* ---------- Sound effects ---------- */
  const SFX = {
    // water bloop
    bloop(t) {
      tone(300, t, { volume: 0.4, decay: 0.25, slideTo: 900 });
      tone(500, t + 0.12, { volume: 0.3, decay: 0.2, slideTo: 1200 });
    },
    // galaxy sparkle arpeggio
    sparkle(t) {
      ["C6", "G5", "E5", "C6", "A5"].forEach((n, i) => tone(NOTE[n] * 1.5, t + i * 0.06, { type: "triangle", volume: 0.18, decay: 0.5 }));
    },
    // lotus chime
    chime(t) {
      tone(NOTE.E5, t, { volume: 0.3, decay: 1.2 });
      tone(NOTE.A5, t + 0.15, { volume: 0.25, decay: 1.4 });
      tone(NOTE.E5 * 3, t, { volume: 0.05, decay: 0.8 });
    },
    // cartoon boing
    boing(t) {
      const o = tone(180, t, { type: "triangle", volume: 0.4, decay: 0.55, slideTo: 520 });
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 18;
      depth.gain.value = 40;
      lfo.connect(depth).connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + 0.6);
    },
    // scorpion snip-snip
    snip(t) {
      noise(t, 0.05, { volume: 0.35, freq: 3500 });
      noise(t + 0.12, 0.05, { volume: 0.35, freq: 4200 });
      tone(900, t + 0.22, { type: "square", volume: 0.08, decay: 0.18, slideTo: 1500 });
    },
    // ta-da!
    tada(t) {
      ["C5", "E5", "G5"].forEach((n, i) => tone(NOTE[n], t + i * 0.07, { type: "square", volume: 0.09, decay: 0.25 }));
      ["C5", "E5", "G5", "C6"].forEach((n) => tone(NOTE[n], t + 0.24, { type: "square", volume: 0.07, decay: 0.9 }));
    },
  };

  function sfx(name) {
    if (!ensureContext() || !SFX[name]) return;
    SFX[name](ctx.currentTime + 0.01);
  }

  /* ---------- Playful loop (gym-food section) ---------- */
  const LOOP_BPM = 132;
  // 2 bars of 8 eighth-notes; null = rest
  const LOOP_MELODY = [
    "C5", null, "E5", "G5", "A5", "G5", "E5", null,
    "F5", null, "A5", "G5", "E5", "D5", "C5", null,
    "C5", null, "E5", "G5", "C6", "A5", "G5", null,
    "F5", "E5", "D5", null, "G4", "B4", "C5", null,
  ];
  const LOOP_BASS = ["C3", "C4", "F3", "C4", "C3", "C4", "G3", "D4"];

  function startLoop() {
    if (loop || !ensureContext()) return;
    const bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.gain.setTargetAtTime(1, ctx.currentTime, 0.3);
    bus.connect(master);
    const step = 60 / LOOP_BPM / 2;
    let next = ctx.currentTime + 0.1;
    let i = 0;
    const timer = setInterval(() => {
      // schedule a little ahead so timing stays steady
      while (next < ctx.currentTime + 0.3) {
        const note = LOOP_MELODY[i % LOOP_MELODY.length];
        if (note) tone(NOTE[note], next, { type: "square", volume: 0.045, decay: step * 1.6, out: bus });
        if (i % 4 === 0) tone(NOTE[LOOP_BASS[(i / 4) % LOOP_BASS.length]], next, { type: "triangle", volume: 0.16, decay: step * 3.5, out: bus });
        if (i % 2 === 1) noise(next, 0.04, { volume: 0.03, freq: 8000, out: bus });
        next += step;
        i++;
      }
    }, 60);
    loop = { bus, timer };
  }

  function stopLoop() {
    if (!loop) return;
    const { bus, timer } = loop;
    clearInterval(timer);
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    setTimeout(() => bus.disconnect(), 1500);
    loop = null;
  }

  function setMuted(value) {
    muted = value;
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.6, ctx.currentTime, 0.05);
  }

  window.MusicBox = { play, stop, sfx, startLoop, stopLoop, setMuted, unlock: ensureContext };
})();
