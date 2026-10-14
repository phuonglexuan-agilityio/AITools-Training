# Vocab Flashcards

A small, dependency-free web app for learning vocabulary with flashcards.

## Run

Open `index.html` in a browser — no build step or server needed.
(Or serve the folder: `npx serve vocab-flashcards` / `python3 -m http.server`.)

## Features

- **Study** — flip cards (click / Space), navigate (← →), mark each word as
  *Still learning* (1) or *I know it* (2), filter by status, shuffle, and
  switch to "meaning first" mode. A progress bar tracks known words.
- **Manage words** — add, edit, delete and search words (word, pronunciation /
  part of speech, meaning, example sentence).
- **Import / export** — export the deck as JSON; import JSON or CSV/TSV lines
  in the form `word,meaning[,example]`. Duplicate words are skipped on import.
- Words are saved in the browser's `localStorage`; a sample deck loads on first run.
- Responsive layout and automatic dark mode.
