# CI triage

**Run:** [Vocab Flashcards tests, run 41803491830](https://github.com/phuonglexuan-agilityio/AITools-Training/actions/runs/41803491830) on branch `ba-qa/days-09-11`
**Result:** failed at step "Browser tests". 69 passed, 1 failed. Log excerpt: [evidence/ci-failure-excerpt.txt](evidence/ci-failure-excerpt.txt).

## The failure

Test `EDT-2 editing a word into an existing word asks first [BUG-2]`:
`Expected: visible, Received: hidden` for the in-page confirm box, after 9 retries over 5 seconds.

## The three questions

| Question | Answer | Evidence |
| --- | --- | --- |
| Regression (something that used to work broke)? | **No.** The behaviour never worked: BUG-2 was confirmed on Day 6, before this test existed | Day 6 bug report |
| Flaky (passes sometimes)? | **No.** The same test fails on my machine every time and the retries showed a stable "hidden" | local run, CI log |
| Environment (CI differs from local)? | **No.** Local and CI agree, apart from the CI-only warnings about Node 20 and Ubuntu | CI annotations |

## Root cause (one sentence)

The test asserts the correct behaviour for a bug that is still open, and I pushed it without the
`test.fail()` marker that its sibling IMP-2 has, so the suite correctly reported the known bug.

Verdict: **test-commit mistake, not an app regression.** Note that IMP-2 (also a known bug) shows
as ✘ in the log but did not fail the run, because its `test.fail()` marker makes the expected
failure count as a pass. A reader scanning for ✘ would be misled; the summary line
("1 failed") is the number to trust.

## Fix

Restore the marker on EDT-2 (commit "Day 10: mark EDT-2 as a known bug"). After the push, the
run for that commit is recorded below.

## Result of the fix

[Run 41803755933](https://github.com/phuonglexuan-agilityio/AITools-Training/actions/runs/41803755933): **success** after restoring the marker.

## Warnings seen in the same run (not failures)

- GitHub notes Node 20 actions are forced to Node 24.
- `ubuntu-latest` migrates to Ubuntu 26 on 2026-10-19 (per the annotation). Worth a ticket if a
  future run behaves differently; no action taken.
