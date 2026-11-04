# Test matrix

Two matrices. Part A covers the Day 5 packs (feature **not built**, so these are *planned* tests,
status "not run"). Part B covers the real import and edit area of the Vocab Flashcards app, where
the "Result" column comes from a real run on 2026-11-04.

Legend: P1 = must pass before release, P2 = should pass, P3 = nice to have.

## Part A: Sunrise Coffee packs (planned, nothing to run yet)

| ID | Pack | Scenario | Type | Expected | Pri | Result |
| --- | --- | --- | --- | --- | --- | --- |
| SHP-1 | Shipping email | Mark an order shipped | Happy path | One email: order number, items, carrier, tracking link | P1 | Not run |
| SHP-2 | Shipping email | Mark shipped twice | Edge | Still one email | P1 | Not run |
| SHP-3 | Shipping email | No tracking number yet | Edge | Email sends, "tracking will follow", no broken link | P2 | Not run |
| SHP-4 | Shipping email | Gift order | Rule (Q2 default) | Email goes to buyer only | P2 | Not run |
| SHP-5 | Shipping email | Mail server down | Failure | Failure logged for support; order stays shipped | P1 | Not run |
| PRM-1 | Promo code | Valid code | Happy path | Discount on its own line, total updated | P1 | Not run |
| PRM-2 | Promo code | Invalid / expired / already used | Negative | Message names which one; total unchanged | P1 | Not run |
| PRM-3 | Promo code | Percentage rounding (e.g. 15% of 9.99) | Boundary | Nearest cent, never below zero | P1 | Not run |
| PRM-4 | Promo code | Second code applied | Rule (Q3 default) | Second replaces first | P2 | Not run |
| PRM-5 | Promo code | Cart below minimum | Negative | Message shows the minimum | P2 | Not run |
| PRM-6 | Promo code | Subscription item | Rule (Q4 default) | First order only | P2 | Not run |
| PAU-1 | Pause | Pause 1, 2, 3 months | Happy path | Deliveries stop; resume date shown | P1 | Not run |
| PAU-2 | Pause | Pause for 0 or 4 months | Boundary | Not offered / rejected | P1 | Not run |
| PAU-3 | Pause | During pause | Rule | No charge, no orders | P1 | Not run |
| PAU-4 | Pause | Resume date arrives | Time-based | Auto restart on next regular date | P1 | Not run |
| PAU-5 | Pause | Delivery already being prepared | Edge | That delivery ships, pause starts after | P2 | Not run |
| PAU-6 | Pause | Cancel while paused | Edge | Cancel allowed | P2 | Not run |

Gaps noticed while building the matrix (to raise with the BA/client, not guessed):
- PAU-2: the pack says 1 to 3 months but does not say what the screen shows for other values.
- PRM-3: the pack does not say which price is discounted (items only, or items plus shipping).

## Part B: Vocab Flashcards, Manage tab: import and edit (real, run 2026-11-04)

Requirement source: the app's own behaviour on add (it asks before adding a duplicate) is taken as
the intended rule; there is no written ticket for import/edit duplicates, which is itself a finding.

| ID | Scenario | Type | Expected | Pri | Result (real run) |
| --- | --- | --- | --- | --- | --- |
| IMP-1 | Import a file containing a word already in the deck | Edge | Skipped, toast says "skipped 1 duplicate(s)" | P1 | **Pass** |
| IMP-2 | Import a file where the same word appears twice | Edge | One copy kept | P1 | **Fail: both imported (BUG-1)** |
| IMP-3 | Import an unreadable file | Negative | Error message, deck unchanged | P2 | Pass (existing suite) |
| IMP-4 | CSV line whose meaning contains a comma | Boundary | Meaning kept whole, or column format documented | P2 | Looked unclear on Day 6; **resolved on Day 14**: the CSV format is documented in a code comment in `app.js` (see day-14) |
| EDT-1 | Edit a word to a new spelling | Happy path | Deck size unchanged | P1 | **Pass** |
| EDT-2 | Edit a word so it equals another word | Edge | App asks first, like Add does | P1 | **Fail: silently creates a duplicate (BUG-2)** |
| EDT-3 | Edit meaning only, keep the word | Happy path | Saved, no duplicate prompt | P1 | Pass (existing suite) |
| ADD-1 | Add a word that already exists | Edge | Asks, Cancel keeps one copy | P1 | Pass (existing suite) |

## Open

- IMP-4 needs a decision from whoever owns the app: what is the CSV column format? Until then it
  is a question, not a bug.
- Priorities are Claude's proposal; adjust them.
