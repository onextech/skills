# style

A Claude Code skill that audits and refactors the UI of a module against an opinionated **flat-design house style** — no shadows, restrained radii, color-driven interactions, dark/light-safe tokens, and consistent conventions for sections, dialogs, drawers, text areas, and scrolling. (Chat / assistant UIs are covered separately by the sibling [`style-chat`](../style-chat) skill.)

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:style`**.

## What it does

Trigger it with `/onex:style` (or "apply flat UI", "apply my UI guidelines", "clean up the UI", "flatten the design"). Claude will:

1. **Confirm scope first** — if you didn't name a module/feature/page, it lists detected candidates and asks you to pick, always including an **"entire app"** option.
2. **Scan the scope** — maps the components and works out which guideline categories actually apply.
3. **Apply the guidelines** — edits the files, builds shared primitives once (animation hook, `scrollbar-hide`, `Container`), and phases large scope commit-by-commit.
4. **Report** — a summary grouped by category, naming the files touched.

## The guideline categories

- **A. Flat surfaces** — no shadows, no `shadow-lg`; cards have no shadow/border; no `rounded-xl`+; buttons borderless unless secondary.
- **B. Hover & motion** — hover changes color, never geometry; no `translate`/`scale`/`zoom` on hover.
- **C. Spacing & gaps** — `gap-1` for icon-button groups and icon+text inside buttons.
- **D. Color & theming** — no hardcoded text colors; `text-foreground` / `text-muted-foreground` / paired tokens for dark/light safety.
- **E. Links** — always a hover affordance, preferring a color shift to `primary`.
- **F. Section architecture** — `py` not `my`, a `className` prop merged with `cn()`, a centralized `container`.
- **G. Scroll-in animations** — shared `useInViewAnimation` hook + `fadeInUp`, staggered, with a reduced-motion fallback.
- **H. Dialogs** — `sm:`-prefixed width, close X aligned with the title, CSS scroll (no `ScrollArea`), pinned footer, overflow buttons in a `⋮` menu.
- **I. Horizontal scroll** — hidden scrollbars (except tables) for tabs, carousels, truncated headers.
- **J. Text areas** — auto-grow, min ~3 rows, max-height with inner scroll, ⌘+Enter submit with a `kbd` hint.
- **K. Drawers** — true full-screen, top-right close, no top dimmer, slides up from the bottom.

> Chat / assistant UIs — composer behavior, streaming, reasoning accordions, follow-up chips, model routing — live in the sibling [`style-chat`](../style-chat) skill.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:style`.

## License

MIT
