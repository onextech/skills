---
name: ideate
description: Brainstorm gaps, loopholes, and improvement ideas on recently built work, reviewed through a product manager's lens. Inspects git diff and session context to scope what to review, then returns a categorized continuously-numbered list (Gaps, Risks & Loopholes, UX Polish, Quick Wins, Future Bets) and offers to implement whichever items the user picks. Use when the user says "ideate", "what are we missing", "review this as a PM", "what could we improve", "brainstorm gaps", "loopholes in this", "what's next on this feature", or asks for a numbered list of refinements on a current implementation. Do NOT use for bug fixes, one-line changes, pure code reviews, or architectural decisions — this is product-thinking scope, not engineering scope.
---

# Ideate

Brainstorm gaps and improvement ideas on recently built work, reviewed as a product manager. The goal is to surface what the engineer who was heads-down on the feature most likely missed — then let the user pick which items to implement next.

## How to run

### 1. Establish scope

Figure out *what* you are ideating on before generating any ideas. Try in this order:

1. If the user named a feature or area in their prompt, use that.
2. Otherwise use session context — what has just been built or modified in this conversation?
3. Otherwise inspect the working tree:
   - `git diff --stat` for unstaged/staged changes
   - `git log <main>..HEAD --oneline` for branch commits (detect default branch — `main` or `master`)
   - `git diff <main>...HEAD --stat` for the full branch scope

Read the most-changed files just enough to understand the **intent** — not line-by-line. If scope is genuinely ambiguous (no recent changes and no named feature), ask one short clarifying question and stop. Do not invent scope.

### 2. Review as a PM

Apply a senior product manager's lens. **Not** a code reviewer's — skip lint, naming, architecture nitpicks. Focus on:

- **User value** — Does this actually deliver the promised outcome? Where does the flow feel rough or unfinished?
- **Edge cases** — Empty states, error states, loading states, behavior at 0 / 1 / many / extreme N.
- **Business logic gaps** — Missing validation, limits, guards, permissions, abuse vectors.
- **Discoverability** — Will real users find this feature and understand it? Is the entry point obvious?
- **Continuity** — What does the user expect to do *immediately after* this? Is that next step supported?
- **Reversibility** — Can users undo destructive actions? Are confirmations placed where they matter?
- **Cross-feature impact** — Does this conflict with, duplicate, or undercut anything already in the product?

### 3. Output the categorized list

Use these five buckets. Omit any bucket that genuinely has nothing real — do not pad.

- **Gaps** — Missing pieces that prevent the feature from feeling complete.
- **Risks & Loopholes** — Ways this breaks, gets misused, corrupts data, or generates support load.
- **UX Polish** — Friction, copy, empty states, micro-interactions.
- **Quick Wins** — Small additions with disproportionate impact.
- **Future Bets** — Larger directions worth considering later (not now).

Rules:

- **Continuous numbering across buckets.** Start at 1 in the first bucket and keep counting through the rest. The user will reference numbers like "do 3 and 7".
- **One sentence per item.** No paragraphs. No sub-bullets.
- **8–15 items total.** Anything more is noise; fewer is fine if the feature is small.
- **No code-style critiques.** This is PM scope. If you find a code smell, swallow it — that belongs in a different skill.
- **Each item must be actionable.** "Improve UX" is not an item; "Add an empty state to the tasks list when the user has zero items" is.

### 4. Offer follow-through

End your response with exactly this prompt (do not paraphrase):

> Which numbers should I implement? (e.g. "2, 5" — or say "skip" to stop here.)

If the user replies with numbers, implement them as a normal coding task. If any pick is ambiguous, confirm scope before writing code. If the user says "skip" or signals they are done, end cleanly without further action.

## Output shape (illustrative)

```
Reviewing: the tag picker added in components/series-overview-client.tsx + the suggested-tags rail.

**Gaps**
1. No empty state when the user has zero tags — the rail collapses to nothing with no hint to create one.
2. Suggested tags don't dedupe against tags the user has already applied, so the rail can show stale picks.

**Risks & Loopholes**
3. Tag names have no length cap; a 5000-char tag will break the picker layout and any future SQL queries.
4. There is no rate limit on the suggest endpoint — a user holding down the refresh button burns LLM budget.

**UX Polish**
5. The "+" affordance in the picker isn't keyboard-reachable; tab order skips it.
6. Selected tags don't animate in — they pop, which makes batch-tagging feel jittery.

**Quick Wins**
7. Sort suggested tags by frequency-of-use across the user's history, not alphabetically.

**Future Bets**
8. Tag colors / icons so the rail becomes scannable at a glance.
9. Tag aliases (e.g. "ml" → "machine-learning") so the picker collapses near-duplicates automatically.

> Which numbers should I implement? (e.g. "2, 5" — or say "skip" to stop here.)
```

## When NOT to use this skill

- **Bug fixes** — just fix the bug; ideation is overhead.
- **One-line changes** — the surface area is too small to be worth a categorized review.
- **Code review requests** — use a code-review skill or agent; this is PM scope, not engineering.
- **Architectural decisions** — those need a plan or design doc, not a brainstorm list.
- **Greenfield feature design** — this skill reviews what *exists*, not what *might exist*.
