// All the site's sound, made with the Web Audio API (no audio files):
// a music-box Happy Birthday, short sound effects, and a playful loop.
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

  let ctx = null;
  let master = null;
  let muted = false;
  let playing = null;
  let loop = null;
  let noiseBuffer = null;

  // iPhones mute Web Audio when the ring/silent switch is on. Asking for a "playback" audio
  // session (Safari 17+) or playing a silent <audio> element during a tap lifts that.
  let silentAudio = null;
  function unlockIOS() {
    try {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
    } catch (e) { /* not supported */ }
    if (silentAudio) return;
    const rate = 8000;
    const samples = rate / 2;
    const buf = new ArrayBuffer(44 + samples);
    const v = new DataView(buf);
    const str = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    str(0, "RIFF"); v.setUint32(4, 36 + samples, true); str(8, "WAVEfmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    str(36, "data"); v.setUint32(40, samples, true);
    for (let i = 0; i < samples; i++) v.setUint8(44 + i, 128); // 8-bit silence
    silentAudio = new Audio(URL.createObjectURL(new Blob([buf], { type: "audio/wav" })));
    silentAudio.loop = true;
    silentAudio.setAttribute("playsinline", "");
    const p = silentAudio.play();
    if (p && p.catch) p.catch(() => { silentAudio = null; });
  }

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
    // iOS can also leave the context "interrupted" (e.g. after a call or locking the phone)
    if (ctx.state !== "running") ctx.resume();
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
    osc.connect(gain);
    gain.connect(out);
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
    src.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    src.start(start);
    src.stop(start + duration + 0.05);
  }

  function musicBoxNote(freq, start, volume, out) {
    [[1, 1], [2, 0.25], [3, 0.08]].forEach(([mult, amp]) => tone(freq * mult, start, { volume: volume * amp, decay: 1.4, out }));
  }

  function stop() {
    if (!playing) return;
    playing.timers.forEach(clearTimeout);
    const bus = playing.bus;
    if (bus) {
      bus.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      setTimeout(() => bus.disconnect(), 400);
    }
    playing = null;
  }


  // Happy Birthday; onPhrase(i) fires as each line starts.
  function play({ volume = 0.35, onPhrase, onEnd } = {}) {
    stop();
    // Lyric timing runs on plain timers, so the words still light up even if audio fails.
    const timers = [];
    let beats = 0;
    PHRASES.forEach((phrase, i) => {
      const at = beats * BEAT * 1000 + 120;
      timers.push(setTimeout(() => onPhrase && onPhrase(i), at));
      phrase.forEach(([, b]) => (beats += b));
    });
    timers.push(setTimeout(() => {
      if (playing && playing.timers === timers) playing = null;
      if (onEnd) onEnd();
    }, beats * BEAT * 1000 + 720));
    playing = { bus: null, timers };

    try {
      if (!ensureContext()) return;
      const bus = ctx.createGain();
      bus.connect(master);
      playing.bus = bus;
      let t = ctx.currentTime + 0.12;
      PHRASES.forEach((phrase) => {
        phrase.forEach(([note, b]) => {
          musicBoxNote(NOTE[note], t, volume, bus);
          t += b * BEAT;
        });
      });
    } catch (e) {
      console.warn("sound error", e);
    }
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
      lfo.connect(depth);
      depth.connect(o.frequency);
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

  function unlock() {
    unlockIOS();
    ensureContext();
  }

  // Sound must never break the page: any audio error is logged and ignored.
  const safe = (fn) => (...args) => {
    try {
      return fn(...args);
    } catch (e) {
      console.warn("sound error", e);
    }
  };

  window.MusicBox = {
    play: safe(play),
    stop: safe(stop),
    sfx: safe(sfx),
    startLoop: safe(startLoop),
    stopLoop: safe(stopLoop),
    setMuted: safe(setMuted),
    unlock: safe(unlock),
  };
})();
