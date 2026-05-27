---
description: Style hover affordances across a Next.js app — every interactive element (button, link, card, icon button, chip, row) gets a hover state, hover changes **color, not geometry** (no `translate`, `scale`, `zoom`, `rotate`, or position shifts), the default treatment is a background-color shift toward `bg-muted` / `bg-accent` or a text-color shift toward `text-primary`, links use a color shift (with `underline-on-hover` only for inline prose links), and icons follow `text-muted-foreground → hover:text-foreground`. Use when the user says "/onex:style-hover-effects", "add hover states", "the buttons / links / cards don't react", "remove the hover bounce / lift / scale / translate", "fix the hover", "hover feels too much", "the card jumps on hover", or asks how hover should look and behave in the house style.
---

# /onex:style-hover-effects — Hover affordances, the flat way

`/onex:style-hover-effects` standardizes how **hover** looks and behaves across a Next.js app — buttons, links, cards, icon buttons, chips, table rows, and any other interactive surface.

It pairs with [`/onex:style`](../style) (the flat-design house style). Use the same flat tokens — `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-accent`, `text-primary`, `border` — and the same rules: no shadows, restrained radii. This skill is the *interaction* contract: how the surface reacts when the cursor enters.

It changes styling only — same markup, same behavior, same props.

## When to use

- Adding hover states to a module that has none.
- Ripping out hover animations (translate / scale / zoom / rotate / lift).
- Standardizing inconsistent hover treatments across a codebase.
- Fixing "the card jumps on hover" / "the button moves" / "the link doesn't react" complaints.
- Bringing hover behavior in line with the flat house style.

## Golden rules

1. **Hover changes color, not geometry.** Background-color or text-color shifts only — never position, size, rotation, or skew.
2. **Every interactive element gets a hover affordance.** A clickable thing that doesn't react on hover is a bug.
3. **Background shift for surfaces (buttons, cards, rows). Color shift for text (links, icons).**
4. **Use `transition-colors`, never `transition-all`** — the transition is scoped to color so a future refactor can't accidentally animate layout.
5. **Hover should feel like a state change, never like the element moved.**

## The core principle: color, not geometry

```tsx
// ❌ NEVER — motion on hover
className="hover:scale-105"
className="hover:-translate-y-1"
className="hover:translate-x-0.5"
className="hover:rotate-2"
className="hover:zoom-105"

// ✅ ALWAYS — color on hover
className="hover:bg-muted"          // surface
className="hover:bg-accent"         // surface (slightly stronger)
className="hover:text-primary"      // text/icon
className="hover:text-foreground"   // muted → strong text/icon
```

No movement at all — on anything, and **especially** on images and cards. A "lift on hover" card is the single most common house-style violation; replace it with a background shift on the card surface or its sibling token (`bg-card → hover:bg-muted`).

## Defaults per element type

| Element | Resting | Hover | Transition |
|---|---|---|---|
| **Primary button** | `bg-primary text-primary-foreground` | `bg-primary/90` (or `hover:bg-primary/90`) | `transition-colors` |
| **Secondary button** (bordered) | `border bg-background` | `bg-muted` | `transition-colors` |
| **Ghost / nav button** | `bg-transparent` | `bg-muted` | `transition-colors` |
| **Icon button** | `text-muted-foreground` | `text-foreground` + `bg-muted` | `transition-colors` |
| **Card / list item** | `bg-card` (or `bg-background`) | `bg-muted` | `transition-colors` |
| **Table row** | `bg-background` | `bg-muted/50` | `transition-colors` |
| **Chip / pill** | `border bg-background` | `bg-muted` | `transition-colors` |
| **Inline link (prose)** | `text-primary` | `text-primary underline` (color stays, underline appears) | `transition-colors` |
| **Standalone / nav link** | `text-foreground` | `text-primary` | `transition-colors` |
| **Muted text link** | `text-muted-foreground` | `text-foreground` | `transition-colors` |

Pick the row that fits the element; don't invent a fresh treatment per component.

## Links

