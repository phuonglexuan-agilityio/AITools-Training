# Journey: import then edit, looking for duplicates

Derived from the acceptance criteria in [ticket-pack-fix-duplicates.md](../day-06/ticket-pack-fix-duplicates.md).

| Step | Action | Check |
| --- | --- | --- |
| 1 | Open the app with empty storage | Manage tab shows 6 sample words |
| 2 | Import `dup.json` (same word twice) | Expect one new row; **got 2 (BUG-1)** |
| 3 | Edit `ephemeral` into `zebra`, save | Expect a confirm box; **none appeared (BUG-2)** |
| 4 | Reload, import a CSV line with a comma in the meaning | Record what happens (IMP-4) |

Run with [evidence/journey-probe.js](evidence/journey-probe.js) (needs Node and the `playwright` package).

Output of the run:

```
C1 base 6 after 8 zebra rows 2 toast Imported 2 word(s)
C2 confirmShown false zebra rows now 3
C3 quokka row: "quokkalearning\n\na small marsupial\n\nfound in Australia\n\nEdit\nDelete"
errors []
```

Screenshots: [c1-import-duplicates.png](evidence/c1-import-duplicates.png), [c2-edit-duplicate.png](evidence/c2-edit-duplicate.png).

Notes
- The page logged no JavaScript errors, so these are logic bugs, not crashes.
- Step 4 is not judged pass/fail: no CSV format is documented.
- A script is faster to repeat than clicking by hand, but it only checks what it was told to
  check. It did not notice layout problems; look at the screenshots yourself.
