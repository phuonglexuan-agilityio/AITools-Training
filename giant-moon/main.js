(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const COLORS = ["#fff4d6", "#b9a7e8", "#ffb38a", "#ffffff", "#ffd44d"];

  /* ---------- Twinkling sky ---------- */
  const sky = $("#sky");
  const g = sky.getContext("2d");
  let stars = [];
  let boost = 0;

  function resizeSky() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sky.width = innerWidth * dpr;
    sky.height = innerHeight * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(220, (innerWidth * innerHeight) / 4500));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5,
    }));
  }

  function drawSky(time) {
    const t = time / 1000;
    g.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of stars) {
      const twinkle = reduceMotion ? 0.8 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
      const alpha = Math.min(1, twinkle * (0.7 + boost));
      const r = s.r * (1 + boost * 1.6);
      g.beginPath();
      g.fillStyle = `rgba(255, 248, 230, ${alpha})`;
      g.arc(s.x, s.y, r, 0, Math.PI * 2);
      g.fill();
      if (boost > 0.05) {
        g.beginPath();
        g.fillStyle = `rgba(255, 244, 214, ${boost * 0.25})`;
        g.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        g.fill();
      }
    }
    boost *= 0.95;
    if (!reduceMotion) requestAnimationFrame(drawSky);
  }

  function burstStars() {
    boost = 1.4;
    if (reduceMotion) drawSky(0);
  }

  resizeSky();
  window.addEventListener("resize", () => {
    resizeSky();
    if (reduceMotion) drawSky(0);
  });
  requestAnimationFrame(drawSky);

  /* ---------- 45 smiling faces (one for every year) ---------- */
  function placeFaces() {
    const box = $("#faces");
    const W = box.clientWidth;
    const H = box.clientHeight;
    const size = Math.max(30, Math.min(54, W * 0.085));
    // keep the moon, title, tagline and button clear
    const origin = box.getBoundingClientRect();
    const pad = size * 0.7;
    const keepClear = ["#welcome .moon", "#welcome .title", "#welcome .tagline", "#enter"].map((sel) => {
      const r = $(sel).getBoundingClientRect();
      return { l: r.left - origin.left - pad, r: r.right - origin.left + pad, t: r.top - origin.top - pad, b: r.bottom - origin.top + pad };
    });
    const inCenter = (x, y) => keepClear.some((c) => x > c.l && x < c.r && y > c.t && y < c.b);
    let seed = 24; // fixed seed so the layout is the same on every visit
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const spots = [];
    let minGap = size * 1.15;
    for (let tries = 0; spots.length < 45 && tries < 20000; tries++) {
      if (tries % 4000 === 3999) minGap *= 0.85; // loosen up on small screens
      const x = size / 2 + rand() * (W - size);
      const y = size / 2 + rand() * (H - size);
      if (inCenter(x, y) || spots.some((p) => Math.hypot(p.x - x, p.y - y) < minGap)) continue;
      spots.push({ x, y });
    }
    spots.forEach((p, i) => {
      const img = document.createElement("img");
      img.src = `assets/chibi/face-${i % 3 === 1 ? "laugh" : "smile"}.svg`;
      img.alt = "";
      img.className = "face";
      img.style.left = `${(p.x / W) * 100}%`;
      img.style.top = `${(p.y / H) * 100}%`;
      img.style.setProperty("--size", `${Math.round(size * (0.8 + rand() * 0.4))}px`);
      img.style.setProperty("--tilt", `${Math.round(rand() * 30 - 15)}deg`);
      img.style.animationDelay = `${1.6 + i * 0.07}s, ${(rand() * 4).toFixed(2)}s`;
      box.appendChild(img);
    });
  }
  // wait for the fonts so the title has its final width
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(placeFaces);

  /* ---------- Confetti helpers ---------- */
  // Our own canvas without a worker: the worker path is unreliable on iOS Safari.
  let confettiCannon = null;
  try {
    if (window.confetti) {
      const canvas = document.createElement("canvas");
      canvas.className = "confetti-canvas";
      document.body.appendChild(canvas);
      confettiCannon = window.confetti.create(canvas, { resize: true, useWorker: false });
    }
  } catch (e) {
    console.warn("confetti unavailable", e);
  }

  function burst(opts) {
    if (!confettiCannon || reduceMotion) return;
    try {
      confettiCannon(opts);
    } catch (e) {
      console.warn("confetti error", e);
    }
  }

  function confettiAt(el, opts = {}) {
    const rect = el.getBoundingClientRect();
    burst({
      particleCount: 90,
      spread: 75,
      startVelocity: 32,
      colors: COLORS,
      origin: { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight },
      ...opts,
    });
  }

  // Fireworks across the whole screen: bursts all over the sky plus cannons from both bottom corners.
  function fireworks(duration = 2600) {
    burstStars();
    if (!confettiCannon || reduceMotion) return;
    const end = Date.now() + duration;
    const cannon = (x, angle) =>
      burst({ particleCount: 70, angle, spread: 65, startVelocity: 60, ticks: 160, colors: COLORS, origin: { x, y: 1 } });
    cannon(0, 60);
    cannon(1, 120);
    (function frame() {
      for (let i = 0; i < 2; i++) {
        burst({
          particleCount: 45,
          startVelocity: 28,
          spread: 360,
          ticks: 90,
          gravity: 0.6,
          scalar: 1.1,
          colors: COLORS,
          shapes: ["star", "circle"],
          origin: { x: 0.05 + Math.random() * 0.9, y: 0.08 + Math.random() * 0.6 },
        });
      }
      if (Date.now() < end) setTimeout(frame, 260);
    })();
  }

  /* ---------- Enter ---------- */
  $("#enter").addEventListener("click", () => {
    document.body.classList.remove("locked");
    window.MusicBox.unlock();
    burstStars();
    burst({ particleCount: 60, spread: 120, startVelocity: 22, shapes: ["star"], colors: ["#fff4d6", "#ffffff"], origin: { y: 0.45 } });
    window.MusicBox.play({ volume: 0.18 });
    setTimeout(() => $("#songs").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 900);
  });

  // Re-unlock sound on every tap: iOS may suspend audio when the page was in the background.
  ["touchend", "click"].forEach((type) => document.addEventListener(type, () => window.MusicBox.unlock(), { passive: true }));

  /* ---------- Mute ---------- */
  const muteBtn = $("#mute");
  muteBtn.addEventListener("click", () => {
    const muted = muteBtn.getAttribute("aria-pressed") !== "true";
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
    muteBtn.textContent = muted ? "🔇" : "🔊";
    window.MusicBox.setMuted(muted);
  });

  /* ---------- Reveal on scroll + side dots ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  // stagger the reveals inside each section so they flow in one after another
  $$(".panel").forEach((panel) => {
    panel.querySelectorAll(".reveal").forEach((el, i) => el.style.setProperty("--d", `${i * 0.12}s`));
  });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  $$(".next").forEach((btn) =>
    btn.addEventListener("click", () => $(btn.dataset.next).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }))
  );

  const dots = $$(".dots a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.target.id === "paradox") {
        if (e.isIntersecting) {
          startChibi();
          window.MusicBox.startLoop();
        } else {
          window.MusicBox.stopLoop();
        }
      }
      if (!e.isIntersecting) return;
      dots.forEach((d) => d.classList.toggle("current", d.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px" }); // a section counts as current while it crosses the middle of the screen
  $$(".panel").forEach((p) => sectionObserver.observe(p));

  /* ---------- Birthday song + dancing chibi ---------- */
  const card = $(".song-card");
  const dancer = $("#dancer");
  const notesBox = $("#notes");
  const dancePoses = ["wink", "sparkle", "wink", "hug"]; // one per lyric line; she hugs the cake at the end
  let step = 0;

  function setDancePose(name) {
    dancer.querySelectorAll(".frame").forEach((f) => f.classList.toggle("is-on", f.dataset.pose === name));
  }

  function floatNote() {
    if (reduceMotion) return;
    const n = document.createElement("span");
    n.className = "note";
    n.textContent = ["♪", "♫", "♬", "♩"][step % 4];
    n.style.left = `${15 + Math.random() * 70}%`;
    n.style.setProperty("--drift", `${Math.round(Math.random() * 60 - 30)}px`);
    notesBox.appendChild(n);
    setTimeout(() => n.remove(), 1800);
  }

  card.addEventListener("click", () => {
    card.classList.add("open");
    card.setAttribute("aria-expanded", "true");
    const lines = card.querySelectorAll(".line");
    lines.forEach((l) => l.classList.remove("lit"));
    confettiAt(card);
    dancer.classList.add("dancing");
    window.MusicBox.play({
      onPhrase: (i) => {
        lines.forEach((l, j) => l.classList.toggle("lit", i === j));
        setDancePose(dancePoses[i]);
      },
      onNote: (beats) => {
        // hop on every note, leaning left and right; long notes get a bigger spin
        step++;
        dancer.style.setProperty("--lean", `${step % 2 ? -8 : 8}deg`);
        replay(dancer, beats >= 2 ? "spin" : "hop");
        floatNote();
      },
      onEnd: () => {
        lines.forEach((l) => l.classList.remove("lit"));
        dancer.classList.remove("dancing", "hop", "spin");
        setDancePose("wink");
        confettiAt(card, { particleCount: 80 });
      },
    });
  });

  /* ---------- Personality stars ---------- */
  const traitCard = $("#trait-card");
  function showTrait(title, text) {
    $("#trait-title").textContent = title;
    $("#trait-text").textContent = text;
    traitCard.hidden = false;
    // restart the fade-in for each new trait
    traitCard.style.animation = "none";
    void traitCard.offsetWidth;
    traitCard.style.animation = "";
    $("#star-hint").classList.add("gone");
  }

  function replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  $$(".star").forEach((star) => {
    star.addEventListener("click", () => {
      $$(".star").forEach((s) => s.classList.toggle("active", s === star));
      showTrait(star.dataset.title, star.dataset.text);
      replay(star, "pop");
      window.MusicBox.sfx(star.dataset.sfx);
    });
  });

  const scorpion = $("#scorpion");
  scorpion.addEventListener("click", () => {
    $$(".star").forEach((s) => s.classList.remove("active"));
    showTrait("🦂 Tiny Scorpio, Big Heart", "Warning: may sting if you steal her fries. Otherwise 100% soft.");
    replay(scorpion, "wiggle");
    window.MusicBox.sfx("snip");
  });

  /* ---------- Gym-Food Paradox ---------- */
  const chibi = $("#chibi");
  const frames = $$(".chibi .frame");
  const LOOP = [["lift", 1800], ["drink", 1400], ["spot", 1100], ["sparkle", 1300], ["hug", 1900]];
  let loopIndex = 0;
  let loopTimer = null;
  let started = false;

  function showPose(name) {
    frames.forEach((f) => f.classList.toggle("is-on", f.dataset.pose === name));
    chibi.dataset.pose = name;
  }

  function nextPose() {
    const [name, ms] = LOOP[loopIndex];
    showPose(name);
    loopIndex = (loopIndex + 1) % LOOP.length;
    loopTimer = setTimeout(nextPose, ms);
  }

  function startChibi() {
    if (started) return;
    started = true;
    nextPose();
  }

  chibi.addEventListener("click", () => {
    clearTimeout(loopTimer);
    replay(chibi, "jump");
    showPose("wink");
    window.MusicBox.sfx("tada");
    fireworks(1600);
    loopTimer = setTimeout(nextPose, 1600);
  });

  const slogans = [
    "Discipline in the gym. Loyalty to food.",
    "You lift heavy. You eat happily.",
    "Strong body, soft heart, big appetite.",
  ];
  const sloganEl = $("#slogan");
  let sloganIndex = 0;
  setInterval(() => {
    sloganEl.classList.add("out");
    setTimeout(() => {
      sloganIndex = (sloganIndex + 1) % slogans.length;
      sloganEl.textContent = slogans[sloganIndex];
      sloganEl.classList.remove("out");
    }, 500);
  }, 3600);

  /* ---------- Letter + finale ---------- */
  const envelope = $("#envelope");
  const openBtn = $("#open-letter");
  const letter = $("#letter");
  const finale = $("#finale");

  openBtn.addEventListener("click", () => {
    openBtn.hidden = true;
    envelope.classList.add("open");
    setTimeout(() => envelope.classList.add("gone"), 800);
    setTimeout(() => {
      envelope.hidden = true;
      letter.hidden = false;
      const lines = letter.querySelectorAll(".l");
      const gap = reduceMotion ? 0 : 1100;
      lines.forEach((l, i) => setTimeout(() => l.classList.add("show"), 300 + i * gap));
      setTimeout(() => {
        finale.hidden = false;
        finale.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        fireworks();
        window.MusicBox.play({ volume: 0.2 });
      }, 600 + lines.length * gap);
    }, 1400);
  });

  $("#fireworks").addEventListener("click", fireworks);
})();
