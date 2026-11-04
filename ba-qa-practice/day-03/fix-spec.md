# Spec for the fix: next delivery date after "Skip month"

Role: BA/QA do not write the code. We **spec the fix** and **co-sign** a developer's version.
Bug: [../day-02/bug-report.md](../day-02/bug-report.md). Assertion:
[../day-02/test-assertion.md](../day-02/test-assertion.md).

**Status of this spec:** draft. The cause of the bug is **not known** (hypotheses only), so this
spec describes the behaviour that must be true after the fix, not how to code it.

---

## Problem in one sentence

After "Skip month", My Subscription still shows the old next delivery date.

## Behaviour required after the fix

1. After a successful skip, My Subscription shows the new next delivery date straight away, and
   again after leaving and reopening the page.
2. The date shown always matches the date stored for the subscription.
3. This holds on phone and desktop.
4. If the skip fails, the page tells the customer and the date does not change.

## Acceptance criteria

- **Given** an active monthly subscription with next delivery date **A**,
  **when** the customer taps "Skip month" and the request succeeds,
  **then** the page shows **A + 1 month** and a confirmation message.
- **Given** the customer has just skipped,
  **when** they reload the page or close and reopen it,
  **then** the page still shows **A + 1 month**, never A.
- **Given** the customer already skipped next month,
  **when** they open the page,
  **then** "Skip month" is disabled and says "Skipped" (no double skip).
- **Given** the skip request fails (for example no connection),
  **when** the customer taps "Skip month",
  **then** they see an error message and the date stays **A**.

## Open questions (must be answered before the fix is "done")

1. Is the new date exactly one month later, or the next scheduled delivery slot?
2. Is the cause a cached page, an unsaved skip, or a phone-only view? (Developer to find out.)
3. Is the same date shown anywhere else (order emails, admin screen) and does it need fixing too?

## Out of scope

- Changing the grind type and gift subscriptions (separate tickets from T1).
- Redesigning My Subscription.

## Tests the fix must come with

1. The failing test from the assertion: after a skip and a reload, the displayed date is
   **A + 1 month** and equals the stored date.
2. A phone-size screen run of the same test.
3. A test for the failure case (criterion 4).

---

## Co-sign checklist (BA/QA fills this in when a developer's fix arrives)

Use on the developer's PR. Tick only what you have actually checked.

- [ ] The test from the assertion exists, and it **failed before** the fix and **passes after**
- [ ] It checks the stored date, not only what the page shows
- [ ] It runs after a full reload
- [ ] The phone-size case is covered
- [ ] The failure case (criterion 4) is covered
- [ ] The PR description says what changed, why, how it was tested, with before/after screenshots
- [ ] I tried the steps from the bug report by hand and the date is now correct

Co-signed by: `[name]` on `[date]` (leave empty until a real fix exists).
