---
description: Audit and refactor the UI of a specified module, feature, or page against an opinionated flat-design system — no shadows, restrained border radii, color-driven (not motion-driven) hover, dark/light-safe color tokens, a consistent landing-page section architecture, scroll-in animations, and house conventions for dialogs, drawers, text areas, and horizontal scroll. (For chat / assistant UIs, see the sibling `/onex:style-chat` skill.) Confirms scope first — asks which module and whether it's the entire app — if the user doesn't name one. Use when the user says "/onex:style", "apply flat UI", "apply my UI guidelines", "clean up the UI", "flatten the design", "make the UI consistent", or asks to bring a module in line with the house style.
---

# /onex:style — Apply the flat-UI house style

`/onex:style` audits and refactors the UI of a module, feature, or page so it conforms to an opinionated **flat design system**: no shadows, restrained radii, color-driven interactions, dark/light-safe tokens, a consistent section architecture, and house conventions for dialogs, drawers, text areas, and scrolling.

It **applies** the guidelines — it edits the files in scope — and reports what changed, grouped by category. It changes styling and structure only; it never alters behavior, copy, or data flow.

> **Chat / assistant UIs are out of scope here.** Several chat conventions are behavioral, not cosmetic, so they live in a sibling skill: [`/onex:style-chat`](../style-chat). Run that one for chat surfaces, and this one for everything else.

## How to run

### 1. Confirm scope — REQUIRED first step

Establish what you are refactoring before touching anything:

1. **If the user named a module / feature / page** ("/onex:style on the pricing page", "flatten the dashboard"), use it.
2. **Otherwise, detect candidates and ask.** Surface-scan the working tree (`app/*` route segments, `components/*` clusters, `apps/*` in a monorepo) and ask with `AskUserQuestion` — offer 3–5 detected candidates **plus an "entire app" option**. Always include the entire-app choice; the user explicitly wants that on the table.

Wait for the answer. Do not refactor until scope is confirmed.

### 2. Scan the scope

Map the files and components in scope and note which guideline categories actually apply — sections/landing pages, dialogs, drawers, text areas, carousels/horizontal scroll. Skip categories with no surface area. If the scope contains a chat / assistant surface, run [`/onex:style-chat`](../style-chat) for that surface instead of (or alongside) this skill.

### 3. Apply the guidelines

Work through the applicable categories (A–K) and edit the files. While doing so:

- **Create missing shared primitives** rather than repeating fixes: the `useInViewAnimation` hook + `fadeInUp` CSS, a `scrollbar-hide` utility, a `Container` component/class. Build each once, reuse everywhere.
- **Use `cn()`** to merge classes; prefer editing toward the project's existing tokens and components.
- **Phase large scope.** For "entire app" or a big module, go component-by-component (or sub-module by sub-module); for very large scope, write a short plan to `docs/` first and commit per phase.
- **Preserve behavior.** This is a styling/structure refactor — same markup semantics, same content, same props (except where a guideline explicitly adds one, e.g. `className`).
- Run typecheck/build after a phase; fix what you broke.

### 4. Report

Close with a summary grouped by category (A–K), each item naming the files touched — e.g. "**A. Flat surfaces** — removed `shadow-lg` from 6 cards in `components/pricing/*`". Flag anything you intentionally skipped and why.

---

## The guidelines

### A. Flat surfaces — shadows, borders, radius

- **No shadows.** Never `shadow-lg` (or `shadow-xl`/`shadow-2xl`). Avoid shadows generally; if elevation is genuinely unavoidable, `shadow-sm` is the ceiling.
- **Cards have no shadow and no border.** Separate a card from its background with a surface color (`bg-card`, `bg-muted`) and spacing — not a `border` or a shadow.
- **No `border` on buttons** — except a **secondary** button, where a border is its defining trait.
- **Restrained radius.** Avoid `rounded-xl` and larger (`rounded-2xl`, `rounded-3xl`). Stay on the theme radius — `rounded-md` / `rounded-lg` — and keep it consistent across the module.

### B. Hover & motion

- **Hover changes color, not geometry.** Use background-color shifts (`hover:bg-muted`, `hover:bg-accent`) as the default hover affordance.
- **No motion-based hover.** No `hover:translate-*`, `hover:-translate-y-*`, `hover:scale-*`, `hover:zoom`, or position changes — on anything, and especially not on images or cards.
- Hover should feel like a state change, never like the element moved.

### C. Spacing & gaps

- **Icon buttons grouped together:** `gap-1`. Not tighter (crowded), not looser (disconnected).
- **Icon + text inside a single button:** `gap-1` — this is the maximum; `gap-1` is the norm.

### D. Color & dark/light theming

The module must be legible in **both** light and dark mode. Hardcoded text colors break this — `text-white` on a dark surface in dark mode becomes invisible.

- **Never hardcode text colors** — no `text-white`, `text-black`, `text-gray-900`, `text-zinc-*`, `text-slate-*`, etc. This matters most on landing-page sections that render under a light/dark toggle.
- **Primary text:** `text-foreground`, or let it inherit.
- **Secondary / meta text:** always `text-muted-foreground`.
- **Text on a colored surface:** use the paired token — `text-primary-foreground` on `bg-primary`, `text-card-foreground` on `bg-card`, etc.
- Use shadcn CSS variables throughout; the theme owns the actual colors.

