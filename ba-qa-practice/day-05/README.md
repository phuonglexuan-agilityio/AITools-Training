# Day 05: Ticket planning (BA/QA track)

**Role:** BA/QA · **Client (fictional):** Sunrise Coffee Co.

## Goal

Write tickets a developer can start without asking you a question (the "zero-questions test").

## Checklist

- [x] Turn 3 rough requests into ticket packs: story, Given/When/Then criteria, scope and non-scope, open questions ([ticket-packs.md](ticket-packs.md))
- [x] Publish the packs as a spec artifact: <https://claude.ai/artifact/EGxqeGs1WBhbUMDEXXJQ3T> (private to your account until you share it)
- [x] Ask "which tickets touch area X" against real tickets ([tracker-query.md](tracker-query.md)); done with the GitHub API read-only, not the connector
- [ ] Add the GitHub connector in claude.ai (Customize, then Connectors, then GitHub) and repeat the question (yours to do)
- [x] First pass of the zero-questions test, **simulated by Claude** ([zero-questions-check.md](zero-questions-check.md))
- [ ] Real zero-questions test: a developer implements one pack with no questions asked, and you fix the pack if they ask any (needs a developer)

## Files

| File | What it is |
| --- | --- |
| [ticket-packs.md](ticket-packs.md) | Three packs: shipping email, promo code, pause up to 3 months |
| [zero-questions-check.md](zero-questions-check.md) | Skeptical-developer pass: gaps found, fixed, and what is still open |
| [tracker-query.md](tracker-query.md) | Which tickets touch the quiz area, from the repo's real issues, plus one finding |

## Results at a glance

| Pack | Zero questions? |
| --- | --- |
| Shipping email | Yes, with proposed defaults (three questions still to confirm with the client) |
| Promo code | Not yet: needs a separate ticket for creating codes |
| Pause | Not yet: the client must answer "skip vs pause" and "charged during pause?" |

## Honest status

- Sizes (S/M/L) in the packs are **guesses**; ask a developer.
- Proposed defaults are **suggestions**, not client decisions. Common-practice defaults come from
  one how-to article, not from research.
- The finding in `tracker-query.md` is from reading ticket text, not from testing the app.
- Day 5 is **In progress** until a real developer tries a pack.

## Skills practiced today

- **Ticket-pack writing** (story + Given/When/Then + open questions), judged by the
  zero-questions test.
- **Tracker connector idea:** answer "what is in the tracker about X?" from real state, not
  guesses.
- **Artifacts for specs:** the packs as one shareable page.

## Done when

A developer can start at least one pack without asking you anything.
