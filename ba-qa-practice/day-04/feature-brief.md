# Feature brief: "Skip a month" (Sunrise Coffee Co.)

Exercise: summarise a messy feature request into a structured brief in the Project, then publish
the brief as an artifact.

**Published artifact (a Claude doc, private to your account until you share it):**
<https://claude.ai/artifact/CLn78b3J4bGWmHG9Sn5WVM>

This file is the same content, kept in the repo as the record.

**Source request** (practice kit, fictional client):

> Customers keep asking for a way to skip a month on their subscription. Right now they email
> us and it takes ages. Can you add a button? Also maybe let them change the grind type.
> Marketing wants it before the holiday sale, so ASAP. Some people have gift subscriptions, not
> sure how that should work.

---

## Goal

Let a subscriber skip one monthly delivery from their account, without contacting support,
before the holiday sale.

## Actors

| Actor | Role in this feature |
| --- | --- |
| Subscriber | Skips a delivery from My Subscription |
| Gift giver / gift recipient | Unclear who may skip a gift subscription (open question) |
| Sunrise support team | Handles skips by email today; should not need to after this |
| Marketing | Owns the holiday-sale deadline |
| Developer | Builds and tests the button and the date change |

## Constraints

- Wanted "before the holiday sale, ASAP". **No date has been given.**
- Today a customer must email the shop and waits a long time for the change.
- The request also mentions changing the grind type; that is a separate change.

## Assumptions (not confirmed by the client)

- The skip applies to monthly subscriptions only.
- A skip moves the next delivery date forward by one month.
- A customer can skip until a cutoff, before the order is prepared (length of cutoff unknown).

## Open questions for the client

1. What is the real deadline: a fixed date or a target?
2. Which plans can skip: all subscribers or only some?
3. How many skips are allowed in a row, or per year?
4. How should gift subscriptions behave: can the giver skip, the recipient, or neither?
5. Is the grind type change in scope now, or a later ticket?
6. Until when can a customer skip (cutoff before the order is prepared), and can they undo it?
7. What does the customer see after skipping: a confirmation, the new date, an email?

## Proposed scope

- **In scope:** a "Skip next delivery" action on My Subscription, the new next delivery date, a
  confirmation message.
- **Out of scope for now:** changing the grind type, gift subscription rules (until answered),
  pausing for several months (a separate ticket).

## Risks

- An unclear deadline means the work may be squeezed into the sale period.
- Skip and pause overlap; building both without a decision risks building twice.
- The date shown must match the stored date (see the Day 2 bug, where the page showed an old date
  after a skip).

## Note on earlier practice

The Day 2 role-play used **invented** client answers (for example a 1 December date). They are
not facts and are not used here.
