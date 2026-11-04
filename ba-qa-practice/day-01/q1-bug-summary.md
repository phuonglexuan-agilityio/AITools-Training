# Q1: Bug summary

## Prompt (version 1, basic)

```
Summarize this bug report.

"Skip month" works, but when I skip and then reopen My Subscription, the next delivery
date still shows the old date. Happens on my phone. Not sure about desktop.
```

## Prompt (version 2, improved)

```
Summarize this bug report in 3 bullets for a developer: "Skip month" works, but when I skip
and then reopen My Subscription, the next delivery date still shows the old date. Happens on
my phone. Not sure about desktop. Then list what information is missing.
```

## Answer used (from version 2)

**Summary for a developer**

- **Symptom:** after a customer skips a month, the My Subscription page still shows the old
  next-delivery date when reopened.
- **Where seen:** on a phone. Not confirmed on desktop.
- **Likely area to look at (hypothesis, not verified):** the skip is saved, but the page
  reads a stale or cached date. Needs reproduction before anyone trusts this.

**Missing information (questions for the reporter)**

1. Which phone, OS and browser or app version?
2. Exact steps: how did you reach My Subscription, and how did you reopen it?
3. Is the skip really applied (check the order, email or admin)? Or only the display wrong?
4. Does it also happen on desktop?
5. Does a full refresh or logging out and in fix the date?
6. Which account type and which plan?
7. Screenshot or screen recording of before and after.

## To edit by hand (Day 1 habit: Claude writes the first draft, you write the last)

- [x] Keep the three bullets and the question list, or reword them in your own style.
- [x] Keep the third bullet marked as a guess: the report gives no evidence of the cause.
- [x] Add your own note on what surprised you.
