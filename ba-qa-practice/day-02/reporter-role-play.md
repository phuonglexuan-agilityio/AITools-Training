# Role-play: asking the reporter (T1, "skip a month")

Exercise: write the questions you would ask the reporter, then role-play reporter and developer
in pairs.

**Important:** this is a **simulated** conversation written by Claude, with invented client
answers. It shows the shape of a good exchange. For the real exercise, replace the answers with
your partner's real answers (or the real client's).

## Questions sent (BA)

1. What is the real deadline: a fixed date, or a target?
2. Can all subscribers skip, or only some plans?
3. How many skips in a row, or per year, are allowed?
4. How should gift subscriptions behave?
5. Is the grind type change in scope now or a later ticket?

## Simulated reporter answers (invented, for practice)

| # | Answer from "client" | What a BA does with it |
| --- | --- | --- |
| 1 | "Holiday sale starts 1 December, so we need it live by 25 November." | Write the date in the ticket; the word "ASAP" is removed. |
| 2 | "All monthly plans. Not the one-off orders." | Add to scope: monthly plans only. |
| 3 | "One skip per month, at most two in a row." | Becomes an acceptance criterion with a negative test for the third skip. |
| 4 | "We have not decided." | Stays as an **open question**; do not guess. Flag it as a risk. |
| 5 | "Later ticket." | Goes to out-of-scope; open a separate ticket. |

## Developer's view (simulated)

> "With the answers 1, 2, 3 and 5 I can start. Answer 4 blocks gift subscriptions only, so I will
> build for normal subscriptions and leave gifts disabled until the client decides."

## What to notice

- A question the client cannot answer ("not decided") is still useful: it becomes a flagged risk
  rather than a hidden assumption.
- One answer ("at most two in a row") produced a new testable rule. Good questions create
  acceptance criteria.

## For you to do (real role-play)

- [ ] Run this with a partner: they play the reporter and answer in their own words.
- [ ] Update the answers table with the real answers.
