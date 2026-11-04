# Bug report (reproduce-ready): next delivery date not updated after skip

Source: the seeded bug from the practice kit.

> "Skip month" works, but when I skip and then reopen My Subscription, the next delivery date
> still shows the old date. Happens on my phone. Not sure about desktop.

Rule used: **do not invent details.** Anything the reporter did not say is marked
`[ask reporter]`.

---

**Title:** My Subscription still shows the old next delivery date after "Skip month"

**Environment:**
- Device: phone `[ask reporter: model]`
- OS and browser or app version: `[ask reporter]`
- Desktop: `[ask reporter: not tested yet]`
- Account type and plan: `[ask reporter]`

**Steps to reproduce** (taken from the report; steps 1 and 2 are the reporter's likely path and
must be confirmed):
1. Log in on the phone. `[confirm]`
2. Open **My Subscription**. `[confirm]`
3. Note the **next delivery date** shown (call it date A).
4. Tap **Skip month**. The skip appears to work.
5. Leave the page, then reopen **My Subscription**.
6. Look at the **next delivery date**.

**Expected:** the next delivery date moves forward by the skipped month (it is no longer
date A). `[confirm the rule with the client: is it exactly one month later?]`

**Actual:** the page still shows date A.

**Evidence:** `[ask reporter: screenshot or short recording of steps 3 and 6]`

**Frequency:** `[ask reporter: every time or sometimes]`

---

## Open questions (send to the reporter)

1. Which phone, OS and browser or app version?
2. Exact steps: how did you open My Subscription, and how did you "reopen" it (back button, new
   tab, closed the app)?
3. Is the skip really saved? Check the order list, the email, or ask support.
4. Does it happen on desktop?
5. Does a full refresh, or logging out and in, show the right date?
6. Does it happen every time?
7. Please send a screenshot of before and after.

## Hypotheses to check (Claude habit: verify by running, do not trust)

These are guesses from the symptom only. **None is verified.** Each needs a check by someone
with the running app.

| # | Hypothesis | How to check it |
| --- | --- | --- |
| H1 | The skip is saved, but the page shows an old cached copy of the date. | Reopen with a hard refresh. If the date is right, it is a cache problem. |
| H2 | The skip is not saved; only the button shows success. | Check the order or admin view right after skipping. |
| H3 | Phone-only problem (the mobile view reads a different value). | Repeat on desktop with the same account. |

## Status

- [x] Report written in the template, unknowns flagged
- [ ] Reproduced on a running app (needs the training app; not done here)
