# refine-animation

A Claude Code skill that keeps UI animation **subtle, fast, and purposeful**. Use it to add, write, or review motion in a Next.js app.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:refine-animation`**.

## What it does

Trigger it with `/onex:refine-animation` (or "polish the animations", "the dropdown feels slow", "stagger this list", "review my animations"). Claude will:

1. **Confirm scope** and detect the stack: Tailwind v3/v4, `tw-animate-css` / `tailwindcss-animate`, and whether Motion is installed.
2. **Audit** existing motion with targeted greps and list violations as `path:line — rule — fix`.
3. **Fix** motion only. Markup, behavior, and props stay the same.
4. **Run the checklist** on everything touched.

## Covers

- **Easing:** ease-out entrances, ease-in-out moves, no bounce on everyday UI. Shared `ease-enter` / `ease-move` / `ease-exit` tokens.
- **Timing:** 150–250ms for dropdowns and popovers; exits ~20% shorter than entrances.
- **Staggering:** ~30ms per row, capped; container first, then details settle.
- **Press feedback:** `active:scale-[0.97]` / `whileTap`; popovers from 0.95, never 0; no tweening while held.
- **Origin:** popovers, menus, and modals grow from and collapse to their trigger (Radix transform-origin variables); arcs for long moves.
- **Physicality:** ~12% knob stretch, rubber-banding past bounds, success pulses.
- **State transitions:** overlapping states, blurred icon crossfades, clip-path reveals, shared `layoutId` / View Transitions.
- **Reduced motion:** `MotionConfig reducedMotion="user"`, `motion-safe:`, and a global CSS fallback.
- Anti-patterns table, audit greps, and a finishing checklist.

Recipes use Tailwind (`tw-animate-css`) for simple UI and Motion (`motion/react`) for stagger, layout, springs, and drag.

Pairs with [`style-hover-effects`](../style-hover-effects): hover changes color, and press/enter/exit/move belong here.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:refine-animation`.

## License

MIT
