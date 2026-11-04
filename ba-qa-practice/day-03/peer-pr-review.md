# Peer PR review: Vocab Flashcards (PR #1 and its code on `main`)

Exercise: review a peer's PR with at least 3 actionable comments, using the checklist order:
**correctness, tests, readability, security basics, scope.**

**What I reviewed:** the description and file list of
[PR #1](https://github.com/phuonglexuan-agilityio/AITools-Training/pull/1) (17 files, +2086), and
the current code of that app on `main` (`vocab-flashcards/app.js` and
`.github/workflows/vocab-flashcards-tests.yml`).

**Honest limits:**
- `app.js` on `main` is longer than the version in PR #1 (513 lines vs 382 added), so line numbers
  below refer to **today's `main`**, not the original diff.
- I read the code; I did **not** run the app or the tests. Each finding below comes from reading
  and needs a quick check by running it.
- These comments are written here only. I did **not** post them on GitHub.

Severity: **Must** = fix before relying on it, **Should** = worth fixing, **Nit** = optional.

---

## 1. Correctness

**C1 (Must): importing a file can add the same word twice.**
`app.js:424-426`: the set of existing words is built once, then `fresh` is filtered against it.
Words that repeat *inside the imported file* are all kept, because the set is never updated. The
toast then says "Imported N" with no warning.
- Suggested fix: add each accepted word to the set while filtering (or de-duplicate `incoming`
  first), and count those as skipped duplicates.
- Check: import a file with two lines `apple,quả táo` and see if two cards appear.

**C2 (Should): editing a word can create a duplicate, adding cannot.**
`app.js:362-365` (edit path) updates the word without a duplicate check, while the add path at
`app.js:367-368` asks "already exists, add anyway?". Rename "cat" to "dog" when "dog" exists and
you silently get two.
- Suggested fix: run the same duplicate check on edit, ignoring the word being edited.

**C3 (Should): CSV import breaks on quoted commas.**
`app.js:402`: lines are split on every comma. A row such as `"hello, world",lời chào` becomes
three columns. Without a header the code joins the rest back with `', '`, but with a header
(`word,meaning,vi,example`) the columns shift.
- Suggested fix: handle quoted fields, or say clearly in the README and the import help text that
  commas inside a field are not supported.

## 2. Tests

**C4 (Should): the import and normalise logic has no unit tests.**
The only unit test file is `tests/unit/ipa-data.test.js`. `parseImport` and `normalize` live
inside the big function in `app.js` (an IIFE), so they cannot be imported by a unit test, and
the three problems above (C1-C3) would not be caught by the current tests.
- Suggested fix: move `parseImport` and `normalize` into a small module, add unit tests for:
  duplicate rows in one file, quoted commas, a header row, and an empty file.

## 3. Readability and behaviour

**C5 (Nit): "Shuffle" only turns on; adding or deleting a word re-shuffles everything.**
`app.js:469-474` sets `shuffled = true` and nothing sets it back except "Reset".
`buildOrder` (`app.js:142-149`) shuffles whenever `shuffled` is true, and it is called after every
add, delete or import, so the card order jumps in the middle of a study session.
- Suggested fix: make the button a toggle, and keep the existing order when words are added or
  removed.

## 4. Security basics

**Good:** every word is shown with `textContent` (no `innerHTML`), imported fields are turned into
trimmed strings by `normalize`, and storage errors are caught. This avoids the usual script
injection from imported files.

**C6 (Should): the CI workflow has no `permissions:` block.**
`.github/workflows/vocab-flashcards-tests.yml` runs with the default token permissions. Tests only
need to read the repo.
- Suggested fix: add `permissions: contents: read` at the top of the workflow.

**C7 (Nit): actions are pinned by version tag (`@v4`), not by commit.**
Pinning to a commit is stricter, but a tag is acceptable for a training repo. Optional.

## 5. Scope

**C8 (Suggestion): PR #1 is large and mixes three features and CI.**
The Study tab, the IPA practice tab, the Manage tab and the CI pipeline arrived together (17
files, +2086 lines). Smaller PRs would be easier to review and to undo.
- Suggested for next time: one PR per tab, CI in its own PR.

---

## Could I review it from the description alone? (the peer-swap question)

PR #1's description is clear about **what** was added, but I could **not** review it from the text
alone:
- there is no **why** (what problem it solves) and no issue link,
- there is no **how it was tested** (it says a test suite exists, not how to run it or what was
  checked by hand),
- there are no **screenshots** for a UI-heavy change.

The repo's own PR template (`.github/pull_request_template.md`) already asks for these. Using it
would have fixed this.

Same test on my own [PR #42](https://github.com/phuonglexuan-agilityio/AITools-Training/pull/42):
the "What / Why / Not done" parts are fine, but it has no "how to check it" line.

## Result

- [x] 3 or more actionable comments (8 comments: 3 Must/Should correctness, 1 tests, 1 nit, 2 security, 1 scope)
- [x] Checklist order followed
- [ ] Comments posted on a real, open PR with the author (needs a live PR from a teammate)
- [ ] Each finding confirmed by running the app
