# Decision doc: how should customers skip a month?

Exercise: run a research task (in Cowork) comparing three options and return a decision doc, then
edit its output into your own doc.

**How this was made:** by Claude with web search and by opening the pages below. It was **not run
in Cowork** (that is a feature in your app, which Claude cannot run from here). Use it as a
first draft, run the same prompt in Cowork, compare, and rewrite in your own words.

## Decision needed

Which way should Sunrise Coffee let a subscriber skip one monthly delivery?

## Options

| | A. Button in the account page | B. Skip link in the reminder email | C. Keep email or phone (status quo) |
| --- | --- | --- | --- |
| How it works | Subscriber logs in, opens My Subscription, taps "Skip next delivery" | Reminder email before each order has a "Skip this one" link | Subscriber writes or calls; support makes the change by hand |
| Customer effort | Low, but needs a login | Lowest, one click | High (wait for a reply) |
| Shop effort per skip | None after it is built | None after it is built | One support task each time |
| Build effort (my guess, **not verified**) | Medium | Medium to high (needs reminder emails and secure links) | None |
| Main risks | Date display must match stored date (the Day 2 bug) | Link security, plus reminder emails must already exist | Slow, unhappy customers, the very problem in the request |
| Real-world example found | Verve Coffee and Kaldi's Coffee both let customers skip in their account | Not found in the sources I opened | Not documented as a goal anywhere |

## What the sources say

**Real coffee shops** (checked on their own FAQ pages):
- [Verve Coffee](https://www.vervecoffee.com/pages/subscription-faqs): customers skip a shipment
  themselves with a "Skip Shipment" button and a confirm step, and can also pick a new next charge
  date. The page does not state a skip deadline or a pause option.
- [Kaldi's Coffee](https://kaldiscoffee.com/pages/kaldis-coffee-recurring-subscriptions-faq):
  customers skip, or undo a skip ("Unskip"), from their upcoming orders. No pause option and no
  cutoff are described, and the page says nothing about gift subscriptions.

**Design guidance** from [Rework's skip and pause guide](https://resources.rework.com/libraries/ecommerce-growth/subscription-pause-skip)
(a how-to article, not research):
- A skip cancels only the next shipment and keeps the normal schedule after it.
- Suggested rules: one skip at a time, a 24 to 48 hour cutoff before processing, and undo allowed
  until the original ship date.
- Skipping further ahead is better handled as a pause.

**Claims about fewer cancellations: treat with caution.**
- Rework says skip and pause can cut cancellations by 20 to 40 percent, but the page gives almost
  no named sources for its figures.
- An article on [eCommerce Fastlane](https://ecommercefastlane.com/reduce-your-cancellations-by-10-with-pause-subscriptions/)
  reports a 9.6 percent average "save rate" across more than 1,700 merchants, but it is written
  from the point of view of the vendor Recharge, so the numbers are vendor-reported and not
  independently audited. Its "up to 10 percent" churn reduction is a projection, not a measured
  result.
- Conclusion: do not promise the client a specific retention gain from these sources.

## Recommendation (for you to confirm or change)

**Choose A first: a "Skip next delivery" button in My Subscription.**
- It removes the support email, which is the stated problem.
- Two real coffee shops offer exactly this.
- It matches the request ("add a button").

Conditions to put in the ticket:
1. One skip at a time, with a cutoff before the order is prepared (suggested 24 to 48 hours;
   **the client must decide**).
2. Allow undo until the cutoff.
3. Show the new next delivery date immediately and after reopening the page.

**Later, if wanted:** option B (a skip link in the reminder email) as an extra, once reminder
emails exist.

**Do not do now:** pause for several months. It is a different feature (billing and resume
rules) and should be its own ticket, as in T5 of the Day 2 analysis.

## What is still unknown

- Build effort in the table is a guess; ask a developer.
- Whether Sunrise already sends reminder emails (decides whether B is possible).
- The client's answers to the open questions in [feature-brief.md](feature-brief.md).

## Sources opened

- [Verve Coffee: subscription FAQs](https://www.vervecoffee.com/pages/subscription-faqs)
- [Kaldi's Coffee: recurring subscriptions FAQ](https://kaldiscoffee.com/pages/kaldis-coffee-recurring-subscriptions-faq)
- [Rework: subscription pause and skip](https://resources.rework.com/libraries/ecommerce-growth/subscription-pause-skip)
- [eCommerce Fastlane: pause subscriptions (Recharge)](https://ecommercefastlane.com/reduce-your-cancellations-by-10-with-pause-subscriptions/)

Checked on 2026-11-04. Web pages change, so re-check before quoting them to a client.
