# Git block (Day 02): pull --rebase, log/diff, merge conflict #1

Proof that these commands were really run is in
[evidence/git-conflict-transcript.txt](evidence/git-conflict-transcript.txt). They were run in a
**throwaway repo** (not this one) with two people, Alice (me) and Bob (partner), editing the same
line of a ticket file.

## What happened

1. Alice and Bob both start from the same ticket: `Deadline: TBD`.
2. Bob pushes first: `Deadline: 1 December (holiday sale)`.
3. Alice, who has not pulled, changes the same line to `Deadline: ASAP` and commits.
4. Alice runs `git pull --rebase origin main`. Git cannot merge two edits to the same line, so it
   stops with a **conflict** in `ticket.md`.

## The commands, in plain words

| Command | What it does | When I use it |
| --- | --- | --- |
| `git pull --rebase origin main` | Fetches the latest `main` and replays my commits on top of it, so history stays a straight line. | Before I push, to pick up other people's work. |
| `git log --oneline --graph` | Shows the commit history, one line each, as a picture. | To see who changed what and in which order. |
| `git diff` | Shows what changed. During a conflict it shows both versions side by side. | To understand a conflict before fixing it. |
| `git status -sb` | Short status. `UU` means "both sides changed this file". | To see which files are in conflict. |
| `git add <file>` then `git rebase --continue` | Marks the conflict as solved and finishes the rebase. | After I edit the file by hand. |
| `git rebase --abort` | Cancels the whole rebase and returns to the state before it. | If I am lost and want to start again. |

## How I read the conflict

```
<<<<<<< HEAD
Deadline: 1 December (holiday sale)     <- the version already on main (Bob)
=======
Deadline: ASAP                          <- my version (Alice)
>>>>>>> eda8c15 (Set deadline to ASAP)
```

## How I resolved it (a BA decision, not a coding one)

- "ASAP" is not a date, and "1 December" comes from the client's holiday sale. I kept the date
  and recorded why: `Deadline: 1 December (holiday sale; "ASAP" was too vague)`.
- Lesson: a conflict is often two people holding **different answers**. Ask the other person
  before choosing; do not just keep your own version.

## Checklist

- [x] `git pull --rebase` run, conflict produced and resolved
- [x] `git log` and `git diff` read and explained
- [ ] Repeat on the real training repo with a conflict seeded by the lead (needs your setup)
