---
description: "Add, write, or review UI animation so motion stays subtle, fast, and purposeful. Ease-out for entrances and ease-in-out for moves, no bounce on everyday UI, 150–250ms for dropdowns and popovers, exits ~20% shorter than entrances, ~30ms list stagger, scale to 0.97 on press, popovers from scale 0.95 (never 0), transform-origin at the trigger, arcs for long moves, knob stretch, rubber-banding, success pulses, overlapping state changes, blurred icon crossfades, clip-path reveals, shared-element continuity with layoutId, and prefers-reduced-motion. Recipes target Tailwind (tw-animate-css) for simple UI and Motion (motion/react) for stagger, layout, springs and drag. Use when the user says \"/onex:refine-animation\", \"polish the animations\", \"refine the motion\", \"the dropdown feels slow\", \"the modal pops in wrong\", \"add a press state\", \"stagger this list\", \"animate this\", \"review my animations\", \"the transition feels janky\", or adds or reviews any animation in an interface."
---

# /onex:refine-animation — UI animation polish

`/onex:refine-animation` applies the house rules for motion whenever animation is added, written, or reviewed. The default is **subtle, fast, purposeful**. Motion should explain where a thing came from and where it went, and then get out of the way.

When reviewing existing code, check it against every rule below and fix each violation.

It pairs with [`/onex:style-hover-effects`](../style-hover-effects). That skill owns **hover** (color, never geometry). This skill owns **press, enter, exit, move, and state change**. The two do not conflict: `scale` here is only ever on `:active` / `whileTap`, never on `:hover`.

## Process

1. **Confirm scope.** If the user did not name a module, component, or file, ask which one. Do not sweep the whole app unasked.
2. **Detect the stack** before writing anything:
   - Tailwind v4 (`@import "tailwindcss"` + `@theme` in CSS) or v3 (`tailwind.config.*`).
   - `tw-animate-css` (shadcn on v4) or `tailwindcss-animate` (shadcn on v3). Both give `animate-in` / `fade-in-0` / `zoom-in-95`.
   - Motion: the `motion` package imports from `motion/react`; the older `framer-motion` package imports from `framer-motion`. Use whichever is installed. **Do not install Motion without asking.** If it is absent, use CSS for everything and offer Motion only where CSS cannot do the job (layoutId, drag physics).
