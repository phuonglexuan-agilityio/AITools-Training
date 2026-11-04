# Q2: Explain a concept

## Prompt (version 1, basic)

```
What are acceptance criteria?
```

## Prompt (version 2, improved)

```
Explain "acceptance criteria" to me as if I'm new to software teams. Use one example from an
online coffee shop. Keep it under 150 words.
```

## Answer used (from version 2)

Acceptance criteria are the checks that decide whether a piece of work is finished. They are
written before the work starts, so the business person, the developer and the tester all agree
on what "done" means.

A common format is Given / When / Then.

Example for "customer can skip a month of their coffee subscription":

- **Given** a customer has an active subscription,
  **when** they click "Skip next month",
  **then** the next delivery date moves forward by one month and they see a confirmation.
- **Given** a customer already skipped next month,
  **when** they open the page,
  **then** the Skip button is disabled and says "Skipped".

If the team cannot write a check like this, the request is not clear enough yet.

## To edit by hand

- [ ] Add one line in your own words. Suggestion: acceptance criteria are what QA turns into
  test cases later, so BA and QA should read them at the same time.
