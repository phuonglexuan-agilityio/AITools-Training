# Day 02: Ticket analysis, reproduce and understand

**Role:** BA/QA · **Client (fictional):** Sunrise Coffee Co.

## Goal

Analyse tickets, and write a bug report a developer can reproduce without asking you anything.

## Checklist

- [x] Analyse 5 tickets: three sentences each (asks, ambiguous, first step)
- [x] Use Claude to find gaps and draft clarifying questions
- [x] Write the questions you would ask the reporter
- [ ] Role-play reporter and developer with a partner (a simulated version is included; do the real one)
- [x] Rewrite the seeded bug in the reproduce-ready template (unknowns flagged, nothing invented)
- [ ] Reproduce the bug on a running app (needs the training app, not done here)
- [x] Describe the assertion a test should make for the bug
- [ ] Pair with a developer to see that assertion written as a failing test
- [x] Git block: `pull --rebase`, read `git log` / `git diff`, resolve conflict #1 (in a throwaway repo)
- [ ] Repeat the git block on the real training repo with the lead's seeded conflict
- [x] Course: Claude 101 finished (see Day 01 badge)

## Files

| File | What it is |
| --- | --- |
| [tickets-analysis.md](tickets-analysis.md) | 5 tickets, three-sentence analysis and questions for each |
| [reporter-role-play.md](reporter-role-play.md) | Questions to the reporter, with a **simulated** answer exchange |
| [bug-report.md](bug-report.md) | Reproduce-ready bug report, open questions and hypotheses to verify |
| [test-assertion.md](test-assertion.md) | The assertion a test should make, in Given/When/Then |
| [git-block.md](git-block.md) | Explanation of the git commands and how the conflict was resolved |
| [evidence/git-conflict-transcript.txt](evidence/git-conflict-transcript.txt) | Real command output of the conflict and its resolution |

## Honest status

Drafts were written by Claude. The unchecked boxes need a running app, a partner or a developer,
which Claude does not have here. Hypotheses in the bug report are **not verified**.

## Skill practiced today

**Reproduce-ready bug reports:** steps to reproduce, expected vs actual, environment. Developers
should never need to ask for more.

## Done when

The bug report has numbered steps, expected vs actual and an environment line, and every unknown
is flagged as a question rather than guessed. See [bug-report.md](bug-report.md).
