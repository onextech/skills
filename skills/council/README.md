# council

A Claude Code skill that pressure-tests a decision through a **5-advisor council, anonymous peer review, and a chairman synthesis** — adapted from [Andrej Karpathy's LLM Council methodology](https://x.com/karpathy). Saves a visual HTML briefing report and a full markdown transcript to `docs/council/`.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:council`**.

## What it does

Trigger it with `/onex:council` (or "council this", "war room this", "pressure-test this", "stress-test this", "debate this", or a real decision phrased as "should I X or Y / I'm torn between / validate this / which option"). Claude will:

1. **Scan the workspace** for relevant context (`CLAUDE.md`, `memory/`, prior transcripts, files referenced in the question).
2. **Frame the question** as a neutral prompt embedded with that context.
3. **Convene 5 advisors in parallel** — each leans fully into one thinking style and produces a 150–300 word response.
4. **Run an anonymous peer review** — 5 reviewers see the 5 responses as `A`–`E` (randomized) and answer: *strongest? biggest blind spot? what did all five miss?*
5. **Synthesize a chairman's verdict** — five-section output: agreement / clash / blind spots / recommendation / one thing to do first.
6. **Generate a visual HTML report** at `docs/council/council-report-<ts>.html` and open it.
7. **Save the full transcript** at `docs/council/council-transcript-<ts>.md`.
8. **Reply briefly in chat** — quote only the Recommendation and One-thing-to-do-first; link the artifacts.

## The five advisors

| Advisor | Thinking style | Natural tension |
|---|---|---|
| **The Contrarian** | Looks for what's wrong, what's missing, what will fail. | ⇄ Expansionist |
| **The First Principles Thinker** | Strips the question to its essentials and rebuilds from scratch. | ⇄ Executor |
| **The Expansionist** | Looks for upside everyone else is missing. | ⇄ Contrarian |
| **The Outsider** | Has zero context; responds purely to what's in front of them — catches the curse of knowledge. | (sits in the middle) |
| **The Executor** | Only cares whether it can be done, and what to do Monday morning. | ⇄ First Principles |

## Good council questions

- "Should I launch a $97 workshop or a $497 course?"
- "Which of these 3 positioning angles is strongest?"
- "I'm thinking of pivoting from X to Y. Am I crazy?"
- "Here's my landing page copy. What's weak?"
- "Should I hire a VA or build an automation first?"

## Bad council questions

- "What's the capital of France?" (lookup)
- "Write me a tweet" (creation)
- "Summarize this article" (processing)
- "Should I use markdown?" (no real tradeoff)

The council is for **genuine uncertainty with real stakes**.

## Output files

```
docs/council/council-report-YYYYMMDD-HHMMSS.html    # visual briefing — what the user reads
docs/council/council-transcript-YYYYMMDD-HHMMSS.md  # full transcript — what the next session reads
```

The HTML report is a self-contained single file (inline CSS, no JS) — clean briefing-document styling, an alignment grid showing where advisors aligned/diverged, the chairman's verdict at the top, and collapsible sections for the full advisor responses and peer reviews.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:council`.

## Credits

Adapted from Andrej Karpathy's LLM Council methodology — dispatch the question to multiple models, have them peer-review anonymously, then a chairman synthesizes the final answer. This skill runs the same loop inside Claude using parallel sub-agents with different thinking lenses instead of different models.

## License

MIT
