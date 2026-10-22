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

  /* ---------- Confetti helpers ---------- */
  function confettiAt(el, opts = {}) {
    if (!window.confetti || reduceMotion) return;
    const rect = el.getBoundingClientRect();
    window.confetti({
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
    if (!window.confetti || reduceMotion) return;
    const end = Date.now() + duration;
    const cannon = (x, angle) =>
      window.confetti({ particleCount: 70, angle, spread: 65, startVelocity: 60, ticks: 160, colors: COLORS, origin: { x, y: 1 } });
    cannon(0, 60);
    cannon(1, 120);
    (function frame() {
      for (let i = 0; i < 2; i++) {
        window.confetti({
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
    window.MusicBox.unlock();
    burstStars();
    if (window.confetti && !reduceMotion) {
      window.confetti({ particleCount: 60, spread: 120, startVelocity: 22, shapes: ["star"], colors: ["#fff4d6", "#ffffff"], origin: { y: 0.45 } });
    }
    document.body.classList.remove("locked");
    window.MusicBox.play({ volume: 0.18 });
    setTimeout(() => $("#songs").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 900);
  });

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
  $$(".reveal").forEach((el) => revealObserver.observe(el));

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
  }, { threshold: 0.5 });
  $$(".panel").forEach((p) => sectionObserver.observe(p));

  /* ---------- Songs ---------- */
  const cards = $$(".song-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((c) => {
        const isThis = c === card;
        c.classList.toggle("open", isThis);
        c.setAttribute("aria-expanded", String(isThis));
        c.querySelectorAll(".line").forEach((l) => l.classList.remove("lit"));
      });
      confettiAt(card);
      const lines = card.querySelectorAll(".line");
      window.MusicBox.play({
        lang: card.dataset.song,
        onPhrase: (i) => lines.forEach((l, j) => l.classList.toggle("lit", i === j)),
        onEnd: () => {
          lines.forEach((l) => l.classList.remove("lit"));
          confettiAt(card, { particleCount: 50 });
        },
      });
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
      replay(star, "pop");
      window.MusicBox.sfx(star.dataset.sfx);
      showTrait(star.dataset.title, star.dataset.text);
    });
  });

  const scorpion = $("#scorpion");
  scorpion.addEventListener("click", () => {
    $$(".star").forEach((s) => s.classList.remove("active"));
    replay(scorpion, "wiggle");
    window.MusicBox.sfx("snip");
    showTrait("🦂 Tiny Scorpio, Big Heart", "Warning: may sting if you steal her fries. Otherwise 100% soft.");
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
