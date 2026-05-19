# ideate

A Claude Code skill that brainstorms gaps, loopholes, and improvement ideas across an **entire module or app** — reviewed through a senior product manager's lens, returned as a thematic, severity-marked, continuously-numbered list you can pick from.

Part of the [onex-skills](https://github.com/onextech/onex-skills) collection.

## What it does

When you're ready to step back and look at a whole module — not just the diff you just shipped — trigger ideate (`/ideate`, or just say "ideate the auth module", "what are we missing in billing", "review the admin panel as a PM"). Claude will:

1. **Confirm scope first** — if you didn't name a module, Claude lists the modules it detected (`auth`, `dashboard`, `admin`, `billing`, etc.) and asks you to pick. No guessing, no defaulting to "the recent diff".
2. **Map the module** — entry points, server actions, data model touchpoints, integrations.
3. **Review as a PM across the full surface** — security, activation, billing, feature gaps, admin UX, public surface, SEO, ops, tests, polish.
4. **Return a thematic, severity-marked list** — lettered sections (A, B, C…) with continuous numbering (1, 2, 3… running through every section). Every item has a severity marker:
   - 🔴 **ship-blocker** — real bug or open security hole
   - 🟡 **strong-recommend** — will bite within the first 20–100 users
   - 🟢 **next-quarter** — makes the product, not just the demo
5. **Close with "my pick for if you do 5 things this week"** — the highest-leverage items called out, with rationale.
6. **Ask which numbers to implement.** If you say "do all the red and yellow items, phase it out" or similar, Claude writes a plan to `docs/` first, then executes phase-by-phase with commits in between.

The whole point: turn the vague "what should I improve across this module?" question into a 25–50 item list you can pick from in seconds, then implement in slices.

## How it's different from a feature ideate or a code review

- **Module-scoped, not diff-scoped.** This is broader than "review what I just built" — it's "review everything this module is responsible for".
- **PM lens, not engineering lens.** No naming nitpicks, no lint, no architecture debates — gaps, loopholes, user-value, abuse vectors, growth, polish.
- **Severity-marked and prioritized.** Every item is 🔴 / 🟡 / 🟢, and the top 5 are called out at the end so you know where to start.
- **Phased implementation by default** when you pick a bucket. "Do all the red and yellow items, phase it out" means: plan written to `docs/`, then commit-per-phase execution.

## Install

### Global (Claude Code, all sessions)

```bash
git clone https://github.com/onextech/onex-skills ~/code/onex-skills
mkdir -p ~/.claude/skills
ln -sfn ~/code/onex-skills/skills/ideate ~/.claude/skills/ideate
```

### Project-scoped

```bash
mkdir -p .claude/skills
git clone https://github.com/onextech/onex-skills /tmp/onex-skills
cp -r /tmp/onex-skills/skills/ideate .claude/skills/ideate
```

Then trigger it in any Claude Code session by saying `ideate`, `/ideate`, `ideate <module>`, or any of the phrases listed in `SKILL.md`'s description.

## Why this exists

Formalizes a prompt that gets reused constantly when stepping back from a module:

> "Come up with a plan, brainstorm ideas or gaps, looking at this implementation that we have made so far. Review it as a product manager considering any loopholes or gaps or things that we can do better. Give me a list of items numbered off so I can choose which to implement or pursue further in refining this task."

Turning it into a skill makes it:

- **Triggerable in three words** — no retyping the prompt.
- **Always module-scoped** — required scope confirmation prevents shallow reviews.
- **Consistently structured** — severity markers, thematic sections, continuous numbering, top-5 pick.
- **One-shot to implementation** — pick numbers (or a severity bucket), Claude plans + executes in phases.

## License

MIT
