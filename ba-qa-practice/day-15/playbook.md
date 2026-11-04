# My AI playbook (BA/QA), a first draft

Built from what actually happened in this practice. Edit it into your own words.

1. **Evidence first.** Run the app or the suite before saying "bug". Two of my bugs were proven
   by a 30-line script; one "bug" (CSV commas) disappeared once I read the code comment.
2. **Compare tests with the requirement, not the app.** When a test fails, ask which one is wrong.
3. **Copy expected text from the product.** Do not guess toast messages or labels.
4. **Repair one assertion at a time.** A global find-and-replace broke a correct test.
5. **Triage in three questions:** regression, flaky, environment? Then one root-cause sentence.
6. **Keep known bugs visible.** A `test.fail()` marker keeps CI green but needs a ticket.
7. **Label what is simulated.** Zero-question checks by Claude are not the same as a developer's.
8. **Claude drafts, I decide.** Merge, publish and status changes stay with me.
9. **Ask for ready-to-start tickets:** story, Given/When/Then, scope, open questions with owner and default.
10. **Check the plumbing:** when a tool is blocked (npm registry, github.com), use a supported route instead of fighting it.
