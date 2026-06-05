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
2. **Every interactive element gets a hover affordance AND `cursor-pointer`.** A clickable thing that doesn't react on hover — or that shows the default arrow cursor — is a bug. Tailwind v3 / shadcn preflight resets `<button>` to `cursor: default`, so you must add `cursor-pointer` explicitly. See the **Cursor: every button needs cursor-pointer** section below.
3. **Background shift for surfaces (buttons, cards, rows). Color shift for text (links, icons).**
4. **Use `transition-colors`, never `transition-all`** — the transition is scoped to color so a future refactor can't accidentally animate layout.
5. **Hover should feel like a state change, never like the element moved.**
6. **Never co-locate `style={{ backgroundColor }}` with `hover:bg-*` on the same element.** Inline style wins on `:hover` and the hover class is dead. Same for `color` / `borderColor`. See the **Specificity gotcha** section below.

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

Every interactive row below also gets `cursor-pointer` (omitted from the table for brevity — see the **Cursor** section).

| Element | Resting | Hover | Transition |
|---|---|---|---|
| **Primary button** | `cursor-pointer bg-primary text-primary-foreground` | `bg-primary/90` (or `hover:bg-primary/90`) | `transition-colors` |
| **Secondary button** (bordered) | `cursor-pointer border bg-background` | `bg-muted` | `transition-colors` |
| **Ghost / nav button** | `cursor-pointer bg-transparent` | `bg-muted` | `transition-colors` |
| **Icon button** | `cursor-pointer text-muted-foreground` | `text-foreground` + `bg-muted` | `transition-colors` |
| **Tab (Link or button)** | `cursor-pointer` + variant per active | active: stronger of the same tint · inactive: `bg-muted` | `transition-colors` |
| **Card / list item (clickable)** | `cursor-pointer bg-card` (or `bg-background`) | `bg-muted` | `transition-colors` |
| **Table row** | `bg-background` (add `cursor-pointer` only if the whole row is clickable) | `bg-muted/50` | `transition-colors` |
| **Chip / pill (clickable)** | `cursor-pointer border bg-background` | `bg-muted` | `transition-colors` |
| **Pseudo-tab `<label>` wrapping hidden radio** | `cursor-pointer` + variant per checked | active: stronger tint · inactive: `bg-muted` | `transition-colors` |
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
  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md
             text-muted-foreground transition-colors
             hover:bg-muted hover:text-foreground"
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

## Cursor: every button needs `cursor-pointer`

**Tailwind v3 / shadcn preflight resets `<button>` to `cursor: default`.** This is by design (they argue the browser default is wrong) but it means every interactive `<button>` you ship looks dead until you opt back in. Links keep the pointer cursor; buttons do not.

```tsx
// ❌ button hovers but the cursor stays as an arrow — looks broken
<button className="rounded-md bg-[#066377] text-white hover:bg-[#055266]">Add</button>

// ✅ pointer + hover together — feels alive
<button className="cursor-pointer rounded-md bg-[#066377] text-white hover:bg-[#055266]">Add</button>
```

### When to add it

- **Every `<button>`** in your codebase, full stop. No exceptions for primary / secondary / icon / tab buttons. This includes `<button>` styled as a tab via `aria-current`.
- **Every `<a>` / `<Link>` that's styled as a button** (`rounded-md border …` etc.). Native `<a>` already gets the pointer from the browser, but it doesn't hurt to be explicit, and the rule is easier to enforce uniformly.
- **`<label>` elements that wrap a hidden radio/checkbox** and act like a pseudo-button (e.g. audience pills, tab strips) — these don't get pointer by default either.
- **Card-style `<div>` / `<form>` wrappers** that the whole card is clickable on — add `cursor-pointer` to the wrapper.

### When NOT to add it

- `disabled:cursor-not-allowed` (or just letting `disabled` flip the cursor via the browser) for disabled states. The disabled cursor should beat the pointer cursor — list `cursor-pointer` first so `disabled:cursor-not-allowed` wins in source order.
- Truly non-interactive surfaces (badges, pills, static cards) — don't lie about interactivity.

### Quick checklist

- [ ] Every `<button>` in the file has `cursor-pointer` (grep for `<button` and verify).
- [ ] Every `<a>` / `<Link>` styled as a button has `cursor-pointer`.
- [ ] Every `<label>` wrapping a hidden radio/checkbox (pseudo-tabs) has `cursor-pointer`.
- [ ] Disabled-state cursor is `disabled:cursor-not-allowed` and appears AFTER `cursor-pointer` in the class string.

## Specificity gotcha: inline `style` beats every Tailwind `hover:` class

