# style-hover-effects

A Claude Code skill that standardizes **hover affordances** across a Next.js app — buttons, links, cards, icon buttons, chips, table rows, and any other interactive surface.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:style-hover-effects`**.

## What it does

Trigger it with `/onex:style-hover-effects` (or "add hover states", "remove the hover bounce", "fix the hover", "the card jumps on hover"). Claude will apply the house contract for hover:

1. **Color, not geometry** — hover shifts background or text color; no `translate`, `scale`, `zoom`, `rotate`, or position changes.
2. **Every interactive element has a hover state** — a clickable thing that doesn't react is a bug.
3. **Defaults per element** — buttons / cards / rows shift background (`hover:bg-muted`), links shift text (`hover:text-primary`), icon buttons do both (`text-muted-foreground hover:text-foreground hover:bg-muted`).
4. **`transition-colors`, never `transition-all`** — scope the transition so layout can never accidentally animate.
5. **Touch + keyboard friendly** — focus ring is preserved; no critical affordance hidden behind hover-only visibility.

## Covers

- The core principle: color shift only, no geometry.
- A defaults table mapping each element type (primary / secondary / ghost button, icon button, card, row, chip, link variants) to its resting + hover treatment.
- Links — color shift; underline-on-hover only inside prose body copy.
- Cards — replacing "lift on hover" with `bg-card → hover:bg-muted`.
- Icon buttons — paired text and surface shift.
- Anti-patterns table — what to remove and what to put in its place.
- Quick-fix recipes for the common complaints.
- Review checklist.

Pairs with [`style`](../style) (the flat-design house style — hover treatments inherit its tokens).

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:style-hover-effects`.

## License

MIT
