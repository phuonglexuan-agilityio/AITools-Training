# Release notes (draft): Vocab Flashcards, import and edit checks

Audience: the app owner and anyone who uses the deck.

**What's new**
- Automated checks now cover importing word files and editing words (4 new checks).

**Known problems (not fixed yet)**
- Importing a file that lists the same word twice adds it twice.
- Editing a word so that it matches another word saves it without asking, leaving two copies.

**What to do for now:** after importing, scan the Manage words list for repeated words and
delete the extras.

**Next:** a small ticket to fix both ([ticket pack](../day-06/ticket-pack-fix-duplicates.md)).

Written from the Day 6 bug reports and the Day 9 run. No code was changed in the app itself.
