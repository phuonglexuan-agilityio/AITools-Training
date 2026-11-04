# Ticket packs: three rough requests (Sunrise Coffee Co.)

Exercise: turn 3 rough requests into ticket packs: user story, Given/When/Then acceptance
criteria, scope and non-scope, open questions, and a spec artifact.

Source requests: practice kit (fictional client). The format follows the house style of this
repo's user stories (story line, numbered criteria, tests, size), plus open questions.

**Rules used**
- Nothing is invented as a fact. Where the client has not decided, the pack gives a **proposed
  default** and an owner, so a developer can start and the client can still change it.
- Every open question has an **owner** and a **proposed default**.
- Sizes (S/M/L) are **guesses** by Claude. Ask a developer.
- Common-practice defaults (auto-resume, a reminder before resuming, a limit on pause length)
  come from a how-to article, [Rework: subscription pause and skip](https://resources.rework.com/libraries/ecommerce-growth/subscription-pause-skip).
  They are suggestions, not client decisions.

**Published as a spec artifact:** see the link in [README.md](README.md).

---

## Pack 1: Shipping email

> "Customers should get an email when their order ships."

**User story:** **As a** customer, **I want** an email when my order ships, **so that** I know it
is on its way and can track it.

### Acceptance criteria

1. **Given** an order is marked "shipped", **when** the system processes it, **then** the customer
   gets one email with the order number, the items, the carrier and a tracking link.
2. **Given** an order is marked "shipped" a second time (status changed twice), **when** the
   system processes it, **then** no second email is sent.
3. **Given** there is no tracking number yet, **when** the order is marked shipped, **then** the
   email still sends and says tracking will follow, with no broken link.
4. **Given** a gift order, **when** it ships, **then** the email goes to the buyer, not the
   recipient (proposed default, see Q2).
5. **Given** the email cannot be sent, **when** the order is marked shipped, **then** the failure
   is recorded where support can see it, and the order stays "shipped".
6. **Given** the email is sent, **when** the customer reads it, **then** the wording is the text
   supplied by Marketing (placeholder text until then, see Q5).

### Scope

- **In:** one shipping email per order, in English, for all order types.
- **Out:** "delivered" emails, SMS, a way for customers to turn the email off, other languages, a
  "resend email" button for support.

### Open questions

| # | Question | Owner | Proposed default |
| --- | --- | --- | --- |
| Q1 | What counts as "shipped": staff mark it, or the carrier scans it? | Client | Staff mark it "shipped" in the order screen |
| Q2 | Gift orders: who gets the email? | Client | The buyer only |
| Q3 | Which orders: one-off, subscription, gift? | Client | All three |
| Q4 | How soon after "shipped" must the email arrive? | Client | Within 10 minutes |
| Q5 | Who writes the email wording and chooses the sender name and address? | Marketing | Placeholder text and the shop's usual sender, replaced later |

### Tests

End-to-end: mark an order shipped and check one email arrives in a test inbox with the right
details; mark it shipped twice and check there is still one email; order with no tracking number;
email failure is logged. Size (guess): M.

---

## Pack 2: Promo code at checkout

> "Add a promo code box at checkout."

**User story:** **As a** customer, **I want** to enter a promo code at checkout, **so that** I get
the discount I was promised.

### Acceptance criteria

1. **Given** items in my cart and a valid code, **when** I apply it, **then** the discount shows
   on its own line and the total updates before I pay.
2. **Given** a code that is invalid, expired or already used by me, **when** I apply it, **then**
   I see a message that says which of the three it is, and the total does not change.
3. **Given** a code is applied, **when** I remove it, **then** the total goes back to the
   original.
4. **Given** a code is applied, **when** I apply a second code, **then** the second replaces the
   first (proposed default, see Q3).
5. **Given** a code needs a minimum order and my cart is below it, **when** I apply it, **then**
   the message shows the minimum amount.
6. **Given** a percentage code, **when** the discount is worked out, **then** it is rounded to the
   nearest cent, and the total never goes below zero.
7. **Given** a subscription item in the cart, **when** a code is applied, **then** the discount
   applies to the first order only (proposed default, see Q4).

### Scope

- **In:** one **percentage** code at a time, entered at checkout.
- **Out:** fixed-amount codes, free-shipping codes, codes applied automatically, combining codes.
- **Dependency (separate ticket):** a way for staff to create and deactivate codes. Without it,
  this box has nothing to check against.

### Open questions

| # | Question | Owner | Proposed default |
| --- | --- | --- | --- |
| Q1 | Which kinds of discount are needed first? | Client | Percentage only |
| Q2 | Who creates and ends codes, and where? | Client | Staff, in a separate ticket |
| Q3 | Can two codes be combined? | Client | No, the second replaces the first |
| Q4 | Do codes apply to subscriptions? | Client | First order only |
| Q5 | Rules for a code: expiry date, minimum order, one use per customer? | Marketing | All three supported, set per code |

### Tests

Unit tests for the discount calculation (rounding, never below zero). End-to-end for apply,
remove, invalid, expired, used and minimum order. Size (guess): M, plus the separate admin ticket.

---

## Pack 3: Pause a subscription for up to 3 months

> "Let people pause their subscription for up to 3 months."

**User story:** **As a** subscriber, **I want** to pause my subscription for 1 to 3 months, **so
that** I do not get coffee while I am away and I do not have to cancel.

### Acceptance criteria

1. **Given** an active subscription, **when** I choose Pause and pick 1, 2 or 3 months, **then**
   my deliveries stop until the resume date, and I see that date.
2. **Given** my subscription is paused, **when** the pause is running, **then** I am not charged
   and no orders are created.
3. **Given** the pause has ended, **when** the resume date arrives, **then** the subscription
   restarts automatically and the next delivery is on the next regular delivery date.
4. **Given** my subscription is paused, **when** I tap "Resume now", **then** it restarts and I
   see my next delivery date.
5. **Given** my subscription is already paused, **when** I open My Subscription, **then** Pause
   is not offered and I see "Paused until [date]".
6. **Given** a delivery is already being prepared, **when** I pause, **then** that delivery still
   ships and the pause starts after it (same cutoff as skip, see Q6).
7. **Given** my subscription is paused, **when** I choose to cancel, **then** I can cancel.
8. **Given** the pause ends in 7 days, **when** the day comes, **then** I get a reminder email
   (proposed default, see Q4).

### Scope

- **In:** pause for 1, 2 or 3 months, resume now, automatic resume, the reminder email.
- **Out:** pausing longer than 3 months, changing the delivery frequency, gift subscription
  rules (until Q5 is answered), "skip one delivery" (its own ticket, see below).
- **Relationship to skip:** a skip moves exactly **one** delivery; a pause is **1 to 3 months**.
  Decide this before building either (see Q1).

### Open questions

| # | Question | Owner | Proposed default |
| --- | --- | --- | --- |
| Q1 | Does pause replace "skip a month", or live beside it? | Client | Live beside it: skip = one delivery, pause = 1 to 3 months |
| Q2 | Does the customer choose the number of months or a resume date? | Client | Number of months (1, 2 or 3) |
| Q3 | Is the customer charged during a pause? | Client | No charge |
| Q4 | Is the customer reminded before it resumes? | Client | Yes, 7 days before |
| Q5 | How should gift subscriptions behave? | Client | Not included in this ticket |
| Q6 | Cutoff for a delivery already being prepared? | Client | Same as skip (to be decided there) |
| Q7 | How many pauses per year? | Client | No limit |

### Tests

End-to-end: pause for 1, 2 and 3 months, resume now, automatic resume on the date, no orders or
charges during the pause, cancel while paused. Unit tests for working out the resume date.
Size (guess): L.
