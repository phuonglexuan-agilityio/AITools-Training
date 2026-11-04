# Day 10: CI and triage

**Role:** BA/QA · **CI:** GitHub Actions workflow "Vocab Flashcards tests"

## Goal

When CI is red, decide quickly: regression, flaky, or environment? Then write what changed for
non-technical readers.

## Checklist

- [x] Got a real red CI run (seeded on purpose, see below) and read its log ([ci-triage.md](ci-triage.md))
- [x] Wrote the root-cause sentence and the verdict
- [x] Fixed it in a follow-up commit and confirmed CI went green (see ci-triage.md, last section)
- [x] Release notes for the BA/stakeholder audience ([release-notes.md](release-notes.md))
- [ ] Triage a red run you did not create yourself (none exists in this repo's history: all 51 earlier runs were green)

## Honest status

The red run is **seeded**: I pushed the Day 9 spec once without a needed marker so that CI would
fail. It is real CI output, but it is not a surprise failure. Treat this as practice, not as a
find. Release notes are a Claude draft in plain markdown (not yet published as an artifact).
