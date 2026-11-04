# Tracker query: which tickets touch the quiz area?

Exercise: connect the training repo's GitHub connector and ask Claude which tickets touch area X.

**How this was done:** the GitHub connector was **not used** in this chat. Instead, Claude read
the repo's issues with the GitHub API (read only) from the sandbox and searched their text. The
answer is real data from `phuonglexuan-agilityio/AITools-Training`, fetched on 2026-11-04. Setting
up the connector is still a step for you (see the checklist in [README.md](README.md)).

## Question asked

"Which tickets touch the Quiz area of the Vocab Flashcards app?"

## Answer (26 tickets searched, 7 mention quizzes)

| Ticket | Title | How it touches quiz | State |
| --- | --- | --- | --- |
| #17 | Epic: Practice & quizzes | The parent epic of the quiz stories | Closed |
| #28 | US-07 Listen-and-type quiz | Adds a "Listen and type" mode in the Quiz area | Closed |
| #29 | US-08 Meaning quiz | Adds a "Meaning" mode (4 choices, rounds of 10) | Closed |
| #30 | US-09 Fill-in-the-blank collocation quiz | Adds a "Fill the gap" mode | Closed |
| #27 | US-06 IPA trainer in General American | Quiz must still give distinct wrong answers and ignore old saved scores | Closed |
| #33 | US-12 Progress page | Shows the five IPA sounds with the lowest quiz accuracy | Closed |
| #37 | US-16 Accessibility pass | Focus must move sensibly when quiz questions change | Closed |

Only one ticket in the repo is still open: **#14 Epic: Onboarding**.

## Finding worth raising (BA view)

Stories **#28, #29 and #30** all say "**The Quiz area** has a ... mode", but #28 says the Quiz area
could be "a new tab or a mode inside Study, **agreed with the mentor**" and epic #17 says the first
story built should agree where it lives. So three tickets depend on one location decision that
only one of them states.

- Risk: a developer building #29 or #30 first may assume a place that #28 later changes.
- Suggested fix: record the decision once (in the epic or the spec) and link it from each story.
- This is a read from the ticket text, not a check of the code. Whether it caused trouble is not
  known.

## Note on the question "which ticket is #33?"

In this repo, **#33 is an issue** ("US-12 Progress page"), not a pull request, so it cannot be
merged. GitHub gives issues and pull requests one shared number sequence.

## Follow-up questions the connector could answer (to try yourself)

- "What changed in the tracker this week?"
- "Which tickets have no acceptance criteria?"
- "Which tickets are larger than size M?"
