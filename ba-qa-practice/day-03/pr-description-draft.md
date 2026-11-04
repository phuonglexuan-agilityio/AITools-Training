# PR description draft: fix for "next delivery date not updated after skip"

Exercise: write the PR description (what / why / how tested / screenshots), draft with Claude,
edit by hand, and open the PR against the training repo.

**This is a template for a developer's PR, not a real one.** No fix has been written, so every
`[ ... ]` below must be filled in with facts from the real change. Nothing here claims that a
test has passed.

---

```markdown
Closes #[ticket number]

## What changed
After a customer skips a month, My Subscription now shows the new next delivery date straight
away and after reopening the page. [One line on the code change, from the developer.]

## Why
Customers who skipped saw the old delivery date and thought the skip had not worked. [Link to
the bug report: ba-qa-practice/day-02/bug-report.md]

## How I tested it
- [ ] The new test fails without the fix and passes with it: `[command]`
- [ ] Skip, then reload: date is A + 1 month
- [ ] Skip, then close and reopen: date is A + 1 month
- [ ] Checked on a phone-size window and on desktop
- [ ] Skip failure case: error message shown, date unchanged

## Screenshots
| Before | After |
| --- | --- |
| [screenshot: old date after skip] | [screenshot: new date after skip] |

## Notes for the reviewer
- Cause of the bug: [found by the developer; not known when the ticket was written]
- Out of scope: grind type, gift subscriptions
```

---

## Self-check: could a reviewer review this from the description alone?

- [ ] They know **what** changed (one sentence), without opening the code
- [ ] They know **why** (the customer problem and the ticket)
- [ ] They know **how to check it** (steps and the test command)
- [ ] They can **see** the result (before and after screenshots)

## Note on the repo's own template

This repo's `.github/pull_request_template.md` already has "What changed", "How I tested it", a
Definition of Done and "Screenshots". That template is written for the Vocab Flashcards app
(for example `npm test`, dark mode). The headings above follow the same shape, with the
checks changed to fit this bug.
