// In-page replacement for window.confirm(). Native dialogs are blocked in some
// embedded viewers (confirm() then returns false without asking), so the app
// asks inside the page instead. Resolves true for OK, false for Cancel,
// Escape or a click on the backdrop.
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const overlay = $('confirm-overlay');
  const message = $('confirm-msg');
  const ok = $('confirm-ok');
  const cancel = $('confirm-cancel');
  let finish = null;

  // While the box is open, keep the app's keyboard shortcuts from firing
  // behind it. Default actions (Enter/Space on the focused button) still run.
  window.addEventListener('keydown', (e) => {
    if (!finish) return;
    e.stopPropagation();
    if (e.key === 'Escape') finish(false);
  }, true);

  ok.addEventListener('click', () => finish && finish(true));
  cancel.addEventListener('click', () => finish && finish(false));
  overlay.addEventListener('click', (e) => { if (e.target === overlay && finish) finish(false); });

  window.askConfirm = (text, okLabel = 'OK') => new Promise((resolve) => {
    if (finish) finish(false);
    const returnFocus = document.activeElement;
    message.textContent = text;
    ok.textContent = okLabel;
    overlay.hidden = false;
    ok.focus();
    finish = (answer) => {
      finish = null;
      overlay.hidden = true;
      if (returnFocus && returnFocus.focus) returnFocus.focus();
      resolve(answer);
    };
  });
})();
