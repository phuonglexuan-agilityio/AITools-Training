# Day 13: Capstone, build

## What changed in the app (`vocab-flashcards/app.js`)

1. **Import:** the "existing words" set is now updated while filtering, so the same word twice in
   one file is added once (BUG-1).
2. **Edit:** saving an edit that makes the word equal to a different existing word now asks
   "Save anyway?" first; Cancel keeps the old spelling (BUG-2). Editing only the meaning does not
   ask, because the word is compared to *other* words only.

Together about 10 lines. Written by Claude from the ticket pack; reviewed in the PR.

## Checklist

- [x] Implemented the two changes
- [x] Removed the two `test.fail()` markers; all tests pass locally (74 pass, 16 unit pass)
- [ ] A human reads the diff in the PR (yours)

## Honest status

Done on your instruction. The code change is small and lives in the PR, not in this folder.
