# Zero-questions check

Exercise: a developer implements one of your ticket packs with no questions asked. If they had
questions, the ticket was not done. Fix it.

**Status: simulated by Claude, not by a real developer.** The real test still needs a developer
from the dev track. This file is a first pass: Claude re-read each pack as a skeptical developer,
listed the questions it would still have, and fixed the packs ([ticket-packs.md](ticket-packs.md))
where it found gaps.

## What "zero questions" means here

A pack passes when **every** question a developer would ask is either **answered in the pack**, or
listed as an **open question with an owner and a proposed default**. A developer can then start
without a meeting, and the client can still change a default later.

## Pass 1: gaps found and fixed

| Pack | Question a developer would still ask | Fix made |
| --- | --- | --- |
| 1. Shipping email | "Who writes the wording, and what is the sender?" | Added criterion 6 and open question Q5 (Marketing, placeholder text) |
| 1. Shipping email | "What if there is no tracking number yet?" | Added criterion 3 (email still sends, says tracking will follow) |
| 1. Shipping email | "What if the email fails to send?" | Added criterion 5 (failure recorded, order stays shipped) |
| 2. Promo code | "How do I round the discount, and can the total go negative?" | Added criterion 6 (nearest cent, never below zero) |
| 2. Promo code | "Where do the codes come from?" | Named a **dependency ticket** for staff to create codes, so this one is not built on nothing |
| 3. Pause | "What if a delivery is already being prepared when they pause?" | Added criterion 6 and open question Q6 |
| 3. Pause | "Is pause different from the skip ticket?" | Added the relationship to skip in the scope and open question Q1 |

## Pass 2: questions that remain (all are listed in the packs, none is hidden)

| Pack | Still open | Blocks building? |
| --- | --- | --- |
| 1. Shipping email | Q1 what "shipped" means, Q2 gift orders, Q5 wording | No: proposed defaults let a developer start |
| 2. Promo code | Q2 who creates codes | **Partly:** needs its own ticket before this is usable end to end |
| 3. Pause | Q1 skip vs pause, Q3 charging during pause, Q5 gifts | Q1 and Q3 should be answered **before** work starts; the rest have defaults |

## Result

| Pack | Zero questions? |
| --- | --- |
| 1. Shipping email | Yes, with defaults (Q1, Q2 and Q5 still to confirm with the client) |
| 2. Promo code | Not yet: needs the code-management ticket written |
| 3. Pause | Not yet: needs the client's answer to Q1 (skip vs pause) and Q3 (charging) |

## Still to do (needs a developer)

- [ ] Give Pack 1 to a developer and let them start without talking to you
- [ ] Write down every question they ask
- [ ] Fix the pack and try again until they ask none
- [ ] Write the missing code-management ticket for Pack 2
- [ ] Get the client's answers to Pack 3 Q1 and Q3
