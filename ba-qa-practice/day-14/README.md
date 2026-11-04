# Day 14: Capstone, test and harden

## Tests added or changed

| Test | Purpose | Result |
| --- | --- | --- |
| IMP-2 (marker removed) | BUG-1 fixed | Pass |
| EDT-2 (marker removed) | BUG-2 fixed | Pass |
| IMP-5 | Duplicate check ignores letter case inside a file | Pass |
| EDT-3 | Cancel leaves the deck unchanged | Pass |
| EDT-4 | Meaning-only edit does not ask | Pass |
| EDT-5 | OK saves the word (two copies, as the user agreed) | Pass |

Full run: 74 browser tests pass, 16 unit tests pass (local). CI result is on the PR.

## Hardening: what I tried to break

| Attempt | Outcome |
| --- | --- |
| Edit a word and keep its own spelling | No false question (it compares only to other words) — EDT-4 covers meaning-only edit |
| Edit to a different letter case of itself (e.g. word to WORD) | Not tested; reasoned from code: same id is excluded, so no question |
| Existing Add duplicate prompt | Existing test still passes |
| Built-in 500-word list | Existing test still passes |

## Correction to Day 6

Matrix row IMP-4 (CSV with comma) was marked "unclear". Reading `parseImport` in `app.js` shows
the format is documented in a comment: without a header row each line is `word,meaning[,example]`
and everything after the second comma is joined into the example. So the app behaved as designed.
Not a bug; the matrix row was corrected.

## Remaining risk

- Only Chromium was tested; no phone-size or Firefox/Safari run.
- Edit-to-different-case-of-itself was reasoned, not run.
