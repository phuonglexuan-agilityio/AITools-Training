# Vocab Flashcards

A small, dependency-free web app for learning vocabulary with flashcards.

## Run

Open `index.html` in a browser — no build step or server needed.
(Or serve the folder: `npx serve vocab-flashcards` / `python3 -m http.server`.)

## Features

- **Study** — flip cards (click / Space), navigate (← →), mark each word as
  *Still learning* (1) or *I know it* (2), filter by status and shuffle.
  Choose the card's **Front**: the word, its English meaning or its Vietnamese
  meaning; the back shows the rest. A progress bar tracks known words.
- **IPA practice (Phase 1)** — learn the 44 sounds of British English (RP)
  through 132 example words (3 per sound):
  - *Sound chart* — every IPA symbol grouped into short vowels, long vowels,
    diphthongs and consonants. Pick one to see how to make it, example words
    with the sound highlighted, and audio.
  - *Flashcards* — word → IPA (or IPA → word), with the focus sound
    highlighted on the back. Space flips, ← → navigate, S plays the word.
  - *Quiz* — "Word → IPA" (the wrong options swap the focus sound for one
    people often confuse it with, e.g. /ʃɪp/ vs /ʃiːp/) or "IPA → word".
    Keys 1–4 answer, Enter moves on. Accuracy per sound is saved and shown on the chart.
  - Every example word has its Vietnamese meaning (Phase 2), shown in the
    chart, on the back of each flashcard and in quiz feedback.
  - Practise everything, one group, or a single sound.
  - Audio uses the browser's built-in speech voice (`speechSynthesis`), so it
    depends on the voices your system has.
- **Manage words** — add, edit, delete and search words (word, pronunciation /
  part of speech, English meaning, Vietnamese meaning, example sentence).
  Search matches English and Vietnamese, with or without accent marks
  ("suc tich" finds "súc tích").
- **Import / export** — export the deck as JSON; import JSON or CSV/TSV.
  CSV/TSV lines are `word,meaning[,example]`, or start the file with a header
  row to choose columns by name, e.g. `word,meaning,vietnamese,example`
  (accepted names: word, meaning/english, vi/vietnamese/tiếng việt, example,
  pronunciation). Duplicate words are skipped on import.
- Words and IPA quiz accuracy are saved in the browser's `localStorage`; a sample deck loads on first run.
- Responsive layout and automatic dark mode.
- Delete, Reset, Reset accuracy and adding a duplicate word ask in an in-page
  confirm box (Enter or OK confirms; Escape, Cancel or a click outside cancels)
  instead of the browser's `confirm()` pop-up, which some embedded viewers block.

## Tests

```bash
cd vocab-flashcards
npm install
npx playwright install chromium   # first time only
npm test                          # unit + browser tests
```

- `npm run test:unit` — Node's built-in test runner (`tests/unit/`). Checks the
  IPA deck: 44 sounds in the right groups, 3 unique words each with a
  Vietnamese meaning, every
  transcription marks its own focus sound, only IPA characters (ɡ not g), and
  every confusable swap gives a distinct wrong answer.
- `npm run test:e2e` — Playwright in Chromium (`tests/e2e/`), one spec per tab:
  study (flip, navigation, known/learning filters, shuffle, persistence),
  manage words (add, edit, delete, search, duplicate check, import CSV/TSV/JSON,
  export, reset, HTML escaping) and IPA practice (chart, flashcards, both quiz
  types, scopes, per-sound accuracy, audio, phone layout) and the confirm box.
  Any page error, console error or native browser dialog fails the test.

The tests also run in GitHub Actions on changes to `vocab-flashcards/`.
