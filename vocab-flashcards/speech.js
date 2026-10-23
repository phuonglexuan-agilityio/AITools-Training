// Speaks English with the browser's built-in voice, shared by the Study card,
// IPA practice and the Speaking tab. Prefers an American voice; IPA practice
// asks for British to match its RP transcriptions.
(() => {
  'use strict';

  const canSpeak = 'speechSynthesis' in window;

  // Options: lang ('en-US' or 'en-GB'), rate (1 is normal speed) and onend.
  function speak(text, { lang = 'en-US', rate = 0.85, onend } = {}) {
    if (!canSpeak || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-') === lang);
    u.lang = lang;
    if (voice) u.voice = voice;
    u.rate = rate;
    if (onend) u.onend = onend;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  function stop() {
    if (canSpeak) speechSynthesis.cancel();
  }

  window.speech = { canSpeak, speak, stop };
})();
