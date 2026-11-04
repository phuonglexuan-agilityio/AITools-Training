# Intake

**Vague brief (as a stakeholder might say it):** "Sometimes my word list has the same word twice.
Can you stop that?"

| Question to ask | Answer used (default, not confirmed) |
| --- | --- |
| When does it happen? | Found by test: after import of a file with repeats, and after editing a word into another |
| What should happen instead? | Same as adding: ask before creating a duplicate; import skips repeats |
| Merge duplicates automatically? | No (out of scope) |
| Case sensitivity? | Ignore case, as Add already does |
| Anything that must not change? | Add, import of existing words, built-in word list |

Definition of done: the two known-bug tests pass without markers, the whole suite stays green,
one PR with a description, merged by the owner.