3. **Audit** (review mode). Run the greps in [Audit greps](#audit-greps), read each hit, and list violations as a numbered list: `path:line — rule broken — fix`.
4. **Fix** module by module. Change motion only: same markup, same behavior, same props.
5. **Run the [checklist](#checklist-when-finishing)** on everything touched.

## Tokens

Define the curves and durations once and reuse them. Never scatter raw `cubic-bezier(...)` values through components.

```css
/* Tailwind v4 — globals.css */
@theme {
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1); /* ease-out: decelerate into place */
  --ease-move: cubic-bezier(0.65, 0, 0.35, 1); /* ease-in-out: travel A → B */
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);  /* ease-in: accelerate away */
}
```

That gives `ease-enter`, `ease-move`, and `ease-exit` utilities. On v3, add the same three under `theme.extend.transitionTimingFunction`.

For Motion, export matching constants from one module (e.g. `lib/motion.ts`):

```ts
export const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
export const EASE_MOVE = [0.65, 0, 0.35, 1] as const;
export const EASE_EXIT = [0.7, 0, 0.84, 0] as const;

export const DURATION = {
  press: 0.12,
  popoverIn: 0.2,
  popoverOut: 0.16, // ~20% shorter than the entrance
  modalIn: 0.25,
  modalOut: 0.2,
  stagger: 0.03,
} as const;
```

## Easing

- **Ease-out for entrances.** Things appearing on screen decelerate into place: `ease-enter` / `EASE_ENTER`, or plain `ease-out`.
- **Ease-in-out for moves.** Things already on screen that travel from A to B use `ease-move`.
- **No bounce on everyday UI.** Menus, modals, buttons, lists, tabs, and toasts get no spring overshoot. Keep bounce for playful or celebratory moments (a confetti burst, a completed onboarding).

```tsx
// ❌ bouncy menu
<motion.div animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }} />

// ✅ eased menu
<motion.div animate={{ scale: 1 }} transition={{ duration: DURATION.popoverIn, ease: EASE_ENTER }} />

// ✅ a spring is fine for drag release, if it has no overshoot
<motion.div transition={{ type: "spring", bounce: 0, duration: 0.3 }} />
```

## Timing

- **Dropdowns, menus, and small popovers: 150–250ms.** They should feel instant.
- **Exits ~20% shorter than entrances.** The user already decided to dismiss. Examples: 200ms in → 160ms out, 250ms in → 200ms out.
- Modals and sheets can run to ~300ms in. Nothing routine goes over 400ms.

```tsx
// shadcn / Radix popover content with tw-animate-css
className="
  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
  data-[state=open]:duration-200 data-[state=open]:ease-enter
  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
  data-[state=closed]:duration-150 data-[state=closed]:ease-exit
"
```

```tsx
// Motion: give exit its own shorter transition
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.popoverIn, ease: EASE_ENTER } }}
  exit={{ opacity: 0, scale: 0.95, transition: { duration: DURATION.popoverOut, ease: EASE_EXIT } }}
/>
```

## Staggering

- **Stagger list rows by ~30ms.** Not all at once, and not slowly.
- **Cap the stagger.** Only the first ~10 visible rows stagger. The rest come in with the last delay, so a 50-row list never takes 1.5s.
- **Stagger as details settle.** Animate the container first. Then let secondary content (title → metadata → actions) settle in sequence.

```tsx
const list = {
  hidden: {},
  show: { transition: { staggerChildren: DURATION.stagger } },
};
const row = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_ENTER } },
};

<motion.ul variants={list} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={row}>{item.name}</motion.li>
  ))}
</motion.ul>
```

CSS only: set the delay per row and cap it.

```tsx
{items.map((item, i) => (
  <li
    key={item.id}
    className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-enter fill-mode-both"
    style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
  >
    {item.name}
  </li>
))}
```

## Scale & press feedback

- **Scale to 0.97 on press.** Buttons and tappable cards shrink slightly on press. This is `:active` only. Hover stays color-only, per `style-hover-effects`.
- **Start popovers at scale 0.95.** Popovers and menus go 0.95 → 1 with opacity. Never start from `scale: 0`; it reads as a glitch, not as an entrance.
- **Don't tween while held.** During a drag or press-and-hold, follow the pointer directly with no transition. Animate only on release.

```tsx
// Button / tappable card. `transition` (not `transition-all`) covers colors + scale.
className="transition duration-150 ease-enter active:scale-[0.97]"

// Motion
<motion.button whileTap={{ scale: 0.97 }} transition={{ duration: DURATION.press }} />
```

```tsx
// Motion drag already follows the pointer 1:1 and only animates on release.
<motion.div drag="x" dragConstraints={{ left: 0, right: 240 }} dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }} />

// Hand-rolled: no transition while the pointer is down, restore it on release.
className={isDragging ? "transition-none" : "transition-transform duration-200 ease-move"}
```

## Origin & direction

- **Enter from the trigger.** Set `transform-origin` so popovers, menus, and modals grow out of the element that opened them.
- **Exit to the trigger.** On close, collapse back toward the same origin. If the origin is set on the element, the exit animation uses it for free.
- **Arcs for object movement.** Objects that travel a large distance follow a slight curve, not a straight line.

Radix exposes the right origin as a CSS variable on every positioned content component. shadcn ships it; check it was not removed.

```tsx
// Tailwind v4
className="origin-(--radix-popover-content-transform-origin)"
// Tailwind v3
className="origin-[--radix-dropdown-menu-content-transform-origin]"
```

The variable follows the component: `--radix-popover-…`, `--radix-dropdown-menu-…`, `--radix-select-…`, `--radix-tooltip-…`, `--radix-hover-card-…`, `--radix-context-menu-…`, `--radix-menubar-…`.

A centered Dialog has no anchor. Either compute the trigger's position relative to the dialog and set `transform-origin` from it, or morph the trigger into the dialog with `layoutId` (see [State transitions](#state-transitions)).

Arcs: animate `x` and `y` with different curves, so the path bends.

```tsx
<motion.div
  animate={{ x: target.x, y: target.y }}
  transition={{
    x: { duration: 0.4, ease: EASE_MOVE },
    y: { duration: 0.4, ease: EASE_ENTER }, // y settles early, so the path curves
  }}
/>
```

## Physicality

- **Stretch moving knobs ~12%.** Toggle knobs and slider thumbs elongate a little in the direction of travel mid-motion, then settle.
- **Rubber band past bounds.** When a scroll or drag goes past its limit, resist with diminishing movement, then spring back.
- **Pulse to confirm success.** A brief scale or glow pulse signals a completed action (save, copy, submit).

```tsx
// Switch knob: travel + stretch mid-flight
<motion.span
  animate={{ x: checked ? 20 : 0, scaleX: [1, 1.12, 1] }}
  transition={{ duration: 0.2, ease: EASE_MOVE, scaleX: { times: [0, 0.5, 1] } }}
  style={{ originX: checked ? 0 : 1 }} // stretch toward the direction of travel
/>
```

```ts
// Rubber band: diminishing offset past a bound (iOS-style constant 0.55).
export const rubberBand = (overshoot: number, dimension: number, c = 0.55) =>
  (1 - 1 / ((overshoot * c) / dimension + 1)) * dimension;
```

With Motion `drag`, `dragElastic={0.2}` plus `dragConstraints` gives the same resistance and spring-back.

```tsx
// Success pulse after save / copy
<motion.div key={savedAt} animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 0.3, ease: EASE_ENTER }} />
```

## State transitions

- **Overlap old and new states.** Start the incoming state before the outgoing one fully finishes. Never leave a blank gap. In Motion, `AnimatePresence mode="wait"` causes exactly that gap. Prefer `mode="popLayout"` or the default `"sync"`.
- **Crossfade icons with blur.** Swapping icons (copy → check, play → pause) crossfades with a light blur and slight scale, not a hard cut.
- **Masks for reveals and colour.** Use `clip-path` or masks for reveals and colour changes instead of fading whole elements.
- **Reuse the same `layoutId`.** When an element expands into a new view (card → detail), animate it as the same object. Do not replace it with a disconnected new element.

```tsx
// Icon crossfade + blur
<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={copied ? "check" : "copy"}
    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
    transition={{ duration: 0.15, ease: EASE_ENTER }}
  >
    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
  </motion.span>
</AnimatePresence>
```

```css
/* Clip-path reveal: wipes in instead of fading */
.reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 300ms var(--ease-enter);
}
.reveal[data-visible="true"] {
  clip-path: inset(0 0 0 0);
}
```

```tsx
// Shared element: card → detail
<motion.div layoutId={`card-${item.id}`}>{/* card */}</motion.div>
// ...in the detail view
<motion.div layoutId={`card-${item.id}`}>{/* detail */}</motion.div>
```

Without Motion, use the View Transitions API: give both elements the same `view-transition-name` and wrap the state change in `document.startViewTransition(...)`. Feature-detect it and fall back to no animation.

## Reduced motion

Respect `prefers-reduced-motion`. Reduce to opacity-only, or disable.

- **Motion:** wrap the app once in `<MotionConfig reducedMotion="user">`. This turns off transform and layout animation and keeps opacity. Use `useReducedMotion()` for anything custom (drag physics, arcs, pulses).
- **Tailwind:** put movement behind `motion-safe:` (e.g. `motion-safe:active:scale-[0.97]`, `motion-safe:slide-in-from-bottom-1`). Opacity fades can stay.
- **Plain CSS:** a global fallback in `globals.css`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Anti-patterns

| ❌ Found | Why it's wrong | ✅ Replace with |
|---|---|---|
| `type: "spring", bounce: 0.3+` on a menu, modal, or list | Overshoot on everyday UI | `ease: EASE_ENTER`, or a spring with `bounce: 0` |
| `duration-300` / `500` on a dropdown | Feels slow | `duration-200` in, `duration-150` out |
| Exit duration equal to or longer than entrance | Keeps dismissed UI in the way | ~20% shorter exit |
| `scale: 0` / `zoom-in-0` start | Reads as a glitch | `scale: 0.95` + opacity |
| `origin-center` / no origin on a popover | Grows from nowhere | The Radix transform-origin variable |
| `hover:scale-*` / `whileHover={{ scale }}` | Geometry on hover; breaks `style-hover-effects` | `active:scale-[0.97]` / `whileTap` + a hover color shift |
| `transition-all` | Animates layout by accident | `transition`, `transition-colors`, or `transition-transform` |
| `AnimatePresence mode="wait"` on a swap | Blank gap between states | `mode="popLayout"` or `"sync"` |
| Hard icon swap (`{copied ? <Check/> : <Copy/>}`) | Abrupt cut | Blurred crossfade |
| Tweening a dragged element's position | Lags behind the pointer | Follow the pointer directly; animate on release |
| Whole list animates at once, or 100ms+ per row | No rhythm, or too slow | ~30ms stagger, capped at ~10 rows |
| Card → detail mounts a new element | Breaks continuity | Shared `layoutId` / `view-transition-name` |
| No reduced-motion handling | Accessibility failure | `MotionConfig reducedMotion="user"` / `motion-safe:` |

## Audit greps

Run from the scoped directory. Each hit is a candidate. Read it before calling it a violation.

```bash
rg -n 'transition-all' .
rg -n 'duration-(300|500|700|1000)|duration:\s*0?\.[3-9]|duration:\s*[1-9]' .
rg -n 'bounce|type:\s*"spring"|stiffness|damping|animate-bounce' .
rg -n 'scale:\s*0[,\s}]|zoom-in-0|scale-0' .
rg -n 'hover:scale|hover:-?translate|whileHover' .
rg -n 'mode="wait"' .
rg -n 'transform-origin|origin-' .
rg -n 'prefers-reduced-motion|motion-safe|motion-reduce|reducedMotion|useReducedMotion' .
```

The last grep should return hits. No hits means reduced motion is not handled anywhere.

## Checklist when finishing

- [ ] Entrances ease-out, moves ease-in-out, no gratuitous bounce.
- [ ] Small UI durations 150–250ms; exits shorter than entrances.
- [ ] Transform origins point at triggers.
- [ ] Press states, stagger, and shared-element continuity present where relevant.
- [ ] No `scale` or `translate` on hover; no `transition-all`.
- [ ] State swaps overlap; no blank gaps.
- [ ] `prefers-reduced-motion` respected: opacity-only or disabled.

## When NOT to use this skill

- Hover states only: use [`/onex:style-hover-effects`](../style-hover-effects).
- A hero or marketing animation with deliberate design sign-off: that is a design decision, not a default.
- Loading skeletons and spinners: use the `loading-states` skill if installed.
- Pure logic or bug work with no UI surface.
