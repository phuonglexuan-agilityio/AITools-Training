# Ticket pack: stop duplicate words from import and edit

Written to be implementable in about 90 minutes by a developer who has not seen BUG-1 and BUG-2.
Sizes and times are guesses. Stand-in client: the app owner.

**User story:** **As a** learner, **I want** the deck to never hold the same word twice by accident,
**so that** my progress for a word is tracked in one place.

## Acceptance criteria

1. **Given** a file with the same word twice (any letter case), **when** I import it, **then** the
   first copy is added, the rest are skipped, and the toast counts them as skipped duplicates.
2. **Given** a file word that is already in my deck, **when** I import it, **then** it is skipped
   (this already works; keep it working).
3. **Given** I edit word A and change its spelling to word B that already exists, **when** I save,
   **then** the in-page confirm box asks first, the same as when adding.
4. **Given** that confirm box, **when** I choose Cancel, **then** word A keeps its old spelling and
   the deck is unchanged.
5. **Given** I edit a word and only change the meaning, **when** I save, **then** no question is
   asked.

## Scope

- **In:** `importWords` and the edit branch of `onSubmit` in `app.js`.
- **Out:** the CSV comma question (IMP-4), merging two words into one, case-insensitivity rules
  beyond what Add already uses.

## Open questions

| # | Question | Owner | Proposed default |
| --- | --- | --- | --- |
| Q1 | After "OK" on the edit confirm, keep both words or merge? | App owner | Keep both (same as Add) |
| Q2 | CSV format for meanings with commas | App owner | Out of scope here; separate ticket |

## Tests

The four tests in `tests/e2e/import-and-edit-duplicates.spec.js`. Remove the two `test.fail()`
markers when the fix lands (Playwright will fail the run until you do, on purpose). Size (guess): S.
