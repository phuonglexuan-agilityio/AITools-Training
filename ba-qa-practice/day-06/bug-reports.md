# Bug reports (reproduce-ready)

Both bugs were **reproduced by running the app** in Chromium on 2026-11-04 with the script
[journey-probe.js](../day-08/evidence/journey-probe.js). Screenshots are in
[day-08/evidence](../day-08/evidence/). Build: `main` at commit b7ef1f7, opened from `file://`
(`vocab-flashcards/index.html`), fresh browser profile, so the deck starts with the 6 sample words.

---

## BUG-1: Importing a file with the same word twice adds both copies

| Field | Value |
| --- | --- |
| Severity | Medium (corrupts the deck; user must delete by hand) |
| Area | Manage words, Import |
| Found by | Test matrix row IMP-2 |
| Status | Open, confirmed |

**Steps to reproduce**
1. Open `index.html` with empty browser storage. Go to the **Manage words** tab (6 words listed).
2. Click **Import** and choose a file `dup.json` containing:
   `[{"word":"zebra","meaning":"an animal"},{"word":"zebra","meaning":"an animal again"}]`

**Expected:** one `zebra` is added; the toast says one duplicate was skipped.
**Actual:** two `zebra` rows are added (list goes from 6 to 8 rows). Toast: "Imported 2 word(s)".
**Impact:** the same word shows up twice in Study; progress is tracked separately for each.

**Likely cause (hypothesis, from reading `app.js`, not proven):** `importWords` builds the set of
existing words once, before filtering, so words inside the file are never compared to each other.
**Not tested:** duplicates differing only in letter case; files with 500+ rows.
**Automated check:** `import-and-edit-duplicates.spec.js`, test IMP-2 (currently marked as an expected failure).

---

## BUG-2: Editing a word into an existing word creates a silent duplicate

| Field | Value |
| --- | --- |
| Severity | Medium |
| Area | Manage words, Edit |
| Found by | Test matrix row EDT-2 |
| Status | Open, confirmed |

**Steps to reproduce**
1. Fresh storage, **Manage words** tab.
2. Click **Edit** on the second word in the list. Change its Word field to exactly the text of
   another word already in the list.
3. Click **Save**.

**Expected:** the in-page confirm box appears ("already exists"), as it does when adding.
**Actual:** no confirm box; the edit is saved and two rows now carry the same word.
(In the probe run the edit was `ephemeral` to `zebra`, after BUG-1 had left two `zebra` rows,
so it showed 3 `zebra` rows and no confirm box. The automated test EDT-2 reproduces it on a clean deck.)
**Likely cause (hypothesis):** the edit path assigns the new values without the duplicate check
that the add path uses.
**Not tested:** edit to the same word with different letter case.
**Automated check:** `import-and-edit-duplicates.spec.js`, test EDT-2 (expected failure).

---

## Not filed as a bug

IMP-4 (CSV meaning with a comma is split in two). Without a written CSV format it may be
intended. It is listed under "Open" in [test-matrix.md](test-matrix.md).
