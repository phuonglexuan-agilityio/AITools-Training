# The assertion a test should make (BA/QA describe it; a developer writes the code)

Bug: after "Skip month", My Subscription still shows the old next delivery date
([bug-report.md](bug-report.md)).

## One-sentence assertion

After a customer skips a month and reopens My Subscription, the displayed next delivery date is
the new date, and it matches the date stored for the subscription.

## As Given / When / Then

- **Given** a customer has an active monthly subscription with next delivery date **A**,
- **when** they tap "Skip month" and then reopen My Subscription,
- **then** the page shows date **A + 1 month** (rule to be confirmed with the client),
  **and** it does not show A.

## What the test must check (list for the developer)

1. The date shown on the page equals A + 1 month.
2. The date shown on the page equals the date saved for the subscription (read from the order or
   admin data, not from the page).
3. The check is repeated after a full page reload, so a cached page cannot pass by accident.
4. Run on a phone-size screen as well as desktop (the bug was reported on phone).

## Related negative cases (for the test matrix on Day 6)

- Skip a second time when already skipped: expect a clear message and no double skip.
- Skip on the delivery day: expect the rule agreed with the client.

## Pairing note

Day 2 asks you to pair with a developer to watch the test being written. Not done here.

- [ ] Pair with a developer and see this assertion turned into a failing test.
