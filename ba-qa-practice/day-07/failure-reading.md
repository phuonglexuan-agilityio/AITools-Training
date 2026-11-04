# Reading a failure, and repairing the test

Exercise: break one test on purpose, read the failure like a QA, decide whose fault it is,
repair it. Done in a throwaway copy, never on the repo's own tests.

## The breakage

In a scratch copy of `tests/e2e/manage.spec.js` I used find-and-replace to change
`toHaveCount(6)` to `toHaveCount(5)`, pretending the sample deck "should have five words".

Output: [evidence/e2e-broken-failure.txt](evidence/e2e-broken-failure.txt). Reading it in order:

| Part of the output | What it told me |
| --- | --- |
| `Expected: 5  Received: 6` | The page has 6 rows; the test wanted 5 |
| `14 × locator resolved to 6 elements` | Playwright retried for 5 seconds, so it is not a timing problem; the number is stable |
| The code frame with `>` on line 21 | The exact assertion that failed |
| 7 tests failed, not 1 | The same wrong number was used in several tests, so one bad edit broke many |

## Whose fault is it?

Rule I will use: **compare the test with the requirement, not with the app.**
- The sample deck is defined as 6 words (see the first test, and the app's sample data).
  The requirement did not change, so the test was wrong and the app was right: fix the test.
- If the requirement *had* changed to 5 words, the app would be wrong. Then the test is right
  and the fix goes in the app.
- Never loosen an assertion (for example delete the check or add a longer wait) just to get green.

## The repair, and a mistake of mine

First repair: I replaced every `toHaveCount(5)` back to `toHaveCount(6)`. That left **one** test
failing ([evidence/e2e-repaired.txt](evidence/e2e-repaired.txt), first block: 1 failed, 21 passed):
"deletes a word after confirming", which legitimately expects 5 rows after deleting one word.
A blind replace changed a correct number. Second repair: restored the original file and
re-ran: 22 passed (second block of the same file).

Lesson: repair a test by looking at the one failing assertion, not with a global replace.

## Try it yourself (your machine)

1. `cd vocab-flashcards && npm ci`
2. Change one number in `tests/e2e/manage.spec.js` and run `npx playwright test tests/e2e/manage.spec.js`
3. Read the output top to bottom using the table above, then `git checkout` the file.
