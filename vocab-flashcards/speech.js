// Speaks English words with the browser's built-in voice, shared by the Study
// card and IPA practice. Prefers a British voice to match the RP transcriptions.
(() => {
  'use strict';

  const canSpeak = 'speechSynthesis' in window;

  function speak(text) {
    if (!canSpeak || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find((v) => v.lang === 'en-GB');
    u.lang = 'en-GB';
    if (voice) u.voice = voice;
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  window.speech = { canSpeak, speak };
})();
