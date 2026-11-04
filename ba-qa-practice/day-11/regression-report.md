# Regression report: Vocab Flashcards (main + Days 6-10 branch)

Run date 2026-11-04, Chromium, fresh browser state per test.

| Suite | Where | Result |
| --- | --- | --- |
| Unit (node --test) | local | 16 / 16 pass |
| Browser, existing suite | local | 66 / 66 pass (before adding the new spec) |
| Browser, with the new spec | local | 70 pass in total; 2 are expected failures (BUG-1, BUG-2) |
| Browser, with the new spec | GitHub Actions | first run: 1 fail (seeded, explained in day-10); fixed run: success ([run 41803755933](https://github.com/phuonglexuan-agilityio/AITools-Training/actions/runs/41803755933)) |

## What was checked and what was not

| Area | Covered by | Gap |
| --- | --- | --- |
| Study, flip, shuffle, progress | existing tests | none found |
| IPA practice | existing tests | none found |
| Manage: add, edit, delete, reset | existing tests | edit-to-duplicate (BUG-2) |
| Import | existing + new IMP tests | duplicates within a file (BUG-1), CSV comma rule undefined |
| Other browsers, phone-size layouts | not run | only Chromium |

## Exploratory notes

- The page logged no JavaScript errors during any probe.
- The CSV import splits on every comma. Whether that matches the intended format is a question for the app owner (matrix row IMP-4).

## Risk summary for the owner

Two medium bugs with a simple fix; no existing behaviour was found broken. Not tested:
other browsers, very large imports.
