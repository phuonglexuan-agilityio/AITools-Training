# Ticket analysis: 5 tickets, three sentences each

Source tickets: the practice kit for the fictional client **Sunrise Coffee Co.**
(online coffee shop with a web app and a monthly subscription).

Format for each ticket: three sentences (what it asks, what is ambiguous, first step), then the
questions to send to the reporter, most important first.

Status: first drafts by Claude. Edit them by hand in your own words (see the README checklist).

---

## T1: "Skip a month" request (messy feature request)

> Customers keep asking for a way to skip a month on their subscription. Right now they email
> us. Can you add a button? Also maybe let them change the grind type. Marketing wants it before
> the holiday sale, so ASAP. Some people have gift subscriptions, not sure how that should work.

1. **What it asks:** a self-service way for subscribers to skip one monthly delivery, and
   possibly to change the grind type.
2. **What is ambiguous:** the deadline ("ASAP"), who may skip, how many skips are allowed,
   what happens to gift subscriptions, and whether "grind type" belongs in this ticket.
3. **First step:** confirm the deadline and scope with the client, then split grind type into its
   own ticket if it is wanted.

**Questions for the reporter**

1. What is the real deadline: a fixed date, or a target?
2. Can all subscribers skip, or only some plans?
3. How many skips in a row, or per year, are allowed?
4. How should gift subscriptions behave: can the giver skip, the receiver, or neither?
5. Is the grind type change in scope now or a later ticket?
6. What should the customer see after skipping (confirmation, new date, an email)?
7. Until when can a customer skip before the next order is prepared?

---

## T2: "Next delivery date not updated" (bug)

> "Skip month" works, but when I skip and then reopen My Subscription, the next delivery date
> still shows the old date. Happens on my phone. Not sure about desktop.

1. **What it asks:** fix the My Subscription page so it shows the new next-delivery date after a
   skip.
2. **What is ambiguous:** whether the skip is really saved or only the display is wrong, which
   phone and browser, and whether desktop is affected.
3. **First step:** reproduce it with exact steps and a screenshot; see
   [bug-report.md](bug-report.md).

**Questions for the reporter:** see the list in [bug-report.md](bug-report.md) (section
"Open questions").

---

## T3: Shipping email

> Customers should get an email when their order ships.

1. **What it asks:** send an email to the customer when an order ships.
2. **What is ambiguous:** which orders (one-off, subscription, gift), what the email says, when
   exactly "ships" happens, the sender, and what happens if the email fails.
3. **First step:** ask the client for an example of the email they want and the definition of
   "shipped" (label created or handed to the carrier).

**Questions for the reporter**

1. Which orders get this email: all, or only some?
2. What must the email contain (tracking link, items, delivery estimate)?
3. Is "shipped" when the label is printed or when the carrier scans it?
4. For gift orders, does the buyer, the receiver or both get the email?
5. Can customers turn these emails off?
6. Do emails need translating, or is English enough?

---

## T4: Promo code at checkout

> Add a promo code box at checkout.

1. **What it asks:** a field at checkout where a customer enters a promo code to get a discount.
2. **What is ambiguous:** what types of codes exist (percent, fixed, free shipping), who creates
   them, limits (expiry, one use per customer), and whether codes stack.
3. **First step:** ask the client how codes are created and managed, since the box alone is
   useless without a way to make codes.

**Questions for the reporter**

1. What kinds of discount are needed first?
2. Who creates and deactivates codes, and where?
3. Rules: expiry date, minimum order, one use per customer, can two codes be combined?
4. Do codes apply to subscriptions, one-off orders, or both?
5. What message appears for an invalid or expired code?
6. Is the discount shown before the customer pays?

---

## T5: Pause a subscription for up to 3 months

> Let people pause their subscription for up to 3 months.

1. **What it asks:** let a subscriber pause deliveries for a period of up to three months.
2. **What is ambiguous:** how pause differs from skip, whether the customer picks the length or
   a resume date, what happens at the end (auto-resume?), and billing during the pause.
3. **First step:** ask whether pause replaces "skip a month" or lives beside it, because T1 and
   T5 overlap.

**Questions for the reporter**

1. Is pause the same as skipping up to three months in a row?
2. Does the customer choose a number of months or a resume date?
3. Does the subscription resume automatically, and is the customer reminded first?
4. Is the customer charged during the pause?
5. Can the customer cancel the pause early?
6. Can a customer pause more than once a year?

---

## Pattern across the five tickets

- Every ticket hides a deadline, scope or "who" question.
- T1 and T5 overlap (skip vs pause): decide that first, so two developers do not build twice.
- Do not guess answers: unresolved items go to the reporter as questions.
