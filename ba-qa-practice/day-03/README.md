# Day 03: Fix, review, merge (Checkpoint 1)

**Role:** BA/QA · **Client (fictional):** Sunrise Coffee Co.

## Goal

Follow a fix through a pull request (PR): spec it, describe it, review someone else's PR, merge.
BA/QA **spec the fix and co-sign** a developer's version instead of writing the code.

## Checklist

- [x] Spec the fix for the Day-2 bug ([fix-spec.md](fix-spec.md))
- [ ] Co-sign a developer's fix (no fix exists yet; the co-sign checklist in `fix-spec.md` is ready)
- [x] Write the PR description: what / why / how tested / screenshots ([pr-description-draft.md](pr-description-draft.md), a template for the developer's PR)
- [x] Peer swap: ask "could I implement or review this from the description alone?" (answered in [peer-pr-review.md](peer-pr-review.md))
- [x] Review a PR with at least 3 actionable comments, in checklist order ([peer-pr-review.md](peer-pr-review.md), 8 comments, **not posted on GitHub**)
- [x] PRs opened and merged: #40, #41, #42 (squash merge)
- [ ] Resolve a **seeded conflict on a real PR** (a conflict was resolved in a throwaway repo on Day 2)
- [ ] Delete the merged branches (`ba-qa/day-01`, `ba-qa/day-01-done`, `ba-qa/day-02`): ask before doing this
- [ ] Start the course "Real-World AI for Everyone" on Coursera (yours to do)

## Files

| File | What it is |
| --- | --- |
| [fix-spec.md](fix-spec.md) | Behaviour required after the fix, acceptance criteria, open questions and a co-sign checklist |
| [pr-description-draft.md](pr-description-draft.md) | PR description template for the developer's fix, with a self-check |
| [peer-pr-review.md](peer-pr-review.md) | Review of the Vocab Flashcards PR #1 and its code: 8 comments by checklist |

## Checkpoint 1 (pass to continue)

Criteria from the [Day 3 page](https://dojo.agilityio.dev/schedule/day-03.html). Status is
**honest**: a box is ticked only if the evidence exists.

| # | Criterion | Status | Evidence / what is missing |
| --- | --- | --- | --- |
| 1 | Reproduce an assigned bug and write the repro in the ticket | Partly | Repro steps written in [bug-report.md](../day-02/bug-report.md). **Not reproduced on a running app**, and not put in a real ticket. |
| 2 | Fix on a branch with a test (BA/QA: spec the fix and co-sign a developer's) | Partly | Fix spec written. **Co-sign missing:** needs a developer's fix. |
| 3 | PR with a self-contained description | Yes | [PR #42](https://github.com/phuonglexuan-agilityio/AITools-Training/pull/42) has what / why / what is not done. Missing a "how to check" line (noted in the review). |
| 4 | One peer review with 3 actionable comments; one merge with a conflict resolved | Partly | 8-comment review written (not posted). Merges done (#40-#42). **Conflict was resolved only in a throwaway repo**, not on a real PR. |

**Checkpoint 1 is not passed yet.** The schedule says: anyone who fails repeats the failed
exercise as paired homework during Days 4 to 5.

To finish it:
1. Get a developer's fix for the Day-2 bug and co-sign it with the checklist in `fix-spec.md`.
2. Ask the lead for a seeded conflict on a real PR and resolve it.
3. Post the review comments on a teammate's open PR.

## Skill practiced today

**Review checklist (by hand):** correctness, tests, readability, security basics, scope. The team
turns this into an installable skill from Day 7.

## Done when

All four Checkpoint 1 rows say "Yes".