### E. Links

- **Every link gets a hover affordance** — a link that doesn't react on hover is a bug.
- **Default hover: a color shift toward `text-primary`.** Prefer the color change.
- **Underline on hover** — use it for inline links inside prose/body copy (where the link isn't otherwise obvious). For standalone or nav links, the color shift alone is enough; an underline there is optional.
- No movement on link hover (see Section B).

### F. Section & landing-page architecture

Every landing-page (or marketing) section component follows the same shape:

```tsx
export function FeatureSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        {/* section content */}
      </div>
    </section>
  )
}
```

- **`py`, never `my`, on the outermost `<section>`.** Vertical rhythm is *padding* so the section's background color fills the negative space; margins would leave un-colored gaps.
- **Expose `className` as a prop** and merge it with `cn()`. Components are self-contained — they should not bake in their own outer spacing as the final word; the parent must be able to inject/override. Don't hardcode spacing the parent can't reach.
- **A `container` element is the second node, directly inside `<section>`.** The container owns `max-width` and horizontal centering. Centralize it — a shared `Container` component or a single `.container` class — so max-width is managed in one place and scales consistently across every section and abstraction.

### G. Scroll-in animations (landing pages)

Landing-page sections animate in on scroll. Use one shared mechanism:

- A `useInViewAnimation` hook — `IntersectionObserver`, `threshold: 0.1`, **triggers once** — returns a ref + an `inView` boolean.
- Each animated element is `opacity-0` until in view, then gets `animate-fade-in-up`.
- Stagger children with inline `animationDelay` — `0.1s`, `0.2s`, `0.3s`, …

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up { animation: none; opacity: 1; }
}
```

The `prefers-reduced-motion` block is required — never ship the transform animation without a reduced-motion fallback that lands the element visible.

### H. Dialogs

- **Max-width override must start with `sm:`** — e.g. `sm:max-w-md`. shadcn's base `DialogContent` sets a breakpoint-prefixed width; an unprefixed `max-w-*` loses the specificity battle and gets overwritten.
- **A close (X) is always present, top-right**, and **optically aligned with the dialog title** — same row, vertically centered with the title text. shadcn's default close button floats slightly higher and reads as misaligned. Render a custom header row (`flex items-center justify-between`) holding the title and the right-side action cluster, and suppress the default floating close button so there is exactly one.
- **Content scrolls with CSS.** Structure `DialogContent` as a flex column with a max-height: `DialogHeader` (`shrink-0`), a middle body (`overflow-y-auto`), `DialogFooter` (`shrink-0`). **Never use the shadcn `ScrollArea`.**
- **The footer is pinned.** When content is long enough to scroll, footer buttons stay visible and clickable at all times — only the body scrolls.
- **Extra buttons go to the left of the close X.** If there are several, collapse them into a vertical-ellipsis (`⋮`) dropdown placed just left of the close X. A dropdown nested in a dialog needs the `modal` prop.

### I. Horizontal scroll

- **Hide the horizontal scrollbar** on any element that scrolls sideways — **except real data tables**, which keep theirs.
- Applies to tabs, headers that truncate on small viewports, carousels, and card rails.
- **Carousels / galleries in landing-page sections** must show **no scrollbar at all** — neither horizontal nor vertical.
- Use a shared `scrollbar-hide` utility: `scrollbar-width: none;` plus `&::-webkit-scrollbar { display: none; }`.

### J. Text areas

- **Auto-grow** with content.
- **Min height ≈ 3 rows.** For genuinely short fields (e.g. a bio), 2 rows.
- **Set a max-height** so the textarea stops growing and scrolls internally past that point.
- **If it has a submit/enter affordance:** submit on **⌘/Ctrl + Enter**, and show a `<kbd>⌘ Enter</kbd>` hint on or beside the submit button.

### K. Drawers

For a **full-screen drawer**:

- It covers the **entire screen** — `100dvh` × `100vw`, no inset.
- **No dimmer gap and no drag handle at the top** — it is a true full-screen surface, not a sheet peeking over a dimmed background.
- A **top-right close (X)** is always present, same as a dialog (Section H).
- It **slides up from the bottom**.

### L. Chat UI — moved

Chat / assistant UI conventions now live in the sibling skill **[`/onex:style-chat`](../style-chat)** — input behavior, attachments, message actions, streaming, reasoning accordions, header controls, empty state, follow-up chips, and model routing. Run it whenever the scope contains a chat surface.

---

## Rules

- **Confirm scope first** — module/feature/page, and always offer "entire app". Never guess.
- **Apply, don't just report** — edit the files, then summarize by category.
- **Styling & structure only** — preserve behavior, copy, and data flow.
- **Build shared primitives once** — animation hook, `scrollbar-hide`, `Container` — and reuse them.
- **Phase large scope** — commit per phase; write a plan to `docs/` for entire-app runs.
- **Skip categories with no surface area** — don't invent dialogs or drawers where none exist.
- Merge classes with `cn()`; honor the project's existing tokens and components.

## When NOT to use this skill

- A single one-off styling tweak — just make the change.
- A request that conflicts with these guidelines (e.g. "add a drop shadow to the cards") — follow the user's explicit instruction; this skill is the default house style, not a veto.
- Net-new feature building — design the feature first, then run `/onex:style` to bring it in line.
- Pure logic/bug work with no UI surface.
