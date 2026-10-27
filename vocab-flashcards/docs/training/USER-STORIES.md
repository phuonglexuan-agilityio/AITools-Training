# Vocab Flashcards: user stories

Stories for the mentee programme. Each one is also a GitHub issue on the
Project board (epics are #14 to #20, stories #21 to #39). Requirements, constraints and the Definition of Done are in
[SPEC.md](SPEC.md); every story must meet that Definition of Done as well as
its own acceptance criteria.

**Sizes:** S = up to 1 day, M = 2 to 3 days, L = 4 or more days for a mentee.

| ID | Issue | Story | Epic | Size | Starter |
| --- | --- | --- | --- | --- | --- |
| US-00 | #21 | Set up the project and open a first PR | Onboarding | S | ✓ |
| US-01 | #22 | Keyboard shortcuts help | Study & memory | S | ✓ |
| US-02 | #23 | Light / dark / system theme choice | Look, feel & delivery | S | ✓ |
| US-03 | #24 | Spaced repetition ("Due today") | Study & memory | L | |
| US-04 | #25 | Study session summary | Study & memory | S | ✓ |
| US-05 | #26 | Choose voice and speed | Pronunciation & audio | M | |
| US-06 | #27 | IPA trainer in General American | Pronunciation & audio | L | |
| US-07 | #28 | Listen-and-type quiz | Practice & quizzes | M | |
| US-08 | #29 | Meaning quiz | Practice & quizzes | M | |
| US-09 | #30 | Fill-in-the-blank collocation quiz | Practice & quizzes | M | |
| US-10 | #31 | Say it: pronunciation check with the microphone | Pronunciation & audio | L | |
| US-11 | #32 | Daily goal and streak | Progress & motivation | M | |
| US-12 | #33 | Progress page | Progress & motivation | M | |
| US-13 | #34 | Tags for my own words | Word management & data | M | |
| US-14 | #35 | Bulk actions in Manage words | Word management & data | M | |
| US-15 | #36 | Back up and restore everything | Word management & data | M | |
| US-16 | #37 | Accessibility pass with automated check | Look, feel & delivery | M | |
| US-17 | #38 | Install and use offline | Look, feel & delivery | M | |
| US-18 | #39 | Export deck as CSV | Word management & data | S | ✓ |

---

## Onboarding

### US-00 Set up the project and open a first PR

**As a** mentee, **I want** to run the app and its tests on my laptop and get
a first small PR merged, **so that** I know the codebase and the team's PR
flow before I build a feature.

**Acceptance criteria**

1. I can open the app locally (from disk and with a local server) and use
   Study, IPA practice and Manage words.
2. `npm install`, `npx playwright install chromium` and `npm test` all pass on
   my machine.
3. I add one line about myself to `vocab-flashcards/docs/training/MENTEES.md`
   (create the file if it does not exist): name, GitHub handle, and one
   feature I would like to build.
4. My PR follows the ways of working in SPEC.md section 9 (branch name,
   linked issue, description), CI is green, and the mentor merges it.
5. I write down in the PR description one thing in the README that was
   unclear or wrong, if any.

**Notes:** Read the README sections *How the code fits together* and
*Tests* first. Each mentee gets their own copy of this issue.

---

## Study & memory

### US-01 Keyboard shortcuts help

**As a** learner, **I want** to see all keyboard shortcuts inside the app,
**so that** I can study faster without opening the README.

**Acceptance criteria**

1. **Given** I am on any tab and not typing in a field, **when** I press `?`
   (Shift + /), **then** a panel lists the shortcuts for the tab I am on and
   the general ones.
2. A visible **Keyboard shortcuts** button in the header opens the same panel,
   for people who do not know about `?`.
3. Escape, a close button, or a click outside closes the panel, and focus
   returns to where it was.
4. While the panel is open, study shortcuts (Space, ← →, 1, 2, S) do nothing.
5. Pressing `?` while typing in a form field types a `?` and does not open the
   panel.
6. The list matches the README shortcuts table.

**Tests:** e2e for opening with `?` and the button, closing three ways, and
no study action while open.

### US-03 Spaced repetition ("Due today")

**As a** learner, **I want** the app to show me the words I am about to
forget, **so that** an hour a day is spent on the words that need it.

**Acceptance criteria**

1. Each word has a review box from 1 to 5 (Leitner system). New words start
   in box 1.
2. *I know it* moves a word up one box (max 5); *Still learning* moves it back
   to box 1.
3. A word is **due** when its next review date has arrived. Intervals: box 1 =
   same day, 2 = 1 day, 3 = 3 days, 4 = 7 days, 5 = 14 days.
4. The **Show** filter has a new option **Due today**, which is the default
   when at least one word is due, and the count of due words is shown next to
   it.
5. When nothing is due, Study shows "All caught up for today" and offers to
   study all words.
6. Existing decks load without errors: words with no box get box 1 (or box 3
   if already marked known) and are due today.
7. Export and import keep the box and next review date.

**Notes:** Keep the scheduling logic in a small pure function so it can be
unit tested with fixed dates. Inject "today" instead of calling `new Date()`
inside the logic.

**Tests:** unit tests for box moves and due dates (including month ends);
e2e for the filter and the "caught up" state with a fixed clock.

### US-04 Study session summary

**As a** learner, **I want** a short summary when I finish a round of cards,
**so that** I can see what I achieved and what to repeat.

**Acceptance criteria**

1. **When** I reach the last card of the current filter and move on, **then**
   a summary shows: cards seen, how many I marked *I know it*, how many *Still
   learning*, and the time spent.
2. The summary lists the words I marked *Still learning* in this round.
3. **Study again** restarts the round with only those words; **Done** goes
   back to the first card of the full filter.
4. Changing the filter, front or topic starts a new round and resets the
   counts.
5. If I marked nothing, the summary still shows cards seen and time.

**Tests:** e2e that goes through a 3-card deck and checks the numbers and
the *Study again* list.

---

## Pronunciation & audio

### US-05 Choose voice and speed

**As a** learner, **I want** to choose which voice reads the words and how
fast, **so that** I hear a clear American voice at a speed I can follow.

**Acceptance criteria**

1. A **Voice** setting lists the English voices the browser has, with
   American (`en-US`) voices first. The default is the first `en-US` voice.
2. A **Speed** setting offers 0.6×, 0.8×, 1× (default) and 1.2×.
3. A **Test** button speaks a sample sentence with the chosen settings.
4. The choice is used everywhere the app speaks (Study, IPA practice, and the
   Speaking tab once merged) and is saved in `localStorage`.
5. If the saved voice is not available on this device, the app falls back to
   the default without an error and says so once.
6. If the browser has no speech voices, the setting explains why audio is
   unavailable instead of showing an empty list.

**Notes:** Voices load asynchronously (`voiceschanged` event). Builds on the
`speech.js` changes in PR #11; coordinate with the mentor if it is not merged
yet.

**Tests:** e2e with a stubbed `speechSynthesis` that checks the voice and
rate passed to `speak`, persistence after reload and the fallback.

### US-06 IPA trainer in General American

**As a** learner who wants an American accent, **I want** the IPA trainer to
use General American sounds and transcriptions, **so that** it matches the
word list and the voice I hear.

**Acceptance criteria**

1. The sound chart shows the General American vowel set: for example /ɑ/ in
   *lot*, /oʊ/ in *go*, r-coloured /ɝ/ and /ɚ/, and no RP-only sounds such as
   /ɒ/, /əʊ/, /ɪə/, /eə/, /ʊə/.
2. Every sound has a tip written for Vietnamese speakers, three example words
   with GA transcriptions and Vietnamese meanings.
3. Confusable pairs used by the quiz still produce distinct wrong answers.
4. The IPA tab speaks with an `en-US` voice.
5. The README and the in-app text say "General American" instead of
   "British English (RP)", and the sound count is correct.
6. Saved quiz accuracy for sounds that no longer exist is ignored without an
   error.
7. `tests/unit/ipa-data.test.js` is updated to the GA rules and passes.

**Notes:** Use a dictionary such as Cambridge (US) to check transcriptions.
Ask the mentor to review the sound list before converting all words.

### US-10 Say it: pronunciation check with the microphone

**As a** learner, **I want** to say a word or phrase and have the app tell me
whether it understood me, **so that** I get feedback without a teacher.

**Acceptance criteria**

1. On a Study card (word face) and on each Speaking phrase there is a **Say
   it** button.
2. **When** I press it and allow the microphone, the app listens in `en-US`
   using the browser's speech recognition and shows what it heard.
3. If the heard text matches the target (ignoring case and punctuation), it
   shows a success message; otherwise it shows the heard text with the
   different words highlighted.
4. For phrases it shows a match score (percentage of words matched).
5. If the browser does not support speech recognition (for example Firefox),
   the button is hidden and a one-line note explains why.
6. If I deny the microphone, a clear message explains how to allow it.
7. A note tells the learner that on some browsers recognition runs on the
   browser maker's servers.

**Notes:** Depends on PR #11 (Speaking tab). `SpeechRecognition` /
`webkitSpeechRecognition` support varies; keep the comparison logic in a pure
function.

**Tests:** unit tests for the text comparison and score; e2e with a stubbed
recognition object for success, mismatch, unsupported and denied.

---

## Practice & quizzes

### US-07 Listen-and-type quiz

**As a** learner, **I want** to hear a word and type it, **so that** I
connect the sound with the spelling.

**Acceptance criteria**

1. A **Quiz** area (a new tab or a mode inside Study, agreed with the mentor)
   has a **Listen and type** mode that uses the current filter and topic.
2. Each question plays the word automatically; **Play again** (or S) replays
   it.
3. **When** I type the word and press Enter, **then** it shows correct or
   wrong, the right spelling, IPA and meaning. Case and leading or trailing
   spaces are ignored.
4. A **Hint** shows the first letter and the number of letters.
5. A round has 10 questions (or fewer if the filter has fewer words) and ends
   with a score.
6. Wrong words can be marked *Still learning* in one click from the result.

**Tests:** e2e with stubbed speech for correct, wrong, hint and the end
score.

### US-08 Meaning quiz

**As a** learner, **I want** a multiple-choice quiz on meanings, **so that**
I can check I really know the words in my deck.

**Acceptance criteria**

1. The **Quiz** area has a **Meaning** mode: a word is shown with four
   meanings to choose from (one right, three from other words in the deck).
2. A **Direction** option switches to meaning → word, and an option chooses
   English or Vietnamese meanings.
3. Keys 1 to 4 answer and Enter moves on, like the IPA quiz.
4. Wrong options come from the same topic when possible, so the quiz is not
   too easy.
5. The quiz needs at least 4 words; with fewer it explains why it cannot
   start.
6. A round of 10 questions ends with a score and the list of missed words.

**Tests:** unit test for building options (no duplicates, right answer
present); e2e for a round.

### US-09 Fill-in-the-blank collocation quiz

**As a** learner, **I want** to complete example sentences with the missing
word, **so that** I learn which words go together (collocations).

**Acceptance criteria**

1. The **Quiz** area has a **Fill the gap** mode that uses words whose
   example sentence contains the word (or a form of it such as *-s*, *-ed*,
   *-ing*).
2. The sentence is shown with the word replaced by a blank of the right
   length, plus the Vietnamese meaning as a hint.
3. The learner types the missing word; inflected forms that appear in the
   sentence are accepted.
4. After answering, the full sentence is shown and can be played aloud.
5. Words with no usable example are skipped, and the quiz says how many words
   are available.

**Tests:** unit tests for finding and blanking the word (including *-ed* /
*-ing* forms and words inside other words such as *test* in *testing*); e2e
for a round.

---

## Progress & motivation

### US-11 Daily goal and streak

**As a** learner, **I want** a daily goal and a streak counter, **so that** I
practise every day.

**Acceptance criteria**

1. I can set a daily goal in cards reviewed (10, 20, 50 or 100; default 20).
2. The header shows today's progress towards the goal and the current streak
   in days.
3. A day counts towards the streak when the goal is met. Missing a day resets
   the streak to 0; the best streak is kept.
4. Reaching the goal shows a short in-page message once per day.
5. Days use the learner's local time zone.
6. Progress and streak are saved in `localStorage` and included in exports
   from US-15 if that is done.

**Tests:** unit tests for the streak logic with fixed dates (including a
missed day and a time zone edge); e2e for the header and the goal message.

### US-12 Progress page

**As a** learner, **I want** a page that shows my progress, **so that** I can
see which topics I know and how much I practised.

**Acceptance criteria**

1. A **Progress** view shows total words, known words and percentage, overall
   and for each topic (plus *My words*).
2. It shows cards reviewed per day for the last 14 days as a simple bar chart
   drawn with HTML/CSS or inline SVG (no chart library).
3. It shows the five IPA sounds with the lowest quiz accuracy, linking to
   practise each one.
4. Each topic row has a **Study this topic** button that opens Study with that
   topic selected.
5. Empty states make sense for a new learner (no history yet).
6. Numbers and labels are readable in dark mode and on a phone.

**Tests:** e2e with seeded `localStorage` that checks the totals and the
topic link.

---

## Word management & data

### US-13 Tags for my own words

**As a** learner, **I want** to tag words I add (for example *Project X*,
*Client call*), **so that** I can study the words for one context.

**Acceptance criteria**

1. The add / edit form has a **Tags** field that accepts comma-separated tags.
2. Tags show as chips on the word in Manage words.
3. Study has a **Tag** filter listing all tags in use; it combines with the
   status and topic filters.
4. Search in Manage words also matches tags.
5. Import (JSON and CSV with a `tags` column) and export keep tags.
6. Tags are trimmed, duplicates on one word are removed, and tag text is
   escaped.

**Tests:** e2e for add/edit with tags, filter, search and import/export.

### US-14 Bulk actions in Manage words

**As a** learner, **I want** to select many words and act on them at once,
**so that** I can tidy a big deck quickly.

**Acceptance criteria**

1. Each row in Manage words has a checkbox; a header checkbox selects all
   words that match the current search.
2. A bar shows how many are selected and offers **Mark known**, **Mark
   learning** and **Delete**.
3. Delete asks for confirmation with the in-page confirm box and says how many
   words will be deleted.
4. After an action, the selection clears and a toast says what happened.
5. Bulk actions work with the keyboard.

**Tests:** e2e for select all with a search, each action, and cancel on
delete.

### US-15 Back up and restore everything

**As a** learner, **I want** one backup file with all my data, **so that** I
can move to another laptop without losing progress.

**Acceptance criteria**

1. **Back up** downloads `vocab-flashcards-backup-YYYY-MM-DD.json` with the
   deck, IPA accuracy, and any other app data (speaking progress, settings,
   streak) under a version number.
2. **Restore** accepts that file, shows what it contains (number of words and
   so on) and asks for confirmation before replacing current data.
3. An invalid or unrelated file shows a clear error and changes nothing.
4. After restore, all tabs show the restored data without a reload.
5. The existing deck-only JSON export and import keep working.

**Tests:** e2e for a round trip (back up, reset, restore) and for an invalid
file.

### US-18 Export deck as CSV

**As a** learner, **I want** to export my deck as CSV, **so that** I can open
it in Excel or Google Sheets.

**Acceptance criteria**

1. Next to **Export** there is **Export CSV**, which downloads
   `vocabulary.csv`.
2. The file has a header row: `word,pronunciation,meaning,vietnamese,example,topic,known`.
3. Values with commas, quotes or line breaks are quoted correctly (RFC 4180),
   and Vietnamese characters survive when opened in Excel (UTF-8 with BOM).
4. Importing the exported CSV gives back the same words (round trip).

**Tests:** unit or e2e test for quoting and the round trip.

---

## Look, feel & delivery

### US-02 Light / dark / system theme choice

**As a** learner, **I want** to choose light or dark mode myself, **so that**
the app is comfortable whatever my system setting is.

**Acceptance criteria**

1. A theme control in the header offers **System** (default), **Light** and
   **Dark**.
2. The choice applies immediately on every tab and is saved in
   `localStorage`.
3. **System** follows the operating system and updates if the system setting
   changes while the app is open.
4. There is no flash of the wrong theme when the page loads.
5. The control has an accessible name and shows the current choice.

**Tests:** e2e with `colorScheme` emulation for each choice and persistence
after reload.

### US-16 Accessibility pass with automated check

**As a** learner who uses the keyboard or a screen reader, **I want** every
part of the app to be usable, **so that** nobody is left out.

**Acceptance criteria**

1. Tabs follow the ARIA tabs pattern (`aria-selected`, arrow keys between
   tabs, `tabpanel` with a label).
2. Every button and field has an accessible name; icon buttons such as 🔊 have
   a text label.
3. Focus is always visible and is moved sensibly when views, dialogs or quiz
   questions change.
4. Text and controls meet WCAG AA contrast in light and dark mode.
5. A browser test runs an automated accessibility check (for example
   `@axe-core/playwright`, agreed with the mentor as a dev dependency) on each
   tab with no serious or critical violations.
6. Findings that cannot be fixed now are listed as new issues.

### US-17 Install and use offline

**As a** learner, **I want** to install the app and use it without internet,
**so that** I can practise on the go.

**Acceptance criteria**

1. The live site has a web app manifest (name, icons, theme colour) so Chrome
   and Edge offer **Install**.
2. A service worker caches the app files so it opens and works offline after
   the first visit.
3. When a new version is deployed, the app shows "A new version is available"
   with a **Reload** button instead of silently using old files.
4. Opening `index.html` from disk still works (the service worker is only
   registered over `http(s)`).
5. Lighthouse reports the app as installable.

**Notes:** Netlify serves the `vocab-flashcards` folder. Think about cache
versioning before you start, and describe your approach in the PR.

**Tests:** e2e that checks the manifest and that registration is skipped on
`file://`; manual offline check documented in the PR.
