# Vocab Flashcards

A small, dependency-free web app for learning English vocabulary with
flashcards, with Vietnamese meanings and a built-in IPA (pronunciation)
trainer. It is plain HTML, CSS and JavaScript: no framework, no build step and
no backend. Everything you add is saved in your own browser.

## Contents

- [Quick start](#quick-start)
- [Features](#features)
- [How to use it](#how-to-use-it)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Importing and exporting words](#importing-and-exporting-words)
- [Where your data is stored](#where-your-data-is-stored)
- [Project structure](#project-structure)
- [How the code fits together](#how-the-code-fits-together)
- [Tests](#tests)
- [Continuous integration](#continuous-integration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Quick start

**Option 1: open the file.** Double-click `vocab-flashcards/index.html`, or
open it from your browser's *File → Open*. That's all you need.

**Option 2: serve the folder locally.** Useful if you want a normal
`http://` URL (for example to open it on your phone over the same Wi-Fi):

```bash
git clone https://github.com/phuonglexuan-agilityio/AITools-Training.git
cd AITools-Training/vocab-flashcards

# Pick one:
python3 -m http.server 8000      # then open http://localhost:8000
npx serve .                      # then open the URL it prints (default http://localhost:3000)
```

The app has no runtime dependencies. `npm install` is only needed to run the
tests (see [Tests](#tests)).

A sample deck of six words loads the first time you open the app, so you can
try it straight away. Press **+ Add 500 BA, software & AI words** in Study to
add the built-in work word list.

## Features

- **Study** — flip cards (click / Space), navigate (← →), mark each word as
  *Still learning* (1) or *I know it* (2), filter by status and shuffle.
  Choose the card's **Front**: the word, its English meaning or its Vietnamese
  meaning; the back shows the rest. A progress bar tracks known words.
  The word's face shows its IPA pronunciation and a 🔊 button (or S) that
  speaks the word; the button hides while the word is still the answer.
- **Built-in work word list** — 500 words for a Business Analyst on software
  and AI projects, in seven topics: Business analysis, Agile & projects,
  Software & development, Testing & quality, Data & cloud, AI & machine
  learning, and Claude & AI assistants. Each word has an American (General
  American) IPA transcription, part of speech, English meaning, Vietnamese
  meaning and a work example. One click in Study adds it to your deck (words
  you already have are skipped), and the **Topic** filter studies one topic at
  a time; your own words show under *My words*.
- **IPA practice (Phase 1)** — learn the 44 sounds of British English (RP)
  through 132 example words (3 per sound):
  - *Sound chart* — every IPA symbol grouped into short vowels, long vowels,
    diphthongs and consonants. Pick one to see how to make it, example words
    with the sound highlighted, and audio.
  - *Flashcards* — word → IPA (or IPA → word), with the focus sound
    highlighted on the back. Space flips, ← → navigate, S plays the word.
  - *Quiz* — "Word → IPA" (the wrong options swap the focus sound for one
    people often confuse it with, e.g. /ʃɪp/ vs /ʃiːp/) or "IPA → word".
    Keys 1–4 answer, Enter moves on. Accuracy per sound is saved and shown on
    the chart.
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
  Duplicate words are skipped on import.
- **Saved locally** — words and IPA quiz accuracy are kept in the browser's
  `localStorage`.
- **Responsive layout and automatic dark mode** (follows your system setting).
- **In-page confirm box** — Delete, Reset, Reset accuracy and adding a
  duplicate word ask in an in-page confirm box (Enter or OK confirms; Escape,
  Cancel or a click outside cancels) instead of the browser's `confirm()`
  pop-up, which some embedded viewers block.

## How to use it

The app has three tabs.

### Study

1. Use **Show** to study *All words*, only *Still learning*, or only *Known*.
2. Use **Front** to choose what appears on the front of the card: the word,
   the English meaning or the Vietnamese meaning.
3. Click the card (or press Space) to flip it. The back shows the other
   fields plus the pronunciation and example sentence.
   Press 🔊 (or S) on the word's face to hear it.
4. Press **Still learning** or **I know it**. The card moves on and the
   progress bar updates.
5. **Shuffle** randomises the order.
6. **+ Add 500 BA, software & AI words** adds the built-in list. After that,
   use **Topic** to study one topic (for example *Business analysis*). The
   button disappears once every word of the list is in your deck, and comes
   back after **Reset**.

### IPA practice

Pick a mode at the top (**Sound chart**, **Flashcards** or **Quiz**) and use
**Practise** to narrow it to all sounds, one group (e.g. *Diphthongs*) or a
single sound.

- **Sound chart**: click a symbol to see a tip on how to make the sound and
  three example words with audio. Your quiz accuracy for each sound is shown
  on the chart.
- **Flashcards**: say the word aloud, then flip to check the transcription.
  Tick **IPA first** to reverse the cards.
- **Quiz**: choose *Word → IPA* or *IPA → word*, then pick one of four
  answers. **Reset accuracy** clears the saved per-sound scores.

Transcriptions use British English (RP).

### Manage words

- Fill in the form and press **Add word**. *Word* and *Meaning (English)* are
  required; pronunciation / part of speech, Vietnamese meaning and an example
  sentence are optional.
- Use **Edit** or **Delete** on any word in the list.
- The search box filters by English or Vietnamese, with or without accents.
- **Export**, **Import** and **Reset** (back to the sample deck) are next to
  the search box.

## Keyboard shortcuts

| Where | Key | Action |
| --- | --- | --- |
| Study | Space / Enter | Flip card |
| Study | ← / → | Previous / next card |
| Study | 1 | Mark *Still learning* |
| Study | 2 | Mark *I know it* |
| Study | S | Hear the word (when the word's face is up) |
| IPA flashcards | Space / Enter | Flip card |
| IPA flashcards | ← / → | Previous / next card |
| IPA flashcards | S | Hear the word |
| IPA quiz | 1–4 | Choose an answer |
| IPA quiz | Enter | Next question |
| Confirm box | Enter / Escape | OK / Cancel |

Shortcuts are ignored while you type in a form field.

## Importing and exporting words

**Export** downloads your whole deck as `vocabulary.json`.

**Import** accepts `.json`, `.csv` or `.txt` (tab-separated) files. Words that
already exist in the deck are skipped.

**JSON**: an array of word objects, the same shape that Export produces.
Only `word` and `meaning` are required.

```json
[
  {
    "word": "concise",
    "sub": "/kənˈsaɪs/ (adj)",
    "meaning": "Giving a lot of information clearly in few words",
    "vi": "ngắn gọn, súc tích",
    "example": "Write concise acceptance criteria.",
    "known": false
  }
]
```

Words from the built-in list also carry a `topic` (for example
`"topic": "Business analysis"`), which drives the Study tab's **Topic**
filter. Imported words keep their topic.

**CSV / TSV without a header**: one word per line as
`word,meaning[,example]`.

```csv
ephemeral,Lasting for a very short time,Fame is often ephemeral.
mitigate,To make something less severe or harmful
```

**CSV / TSV with a header**: start the file with a header row to choose
columns by name, in any order.

```csv
word,meaning,vietnamese,example
ambiguous,Open to more than one interpretation,mơ hồ,The requirement was ambiguous.
```

| Header name(s) | Field |
| --- | --- |
| `word` | Word |
| `meaning`, `english` | English meaning |
| `vi`, `vietnamese`, `tiếng việt` | Vietnamese meaning |
| `example` | Example sentence |
| `pronunciation` | Pronunciation / part of speech |

## Where your data is stored

All data stays in your browser's `localStorage`; nothing is sent to a server.

| Key | Contents |
| --- | --- |
| `vocab-flashcards.v1` | Your word deck, including which words are known |
| `vocab-flashcards.ipa-stats.v1` | IPA quiz accuracy per sound |

This means your words are tied to one browser on one device. Use **Export** to
back them up or move them to another browser, and **Import** to load them
there. Clearing site data for the page also clears your deck.

## Project structure

```text
vocab-flashcards/
├── index.html            # Page markup: header tabs, the three views, toast and confirm box
├── styles.css            # All styling, including responsive layout and dark mode
├── wordlists-data.js     # Built-in 500-word BA, software & AI list (American IPA)
├── app.js                # Study + Manage words: deck state, storage, import/export
├── ipa-data.js           # IPA deck: 44 sounds, groups, tips and example words
├── ipa.js                # IPA practice view: sound chart, flashcards, quiz, audio
├── speech.js             # Speaks words with the browser's voice (Study and IPA)
├── confirm-dialog.js     # In-page replacement for window.confirm()
├── package.json          # Test scripts and the Playwright dev dependency
├── package-lock.json
├── playwright.config.js  # Browser test configuration (Chromium)
├── .gitignore
└── tests/
    ├── unit/
    │   ├── ipa-data.test.js       # Checks the IPA deck data
    │   └── wordlists-data.test.js # Checks the built-in word list
    └── e2e/
        ├── fixtures.js            # Opens the app and fails on page errors or native dialogs
        ├── study.spec.js          # Study tab
        ├── manage.spec.js         # Manage words tab
        ├── ipa.spec.js            # IPA practice tab
        ├── wordlist.spec.js       # Built-in word list and Topic filter
        └── confirm-dialog.spec.js # In-page confirm box
```

## How the code fits together

- Each script is a self-contained IIFE loaded with a plain `<script>` tag in
  `index.html`, in this order: `confirm-dialog.js`, `speech.js`, `wordlists-data.js`, `app.js`,
  `ipa-data.js`, `ipa.js`. There are no modules or bundler.
- `confirm-dialog.js` exposes `window.askConfirm(message, okLabel)`, which the
  other scripts `await`; it resolves `true` for OK and `false` for Cancel, Escape or a click
  on the backdrop.
- `speech.js` exposes `window.speech = { canSpeak, speak(text) }`, which uses
  `speechSynthesis` with a British English voice when one is installed.
- `app.js` owns the word deck. Every word is normalised to
  `{ id, word, sub, meaning, example, vi, known }` (plus `topic` for words
  from the built-in list) and the whole list is saved to `localStorage` after
  each change.
- `wordlists-data.js` defines `window.WORD_LIST`: topics, each with words
  written as `[word, IPA, part of speech, English meaning, Vietnamese, example]`.
  `app.js` turns them into deck words with `sub` = `/IPA/ (pos)`.
- `ipa-data.js` defines `window.IPA_GROUPS` and `window.IPA_SOUNDS`. Each
  sound has a symbol, group, tip, a list of commonly confused sounds (`alt`)
  and three example words written as `[word, transcription, Vietnamese]`. The
  focus sound in each transcription is wrapped in `[ ]` so it can be
  highlighted, and the quiz builds wrong answers by swapping it for an `alt`
  sound.
- `ipa.js` reads that data, renders the IPA tab and saves quiz accuracy under
  its own storage key.

## Tests

Requires Node.js 22 (the version CI uses).

```bash
cd vocab-flashcards
npm install
npx playwright install chromium   # first time only
npm test                          # unit + browser tests
```

- `npm run test:unit` — Node's built-in test runner (`tests/unit/`). Checks the
  IPA deck: 44 sounds in the right groups, 3 unique words each with a
  Vietnamese meaning, every transcription marks its own focus sound, only IPA
  characters (ɡ not g), and every confusable swap gives a distinct wrong
  answer.
  It also checks the built-in word list: 500 unique words, every field filled
  in, a known part of speech, and American IPA only (no British vowels such as
  ɒ or əʊ, ɡ not g, a stress mark on every word of more than one syllable).
- `npm run test:e2e` — Playwright in Chromium (`tests/e2e/`), one spec per tab:
  study (flip, navigation, known/learning filters, shuffle, persistence),
  manage words (add, edit, delete, search, duplicate check, import CSV/TSV/JSON,
  export, reset, HTML escaping) and IPA practice (chart, flashcards, both quiz
  types, scopes, per-sound accuracy, audio, phone layout) and the confirm box.
  Any page error, console error or native browser dialog fails the test.

The browser tests open `index.html` directly from disk, so no server is needed.
Each test starts with empty `localStorage`. Useful options:

```bash
npx playwright test tests/e2e/study.spec.js   # run one spec
npx playwright test --headed                  # watch the browser
npx playwright show-report                    # open the last HTML report
```

## Continuous integration

[`.github/workflows/vocab-flashcards-tests.yml`](../.github/workflows/vocab-flashcards-tests.yml)
runs the unit and browser tests on every push and pull request that changes
`vocab-flashcards/` or the workflow itself. If the browser tests fail, the
Playwright HTML report is uploaded as the `playwright-report` artifact on the
run (kept for 7 days).

## Contributing

1. Create a branch from `main`.
2. Make your change. Keep the app dependency-free: plain HTML, CSS and
   JavaScript that runs by opening `index.html`, with no build step.
3. Follow the existing style: each script wrapped in an IIFE with
   `'use strict'`, `const`/`let`, small named functions, and short comments
   that explain *why*.
4. Escape any user-provided text before inserting it into the page.
5. Use the in-page confirm box (`confirm-dialog.js`), not `window.confirm()`
   or `alert()`; the tests fail on native dialogs.
6. Add or update tests for the behaviour you change, and run `npm test`.
7. Update this README if you add a feature, a shortcut or a data format.
8. Open a pull request against `main`. CI must be green before merging.

**Adding IPA example words**: edit `ipa-data.js`. Keep exactly three words per
sound, wrap the focus sound in `[ ]` in each transcription, use real IPA
characters (for example `ɡ`, not `g`), and include a Vietnamese meaning. Run
`npm run test:unit`, which checks all of these rules.

## Troubleshooting

- **No sound in Study or IPA practice**: audio uses your browser's speech voices. Check
  that your system has an English voice installed and that the tab is not
  muted. Voices differ between browsers and operating systems.
- **My words disappeared**: they live in one browser's `localStorage`. A
  different browser, a private window or clearing site data starts from the
  sample deck again. Restore from an exported `vocabulary.json`.
- **Import skipped some words**: words that already exist in the deck are
  skipped, and lines without both a word and a meaning are ignored.
- **`npm run test:e2e` says the browser is missing**: run
  `npx playwright install chromium` once.