- **Every link gets a hover affordance** — a link that doesn't react on hover is a bug.
- **Default hover: a color shift toward `text-primary`.** Prefer the color change.
- **Underline on hover** — use it for **inline links inside prose / body copy** (where the link wouldn't otherwise be obvious). For **standalone** or **nav** links, the color shift alone is enough; an underline there is optional and usually noise.
- **No movement on link hover** — same rule as everything else.

```tsx
// inline prose link
<a className="text-primary hover:underline transition-colors">…</a>

// standalone / nav link
<a className="text-foreground hover:text-primary transition-colors">…</a>
```

## Cards

The biggest source of "lift on hover" code in the wild. The flat replacement:

```tsx
// ❌ BAD — geometry-based hover
<div className="rounded-lg bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">

// ✅ GOOD — color-based hover
<div className="rounded-lg bg-card p-6 transition-colors hover:bg-muted">
```

If the card is purely informational and **not** clickable, it doesn't need a hover state — don't invent one. Hover signals interactivity; a non-interactive card hovering "for polish" is a lie.

## Icon buttons

A standalone icon (close, copy, delete, ⋮) carries its color in the icon and gets a subtle surface shift behind it:

```tsx
<button
  className="inline-flex h-8 w-8 items-center justify-center rounded-md
             text-muted-foreground transition-colors
             hover:text-foreground hover:bg-muted"
>
  <X className="h-4 w-4" />
</button>
```

Two things move together: the icon goes muted → strong, and a soft surface appears under it. Never grow / shrink the icon on hover.

## Transitions

- Always `transition-colors` — scoped to color so a stray layout property can't be accidentally animated.
- Never `transition-all` — it makes every future style change a potential motion bug.
- Duration: the Tailwind default (`150ms`) is correct. Don't override unless you have a real reason.
- Easing: the default (`cubic-bezier(0.4, 0, 0.2, 1)`) is fine.

## Accessibility & reduced motion

- Since the house hover is color-only, **`prefers-reduced-motion` mostly self-resolves** — there is no transform to suppress. If you ever add a non-color transition (e.g. an accordion open/close), gate it on `prefers-reduced-motion: no-preference`.
- **Don't remove the focus ring** when overriding hover. `:focus-visible` and `:hover` are different states and both must remain visible — keyboard users rely on the ring.
- **Touch devices have no hover** — never put critical affordances (visibility of an action, the answer to "is this clickable?") behind hover alone. The resting state must already read as interactive (cursor, color contrast, label).

## Anti-patterns

| Pattern | Why it's wrong | Fix |
|---|---|---|
| `hover:scale-105` on a card | Geometry shift; reads as "lift" | `hover:bg-muted` |
| `hover:-translate-y-1` on an image | Image hops; jarring | Drop it; let the surrounding card surface hover |
| `hover:rotate-3` on an icon | Cuteness ≠ affordance | Color shift only |
| `transition-all` | Animates *everything* including layout | `transition-colors` |
| `hover:shadow-lg` | Shadows are out per `/onex:style` §A | `hover:bg-muted` |
| Hover with no transition | Snaps; feels broken | Add `transition-colors` |
| No hover on a clickable thing | Looks dead | Apply the row from the defaults table |
| Hover-only action visibility on touch | Invisible on mobile | Resting state must convey interactivity |

## Quick fix recipes

**"This card jumps when I hover it."**
Remove `hover:scale-*` / `hover:-translate-y-*` / `hover:shadow-*`. Add `transition-colors hover:bg-muted`.

**"My buttons don't react."**
Pick the row from the defaults table that matches the variant. Most ghost/secondary buttons want `hover:bg-muted`.

**"The link is invisible until you hover."**
Resting state needs to read as a link. Either keep `text-primary` at rest (inline prose) or rely on context (standalone nav). The hover is the *secondary* affordance, not the only one.

**"Icons don't feel clickable."**
Wrap them in a `<button>` and apply the icon-button row: `text-muted-foreground hover:text-foreground hover:bg-muted`.

## Review checklist

- [ ] Every clickable surface (button, link, card, row, chip, icon button) has a hover state.
- [ ] No `hover:translate-*`, `hover:scale-*`, `hover:rotate-*`, `hover:zoom-*`, or `hover:-translate-*` anywhere in scope.
- [ ] No `hover:shadow-*` (shadows are out per `/onex:style` §A).
- [ ] Transitions use `transition-colors`, not `transition-all`.
- [ ] Buttons / cards / rows: background shift (`hover:bg-muted` / `hover:bg-accent`).
- [ ] Standalone / nav links: text-color shift toward `text-primary`.
- [ ] Inline prose links: color stays, `hover:underline` appears.
- [ ] Icon buttons: `text-muted-foreground hover:text-foreground hover:bg-muted`.
- [ ] Focus ring is preserved alongside hover (keyboard users).
- [ ] No critical action is hover-only-visible (touch devices have no hover).

## When NOT to use this skill

- A non-interactive element (a static heading, a non-clickable card) — don't invent a hover state.
- A surface explicitly meant to be motion-driven (a hero animation, a deliberate marketing micro-interaction with sign-off) — that's a design decision, not a default.
- Pure logic / bug work with no UI surface.