This is the **single most common silent failure** of "I added a hover but it doesn't work." If a component sets a color on the element via `style={{ backgroundColor: ... }}` (or `color`, `borderColor`), **a Tailwind `hover:bg-*` / `hover:text-*` / `hover:border-*` class on the same element will never activate.** Inline styles have the highest CSS specificity; the `:hover` selector on a class can never override them.

```tsx
// ❌ hover is dead — `style.backgroundColor` beats `hover:bg-[#055266]`
<button
  className="rounded-md transition-colors hover:bg-[#055266]"
  style={{ backgroundColor: "#066377", color: "white" }}
/>

// ✅ hover works — color is in the class, nothing fights `:hover`
<button className="rounded-md bg-[#066377] text-white transition-colors hover:bg-[#055266]" />
```

The same trap applies to `bg-white`, `bg-transparent`, even `borderColor` — if the resting value is inline, no `hover:*` Tailwind class on that property will fire.

### How to spot it

Grep the file for both patterns on the same element:
- `style={{ ... backgroundColor` (or `color`, `borderColor`)
- `hover:bg-` / `hover:text-` / `hover:border-`

If both appear on the same element, the hover is dead. This is the first thing to check when a user reports "hover doesn't work" — don't assume the class is misspelled or the transition is missing.

### Fixes (pick one, in order of preference)

1. **Preferred: move the color into a Tailwind class.** Use arbitrary values (`bg-[#066377]`, `text-[#154359]`, `border-[#15435933]`) for non-token colors. Delete the matching property from `style`. Now `hover:bg-...` works because nothing else is setting `background-color` at higher specificity.

2. **Dynamic color (prop with many possible values, not a small variant set):** use `onMouseEnter` / `onMouseLeave` to mutate the inline `style.backgroundColor` directly. JS-driven inline mutation works because it replaces the inline value at the source; `transition-colors` still animates it.

   ```tsx
   const DARKER: Record<string, string> = {
     "#066377": "#055266",
     "#B91C1C": "#9A1818",
   };
   <button
     className="transition-colors"
     style={{ backgroundColor: colour }}
     onMouseEnter={(e) => {
       e.currentTarget.style.backgroundColor = DARKER[colour] ?? colour;
     }}
     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colour; }}
   />
   ```

3. **CSS-in-JS with `&:hover`** (styled-components, emotion, vanilla-extract) — selector-based hover works because the library generates real CSS rules, not inline `style`. Verify in DevTools that the resting color comes from a class, not `style`.

### Don't

- Don't add `!important` to a Tailwind hover class to win the specificity fight. It works but signals the styling architecture is wrong; the next dev will copy the pattern and the codebase rots.
- Don't pretend `:hover` inline-style hacks exist — there's no such thing. You need option 1, 2, or 3.

## Anti-patterns

| Pattern | Why it's wrong | Fix |
|---|---|---|
| `<button>` without `cursor-pointer` | Tailwind v3 / shadcn preflight resets button cursor to `default` — looks dead | Add `cursor-pointer` (see the Cursor section above). |
| `style={{ backgroundColor: ... }}` + `hover:bg-*` on same element | **Inline style always wins on `:hover`; the hover class is dead.** | Move color into a Tailwind class (option 1), or mutate inline style via `onMouseEnter`/`onMouseLeave` (option 2) — see the specificity-gotcha section above. |
| `style={{ color: ... }}` + `hover:text-*` on same element | Same — inline wins | Move color to class. |
| `style={{ borderColor: ... }}` + `hover:border-*` on same element | Same — inline wins | Move border color to class (e.g. `border-[#15435933]`). |
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

**"My buttons don't react / the cursor stays as an arrow."**
Two things to check in order:
1. **Cursor**: does the `<button>` have `cursor-pointer`? Tailwind v3 / shadcn preflight resets it, so you must opt in. See the Cursor section.
2. **Specificity gotcha**: grep the file for `style={{` on the same element as the `hover:bg-*` class. If they're co-located, the inline style is killing the hover (see the specificity-gotcha section).

If both are clean, pick the row from the defaults table that matches the variant. Most ghost/secondary buttons want `hover:bg-muted`.

**"The link is invisible until you hover."**
Resting state needs to read as a link. Either keep `text-primary` at rest (inline prose) or rely on context (standalone nav). The hover is the *secondary* affordance, not the only one.

**"Icons don't feel clickable."**
Wrap them in a `<button>` and apply the icon-button row: `text-muted-foreground hover:text-foreground hover:bg-muted`.

## Review checklist

- [ ] **Every `<button>` has `cursor-pointer`** — Tailwind v3 / shadcn preflight resets button cursor to default. Same for `<a>` / `<Link>` / `<label>` / `<div>` that acts as a button.
- [ ] **No element has both `style={{ backgroundColor: ... }}` AND `hover:bg-*`** — inline style kills the hover. Same for `color` + `hover:text-*` and `borderColor` + `hover:border-*`.
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
