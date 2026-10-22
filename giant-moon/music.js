// A tiny music box: plays "Happy Birthday" with the Web Audio API, no audio files.
(function () {
  const NOTE = { G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };

  // [note, beats] per phrase; one phrase per lyric line.
  const PHRASES = [
    [["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2]],
    [["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2]],
    [["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2]],
    [["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2.5]],
  ];
  const BEAT = 0.46; // seconds

  let ctx = null;
  let master = null;
  let muted = false;
  let playing = null;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function pluck(freq, start, volume, out) {
    // Music-box tone: a sine with a quieter octave overtone and a fast decay.
    [[1, 1], [2, 0.25], [3, 0.08]].forEach(([mult, amp]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume * amp, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
      osc.connect(gain).connect(out);
      osc.start(start);
      osc.stop(start + 1.5);
    });
  }

  function stop() {
    if (!playing) return;
    playing.timers.forEach(clearTimeout);
    playing.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    const bus = playing.bus;
    setTimeout(() => bus.disconnect(), 400);
    playing = null;
  }

  // onPhrase(i) is called as each phrase starts; onEnd when the tune finishes.
  function play({ volume = 0.35, onPhrase, onEnd } = {}) {
    if (!ensureContext()) {
      if (onEnd) onEnd();
      return;
    }
    stop();
    const bus = ctx.createGain();
    bus.connect(master);
    const timers = [];
    let t = ctx.currentTime + 0.08;
    const t0 = t;

    PHRASES.forEach((phrase, i) => {
      const phraseStart = t;
      timers.push(setTimeout(() => onPhrase && onPhrase(i), (phraseStart - t0) * 1000));
      phrase.forEach(([note, beats]) => {
        pluck(NOTE[note], t, volume, bus);
        t += beats * BEAT;
      });
    });
    timers.push(setTimeout(() => {
      if (playing && playing.bus === bus) playing = null;
      if (onEnd) onEnd();
    }, (t - t0) * 1000 + 600));

    playing = { bus, timers };
  }

  function setMuted(value) {
    muted = value;
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.05);
  }

  window.MusicBox = { play, stop, setMuted, unlock: ensureContext };
})();
