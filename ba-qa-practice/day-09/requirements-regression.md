# BA view: requirements regression

Question: if the duplicate fix from the Day 6 ticket pack is built, which existing behaviour
could it break? Read from the existing e2e suite titles, not from running new code.

| Existing behaviour (existing test) | Risk from the fix | Check |
| --- | --- | --- |
| "asks before adding a duplicate and respects Cancel" | Shared duplicate helper could change the Add prompt | Re-run `manage.spec.js` |
| "edits a word" | New confirm on edit could appear when only the meaning changes | Criterion 5 in the pack; test EDT-1 |
| Import tests (JSON/CSV) | Stricter skipping could drop legitimate rows | Keep IMP-1; add a case with different words |
| "adds only the missing words" (built-in word list) | Same duplicate rule used there | Re-run `wordlist.spec.js` |

Verdict: the ticket pack should name `manage.spec.js` and `wordlist.spec.js` as the regression set. Added as a to-do for the developer.
