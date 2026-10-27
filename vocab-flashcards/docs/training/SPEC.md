# Vocab Flashcards: product spec for the mentee programme

This spec describes the Vocab Flashcards app as it is today and the features
mentees will add to it. It is the source for the user stories in
[USER-STORIES.md](USER-STORIES.md) and for the issues on the GitHub Project.

- Live app: <https://vocalfashcard.netlify.app>
- Code: [`vocab-flashcards/`](../../) (see the [README](../../README.md) for how
  to run it and how the code fits together)
- Owner and reviewer: TP

## 1. Purpose

Vocab Flashcards helps Vietnamese-speaking people who work on software and AI
projects speak English with more confidence at work: in meetings, client calls
and demos. It focuses on three things:

1. **Vocabulary** for business analysis, software, testing, data and AI, with
   English and Vietnamese meanings.
2. **Pronunciation** with General American IPA, audio and sound-by-sound
   practice.
3. **Speaking** whole work phrases with the right stress, pauses and
   intonation.

For mentees, the app is also a real, small codebase to practise the full
delivery loop on: read a user story, clarify it, build it, test it, open a
pull request, respond to review, and ship it to the live site.

## 2. Users

| Persona | Who they are | What they need |
| --- | --- | --- |
| **Learner** | A BA, QA or developer whose first language is Vietnamese. Practises about an hour a day on a laptop, sometimes on a phone. | Learn work words, say them correctly, and rehearse phrases for meetings and demos. See progress so they keep going. |
| **Mentee** | A trainee who builds features for the app. | Clear stories with acceptance criteria, a working test setup, and fast review. |
| **Mentor (TP)** | Owns the product and reviews every PR. | A backlog to assign, a definition of done to review against, and a live site that stays working. |

## 3. Constraints (apply to every story)

These come from the README's Contributing section and are part of every
story's definition of done.

- **No framework, no build step, no backend.** Plain HTML, CSS and JavaScript
  that works by opening `index.html` from disk and on Netlify.
- **No runtime dependencies.** Dev dependencies for tests are allowed after
  agreement with the mentor.
- **Data stays in the browser** (`localStorage`). Nothing is sent to a server.
  New storage keys use the `vocab-flashcards.<name>.v1` pattern and are listed
  in the README's storage table.
- **Code style:** each script is an IIFE with `'use strict'`, `const`/`let`,
  small named functions, and short comments that explain *why*.
- **Safety:** escape any user-provided text before inserting it into the page.
  Use the in-page confirm box (`window.askConfirm`), never `confirm()` or
  `alert()`.
- **Works on** current Chrome, Edge and Safari, on a laptop and on a 375px-wide
  phone, in light and dark mode.
- **Accessible:** every control can be reached and used with the keyboard and
  has a visible focus style and an accessible name.

## 4. Current features (baseline)

What is already in `main` on 2026-10-27. Mentees should not break any of it;
the existing tests guard most of it.

| Area | Feature | Notes |
| --- | --- | --- |
| Study | Flip cards, previous/next, mark *Still learning* / *I know it*, filter by status, shuffle, progress bar | Keys: Space, ← →, 1, 2 |
| Study | Choose the card front: word, English meaning or Vietnamese meaning | |
| Study | IPA and 🔊 audio on the word's face | Key: S |
| Study | Built-in 500-word list (BA, Agile, software, testing, data & cloud, AI/ML, Claude & AI assistants) with American IPA, and a **Topic** filter | `wordlists-data.js` |
| IPA practice | Sound chart, flashcards and quiz for the 44 sounds, accuracy per sound | Still **British (RP)**; see US-06 |
| Manage words | Add, edit, delete, search (with or without Vietnamese accents) | |
| Manage words | Import JSON / CSV / TSV, export JSON, reset to sample deck | Duplicates skipped |
| General | Saved in `localStorage`, responsive layout, automatic dark mode, in-page confirm box | |
| Quality | Unit tests (Node test runner) and browser tests (Playwright), CI on every PR, Netlify deploy previews | |

