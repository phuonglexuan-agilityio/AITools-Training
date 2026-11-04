# Project setup: one Project per client

Exercise: set up one Project per training "client" and move all BA/QA work into it.

**Status: not done by Claude.** A claude.ai Project is created in your own account, and Claude
cannot create one for you. Do the steps below, then tick the boxes in the README.

(The Project this session is attached to is called "Claude Practice". Use it, or make a new
Project named after the client, as the training says.)

## Steps

1. Sign in at <https://claude.ai/projects>.
2. Click **+ New Project** and name it **Sunrise Coffee Co.**
3. Click **Set project instructions** and paste the text below.
4. Move your Sunrise Coffee chats into it. New chats started inside it use the instructions
   automatically.

## Project instructions (paste this)

```
Client: Sunrise Coffee Co., a fictional online coffee shop with a web app where customers order
beans and have a monthly subscription. (Practice client; no real client data.)

I am a BA/QA on the AgilityIO AI Tools training. Write in plain language.

Rules:
- Never invent requirements. Put anything unconfirmed under "open questions".
- Mark any guess or estimate as a guess.
- Use Given/When/Then for acceptance criteria.
- For bug reports use: steps to reproduce, expected vs actual, environment. Flag unknowns as
  [ask reporter].
- Keep this client's data in this Project only; never mix it with other clients.
- Claude writes the first draft; I write the last one.
```

## Confidentiality rule (from the training)

One Project per client. Never mix client data across threads. This practice client is fictional,
but keep the habit.

## Run the research in Cowork (Day 4 exercise)

1. Open the Claude Desktop app, and start a task in Cowork (or describe the task in a new chat
   if your account no longer has a Chat/Cowork picker).
2. Paste:

```
Compare three ways to let subscription customers skip a month: a button in the account page,
a skip link in the reminder email, and keeping it manual by email or phone. Return a decision
doc with pros, cons, a rough effort guess and a recommendation. Cite sources, and mark
vendor-reported claims as such.
```

3. Compare its answer with [decision-doc.md](decision-doc.md), then rewrite the doc in your own
   words.

## Checklist

- [ ] Project "Sunrise Coffee Co." created with the instructions above
- [ ] Sunrise Coffee chats moved into it
- [ ] Cowork research task run and compared with `decision-doc.md`
- [ ] Decision doc rewritten in your own words
