# Reviewing the spec like a PR

File: `vocab-flashcards/tests/e2e/import-and-edit-duplicates.spec.js`

| Check | Verdict | Note |
| --- | --- | --- |
| Each test traces to a requirement | Yes | IDs IMP-1, IMP-2, EDT-1, EDT-2 in the titles, matching `day-06/test-matrix.md` |
| Asserts behaviour, not implementation | Yes | Checks visible rows, toast text and the confirm box |
| Independent tests | Yes | The shared fixture opens a fresh browser context each time |
| Fails for the right reason | Mostly | See "mistake" below |
| Known bugs handled | Yes | `test.fail()` with a reason; run stays green, and turns red the day the bug is fixed |
| No fixed sleeps | Yes | Uses auto-waiting assertions only |

## Mistake in my first draft

My first run had 1 failing test (IMP-1). I had guessed the toast text "Imported 1 word(s)", but the
app says "Imported 1 word(s), skipped 1 duplicate(s)" (`app.js` line 430). The app was right;
my test copied my assumption instead of the product. I fixed the test. Lesson for a BA: take
expected text from the ticket or the real product, never from memory.

## Open

- `test.fail()` markers hide a real defect from the green/red signal; the bugs must be
  tracked as tickets (see `day-06/ticket-pack-fix-duplicates.md`) or they will be forgotten.
- Only chromium is run, as in the repo's config.