**In review (PR #11, not merged yet):** a **Speaking** tab with 72 work
phrases (meetings, client calls, demos), stress / pause / tone markup, slow
and normal playback, shadowing, recording and compare. It also switches
`speech.js` to an American voice. Stories that build on it are marked
*depends on PR #11*.

## 5. Functional requirements for new work

Each requirement maps to one or more user stories (US-xx).

### FR-1 Study and memory

- FR-1.1 The app schedules reviews with spaced repetition, so words the
  learner gets wrong come back sooner than words they know. (US-03)
- FR-1.2 After a study session the learner sees a summary of what they did.
  (US-04)
- FR-1.3 The learner can see every keyboard shortcut from inside the app.
  (US-01)

### FR-2 Pronunciation and audio

- FR-2.1 The learner can choose the speech voice and speed, and the choice is
  remembered. (US-05)
- FR-2.2 The IPA trainer uses General American, matching the rest of the
  app. (US-06)
- FR-2.3 The learner can say a word or phrase into the microphone and get
  feedback on whether it was recognised. (US-10)

### FR-3 Practice and quizzes

- FR-3.1 Listen-and-type (dictation) quiz on deck words. (US-07)
- FR-3.2 Multiple-choice meaning quiz on deck words. (US-08)
- FR-3.3 Fill-in-the-blank quiz using the example sentences, to practise
  collocations. (US-09)

### FR-4 Progress and motivation

- FR-4.1 Daily goal and streak. (US-11)
- FR-4.2 Progress page with totals per topic and per day. (US-12)

### FR-5 Word management and data

- FR-5.1 Learners can tag their own words and filter by tag. (US-13)
- FR-5.2 Bulk actions on many words at once. (US-14)
- FR-5.3 Export the deck as CSV. (US-18)
- FR-5.4 Back up and restore all app data in one file. (US-15)

### FR-6 Look, feel and delivery

- FR-6.1 Manual theme choice: light, dark or follow the system. (US-02)
- FR-6.2 The app meets WCAG 2.2 AA for keyboard use, focus, names and
  contrast, checked by an automated test. (US-16)
- FR-6.3 The app can be installed and used offline from the live site.
  (US-17)

## 6. Non-functional requirements

| ID | Requirement | How it is checked |
| --- | --- | --- |
| NFR-1 | First load of the live site is under 2 s on a normal laptop connection; no request to any third-party server. | Lighthouse in Chrome DevTools; Network tab |
| NFR-2 | Every interaction responds in under 100 ms with the 500-word deck plus 500 own words. | Manual check with a 1,000-word import |
| NFR-3 | Data written by an older version still loads after an update (no lost decks). New fields get defaults. | Unit or e2e test that loads old-shaped data |
| NFR-4 | No page errors, console errors or native dialogs. | Existing e2e fixture fails on these |
| NFR-5 | Layout works from 375px to 1440px wide, light and dark. | Playwright phone-size test, manual check |
| NFR-6 | Accessibility: WCAG 2.2 AA on keyboard, focus, names, contrast. | US-16 adds an automated check |

## 7. Definition of Ready (before a mentee starts a story)

- The story has a user story sentence, acceptance criteria and a size.
- Open questions are answered in the issue, or the mentee has asked them.
- Dependencies (for example PR #11) are merged, or the story says how to
  work without them.

## 8. Definition of Done (before the mentor merges)

1. Every acceptance criterion is met and was checked in a Netlify deploy
   preview.
2. Unit and/or browser tests cover the new behaviour; `npm test` passes and
   CI is green.
3. The constraints in section 3 hold (no build step, no dependencies, escaped
   text, in-page confirm, keyboard and phone layout, dark mode).
4. The README is updated for any new feature, shortcut, storage key or data
   format.
5. The PR links its issue (`Closes #N`), describes what changed and how it was
   tested, and has at least one approval from the mentor.

## 9. Ways of working for mentees

1. Pick or get assigned an issue on the Project board; move it to
   **In progress**.
2. Branch from `main` as `<your-name>/<issue-number>-short-name`, for example
   `lan/7-dictation-quiz`.
3. Commit in small steps. Open a draft PR early so the mentor can see the
   direction.
4. Use the Netlify deploy preview link on the PR to test like a user.
5. Mark the PR ready for review, then move the card to **In review**.
6. After merge the card moves to **Done** and the change is live.

### Suggested order

| Sprint | Stories | Why |
| --- | --- | --- |
| 0 | US-00 | Set up, learn the codebase and the PR flow |
| 1 (starter) | US-01, US-02, US-18, US-04 | Small, self-contained, one file or two |
| 2 (core) | US-05, US-08, US-07, US-13, US-15, US-11 | New UI and storage, more tests |
| 3 (stretch) | US-03, US-06, US-09, US-12, US-14, US-16 | Algorithms, data work, quality |
| 4 (advanced) | US-10, US-17 | Browser APIs with patchy support |

### Setting up the Project board (mentor, once)

1. On GitHub, open your profile → **Projects** → **New project** → **Board**,
   and name it, for example, *Vocab Flashcards mentoring*.
2. In the project, open **⋯ → Workflows** and turn on *Auto-add to project*
   for the repo `AITools-Training` with the filter `is:issue is:open`. That
   adds issues #14 to #39 and every new one. (Or paste
   `repo:phuonglexuan-agilityio/AITools-Training is:issue` into the bottom
   row's search box and select all.)
3. Columns: **Todo**, **In progress**, **In review**, **Done**. The default
   workflows move items to Done when an issue closes or a PR merges.
4. Add fields: **Size** (single select S / M / L), **Sprint** (iteration) and
   keep **Parent issue** visible to group by epic.
5. Invite mentees: repo **Settings → Collaborators → Add people** (so they can
   be assigned and push branches), then in the project **⋯ → Settings →
   Manage access** give them *Write*.
6. Assign each mentee their own US-00 first, then one starter story.

## 10. Out of scope

- User accounts, sign-in, or syncing between devices through a server.
- Paid or third-party APIs (including cloud speech services).
- Rewriting the app in a framework or adding a bundler.
- Other languages than English (with Vietnamese meanings).
