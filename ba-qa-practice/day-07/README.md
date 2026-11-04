# Day 07: QA in the Code tab

**Role:** BA/QA · **App under test:** Vocab Flashcards

## Goal

Run the existing test suite, read a failure properly, and repair a broken test without hiding
the problem.

## Checklist

- [x] Ran the unit tests: 16 pass ([evidence/unit-run.txt](evidence/unit-run.txt))
- [x] Ran the full browser (Playwright) suite: 66 pass ([evidence/e2e-run-baseline.txt](evidence/e2e-run-baseline.txt))
- [x] Broke one test on purpose in a scratch copy, read the failure, repaired it ([failure-reading.md](failure-reading.md))
- [x] Wrote down the rule for "fix the test or fix the app?"
- [ ] Repeat the exercise yourself on your own machine (yours to do; the steps are in the file below)

## How the suite was run here

`npm ci` cannot reach the npm registry from this sandbox, but Playwright and Chromium are
already installed globally, so the suite ran with a one-line shim that points `@playwright/test`
at the global copy. No project files were changed for this. On your machine, plain
`npm ci && npm run test:e2e` in `vocab-flashcards/` does the same job (CI does exactly that).

## Honest status

Done on your instruction. All run output in `evidence/` is real output from 2026-11-04.
