# ideate

A Claude Code skill that brainstorms gaps, loopholes, and improvement ideas on the work you just built — reviewed through a product manager's lens, returned as a categorized numbered list you can pick from.

Part of the [onex-skills](https://github.com/onexgroup/onex-skills) collection.

## What it does

After you finish a feature, trigger ideate (`/ideate`, or just say "ideate this", "what are we missing", "review as a PM"). Claude will:

1. Figure out **what** you just built — from git diff and session context.
2. Review it as a senior PM — user value, edge cases, gaps, loopholes (not code style).
3. Return a categorized, continuously-numbered list across five buckets:
   - **Gaps** — missing pieces preventing completeness
   - **Risks & Loopholes** — breakage, abuse, data issues
   - **UX Polish** — friction, copy, empty states
   - **Quick Wins** — small adds with outsized impact
   - **Future Bets** — bigger directions for later
4. Ask which numbers to implement, then proceed.

The whole point: turn the vague "what should I improve?" question into a list you can pick from in seconds.

## Install

### Global (Claude Code, all sessions)

```bash
git clone https://github.com/onexgroup/onex-skills ~/code/onex-skills
mkdir -p ~/.claude/skills
ln -sfn ~/code/onex-skills/skills/ideate ~/.claude/skills/ideate
```

### Project-scoped

```bash
mkdir -p .claude/skills
git clone https://github.com/onexgroup/onex-skills /tmp/onex-skills
cp -r /tmp/onex-skills/skills/ideate .claude/skills/ideate
```

Then trigger it in any Claude Code session by saying `ideate`, `/ideate`, or any of the phrases listed in `SKILL.md`'s description.

## Why this exists

Formalizes a prompt that gets reused constantly after building anything non-trivial:

> "Come up with a plan, brainstorm ideas or gaps, looking at this implementation that we have made so far. Review it as a product manager considering any loopholes or gaps or things that we can do better. Give me a list of items numbered off so I can choose which to implement or pursue further in refining this task."

Turning it into a skill makes it:

- **Triggerable in three words** — no retyping the prompt.
- **Consistently scoped** — PM lens only, categorized buckets, continuous numbering.
- **One-shot** — pick numbers, Claude implements.

## License

MIT
