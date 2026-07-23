---
description: Build a carousel in a Next.js App Router app. Covers five carousel types — right-peeking (horizontal scroll aligned to the container on the left, bleeding off the right edge), centered-active (focused center card with partial neighbours), autoplay/hero (full-width rotating banner), grid-overflow (multi-row or masonry grid scrolling sideways), and thumbnail-nav (large display with a thumbnail strip). Always elicits the carousel type before building. Includes the shared-gutter CSS custom property technique that makes a carousel align with a centered `max-w-*` container on the left while bleeding to the screen edge on the right, plus scroll-snap, prev/next controls, keyboard and screen-reader access, and a per-type build checklist. Use when the user says "/onex:add-carousel", "add a carousel", "build a slider", "card scroll", "swipeable content strip", "horizontal scroll of cards", "hero banner slider", "image gallery with thumbnails", "the cards should peek off the right edge", or "my carousel doesn't line up with the heading".
---

# /onex:add-carousel — Carousels, five types

A carousel is a horizontally-scrolling or cycling container for cards, images, or content blocks. There is no single "carousel" — the implementation varies substantially between types, and picking the wrong one produces a component that has to be thrown away.

**Always determine the type before writing any code.**

This skill pairs with [`/onex:style`](../style) (flat house style — no shadows, restrained radii, dark/light-safe tokens) and [`/onex:style-hover-effects`](../style-hover-effects) (hover changes color, not geometry). Carousel cards and controls inherit both: **no `hover:scale-*`, no `hover:-translate-y-*`, no `hover:shadow-*` on carousel cards**, and every control gets `cursor-pointer`.

---

## Step 0: Elicit the carousel type

If the user has not specified a type, ask:

> "What kind of carousel are you building? Here are the common types:
>
> 1. **Right-peeking** — Cards scroll horizontally; the first card aligns with the page container, the track bleeds off the right edge so the next card peeks. Best for content sections under a heading (featured articles, product rows).
> 2. **Centered-active** — The active card sits centered on screen; adjacent cards are partially visible on both sides. Best for testimonials, portfolio pieces, single-focus browsing.
> 3. **Autoplay / hero banner** — Full-width rotating slides with optional manual controls. Best for hero sections, promotions, announcements.
> 4. **Grid-overflow** — A multi-row or masonry grid that overflows horizontally. Best for image galleries, media grids.
> 5. **Thumbnail-nav** — A large primary display area with a scrollable thumbnail strip for navigation. Best for product image viewers, photo galleries.
>
> Which fits your use case, or describe what you have in mind?"

Wait for the answer. Do not guess and build — the container strategy, snap alignment, and state model all differ.

## Build it by hand, not with a library

Types 1, 2, 4, and 5 are **native CSS scroll containers** — `overflow-x-auto` plus `scroll-snap`. They need no JavaScript at all unless you add prev/next buttons or an active-index readout. Type 3 (autoplay) is about twenty lines of `useState` + `useEffect`.

Do **not** reach for Embla, Swiper, or the shadcn `Carousel` component by default. They ship a dependency, a JS scroll model that fights native momentum scrolling on iOS, and a container abstraction that makes the right-peek layout in Type 1 harder, not easier. Reach for a library only when the user asks for something genuinely beyond native scroll — infinite loop, free-drag inertia with custom physics, or synchronized multi-track parallax.

**Never use the shadcn `ScrollArea` component here.** It breaks inside dialogs and replaces native scrolling with a JS-driven one. Use `overflow-x-auto` with the `.no-scrollbar` utility below.

---

## Type 1: Right-peeking carousel

A horizontal card carousel that does two things at once:

1. **Aligns its first card** with the page's centered, max-width content container — so the carousel lines up exactly under the section heading.
2. **Bleeds off the right edge** of the screen — the next card is partially cut off ("peeks"), signalling there is more to scroll.

```
│  ┌─────────────────── centered container ───────────────────┐         │
│  │  SECTION HEADING                          See all ›  ‹ ›  │         │
│  └───────────────────────────────────────────────────────────┘        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┄┄┄ bleed │
│  │   card 1   │  │   card 2   │  │   card 3   │  │  card 4   ┄┄┄►      │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┄┄┄       │
│  ▲                                                                    ▲
│  first card aligns with the heading                screen / section edge
```

### The container problem (the crux of this type)

The carousel must satisfy two **contradictory** layout constraints simultaneously:

- Its **left** edge must sit at the centered container's content edge (aligned with the heading).
- Its **right** side must *escape* that container and run to the screen edge.

This is why it is not a trivial component. The obvious approaches all fail:

| Approach | Why it fails |
|---|---|
| Nest the carousel **inside** the centered `max-w-*` container | Trapped on **both** sides — it can never bleed right. |
| Place the carousel full-width and re-derive the container offset with a **separate `calc()` / `padding` formula**, while the header stays centered with `margin: auto` | **Mechanism mismatch.** `margin: auto` centering and `padding` are resolved by different layout passes; they compute the same number but can disagree by a sub-pixel / 1px — visibly misaligned. |
| Use a **percentage** (`100%`, `mx-auto`) inside the carousel's offset | A `%` resolves against the element's **containing block**. If the carousel is nested differently than the header, `100%` does not equal the section width, so the offset is silently wrong. |
| Break out with **negative margins** | The breakout distance depends on the dynamic centering whitespace — fragile and hard to keep in sync. |

### The fix: one shared, position-independent gutter

Compute the gutter **once**, as a **viewport-relative value** (`vw`-based, so it is *position-independent* — the same value anywhere in the tree, regardless of nesting). Store it in a **CSS custom property**. Then have **both** the header container and the carousel track consume it through the **same property** (`padding-left`).

Identical mechanism + identical value = **pixel-identical left edges, guaranteed, at every viewport width.** The carousel then simply **omits `padding-right`**, so it bleeds.

> Key rule: never align two elements by writing two formulas you *believe* are equal. Align them by feeding one shared variable into the **same** CSS property on both.

### 1. The gutter variable (CSS)

The gutter is the distance from the content viewport edge to the centered container's content edge:

```
gutter = max( basePadding , (viewportWidth - maxWidth) / 2 + basePadding )
```

```css
/* globals.css — defined once on a section wrapper; inherited by all descendants. */
.carousel-section {
  /* basePadding 1.5rem == px-6, maxWidth 80rem == max-w-7xl */
  --carousel-gutter: max(1.5rem, (100vw - 80rem) / 2 + 1.5rem);
}
/* Must match the breakpoint + padding used by the real centered container. */
@media (min-width: 640px) { /* sm */
  .carousel-section {
    /* basePadding 2.5rem == px-10 */
    --carousel-gutter: max(2.5rem, (100vw - 80rem) / 2 + 2.5rem);
  }
}
/* Header — a normal centered container: gutter on BOTH sides. */
.carousel-header {
  padding-left: var(--carousel-gutter);
  padding-right: var(--carousel-gutter);
}
/* Track — gutter on the LEFT only. Left edge aligns with the header;
   the right side runs to the section edge (the bleed). */
.carousel-track {
  padding-left: var(--carousel-gutter);
  scroll-padding-left: var(--carousel-gutter); /* snap respects the gutter */
}
/* Hide the scrollbar — there is no built-in Tailwind utility for this. */
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

**`vw` adjustment.** `100vw` is the *browser* viewport. If your app content is not flush to the viewport — e.g. it sits inside an inset frame padded by `C` px on each side — subtract `2C` so the gutter tracks the *content* viewport:

```css
--carousel-gutter: max(2.5rem, (100vw - 40px - 80rem) / 2 + 2.5rem); /* C = 20px */
```

Use `100vw`, **not** `100%`: `%` resolves against the containing block and breaks under nesting; `vw` is constant everywhere.

**Scrollbar caveat.** `100vw` includes the width of a classic (non-overlay) vertical scrollbar, so on Windows/Linux Chrome the gutter can overshoot by the scrollbar width. If the misalignment matters, swap `100vw` for `100dvw` where supported, or set `--carousel-gutter` from a `ResizeObserver` on the real container. In practice the macOS/iOS overlay scrollbar makes this invisible for most apps — don't pre-solve it.

### 2. Markup

```tsx
<section className="carousel-section relative overflow-hidden py-20 sm:py-28">
  {/* Header — its OWN container; padded both sides */}
  <div className="carousel-header">
    <div className="flex items-end justify-between gap-6">
      <h2>Section heading</h2>
      {/* optional: "See all" link + prev/next buttons */}
    </div>
  </div>

  {/* Track — first card aligns with the heading, bleeds off the right */}
  <div
    role="region"
    aria-label="Section heading"
    tabIndex={0}
    className="carousel-track no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2"
  >
    {items.map((item) => (
      <div key={item.id} className="w-[86%] flex-none snap-start sm:w-[440px] lg:w-[560px]">
        <Card item={item} />
      </div>
    ))}
  </div>
</section>
```

- The `<section>` carries **only vertical padding** (`py-*`). Never give it `px-*` — the gutter owns all horizontal spacing.
- `relative overflow-hidden` on the section clips the bleed and prevents a page-level horizontal scrollbar.
- `overscroll-x-contain` stops a horizontal trackpad swipe from triggering browser back-navigation once the track hits its end.
- `tabIndex={0}` + `role="region"` + `aria-label` make the scroll container reachable and scrollable by keyboard. Required if the cards themselves are not focusable; harmless if they are.

### 3. Card sizing — the cards MUST overflow

The carousel only *peeks* if its content is **wider than the track**. With too few or too-small cards on a wide screen, everything fits and nothing bleeds. Size cards (fixed or responsive) so `N cards + gaps` reliably exceeds the available width — large fixed widths (`sm:w-[440px] lg:w-[560px]`) or viewport-relative widths both work. `flex-none` is mandatory so flex never shrinks them to fit.

If the item count is dynamic and can be small, either enforce a minimum card width that guarantees overflow, or fall back to a plain grid when `items.length` is below the count that fills the widest breakpoint. A three-card "carousel" that never scrolls on desktop is worse than a grid.

### Required Tailwind utilities (right-peeking)

**Track element**

| Utility | Purpose |
|---|---|
| `flex` | Lay the cards out in a row. |
| `overflow-x-auto` | Make the row horizontally scrollable. |
| `overscroll-x-contain` | Stop the swipe from chaining to browser back-navigation. |
| `gap-4` (any `gap-*`) | Spacing between cards. |
| `snap-x` `snap-mandatory` | Scroll-snapping along the x axis (optional but recommended). |
| `py-2` | **Critical.** `overflow-x-auto` computes `overflow-y` to `auto` as well, so the track clips vertically — focus rings, `ring-*`, and borders get cut off without vertical padding. |
| `no-scrollbar` | Hide the scrollbar — **custom utility**, see CSS above. |

**Each card wrapper**

| Utility | Purpose |
|---|---|
| `flex-none` (or `shrink-0`) | Keep each card's width fixed; stop flex from shrinking them. |
| `w-[86%]` / `sm:w-[440px]` / `lg:w-[560px]` | Responsive card width (arbitrary values). Must be wide enough to overflow the track. |
| `snap-start` | Snap point — the card's start edge snaps to the track's snap line. |

**Section element**

| Utility | Purpose |
|---|---|
| `relative` | Positioning context. |
| `overflow-hidden` | Contain the bleed; kill page-level horizontal scroll. |
| `py-*` | Vertical padding only — **no `px-*`**. |

**Not Tailwind utilities** (must live in a CSS file): the `--carousel-gutter` variable and the `padding-left` / `padding-right` / `scroll-padding-left` that consume it. These use a `max()` + `vw` formula, so they belong in `globals.css`, not as utility classes.

### Optional: prev / next buttons

Buttons need a `ref` to the track and a little state for end-detection (so they can disable at the limits):

```tsx
"use client";

const trackRef = useRef<HTMLDivElement>(null);
const [canPrev, setCanPrev] = useState(false);
const [canNext, setCanNext] = useState(true);

const sync = useCallback(() => {
  const el = trackRef.current;
  if (!el) return;
  setCanPrev(el.scrollLeft > 8);
  setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
}, []);

useEffect(() => {
  sync();
  window.addEventListener("resize", sync);
  return () => window.removeEventListener("resize", sync);
}, [sync]);

const scroll = (dir: 1 | -1) => {
  trackRef.current?.scrollBy({
    left: dir * trackRef.current.clientWidth * 0.8,
    behavior: "smooth",
  });
};
// <div ref={trackRef} onScroll={sync} className="carousel-track ...">
```

- The component using buttons must be a client component (`"use client"`). Everything else in this type works as a server component — keep the interactive shell thin and pass the cards in as children if the card content is server-rendered.
- Initialise `canNext` to `true` to avoid a flash of a disabled button before the first `sync()`.
- The 8px tolerance absorbs sub-pixel `scrollLeft` values; without it `canNext` flickers at the end.
- Style the buttons per [`/onex:style-hover-effects`](../style-hover-effects) — icon-button row: `cursor-pointer text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`, plus `disabled:cursor-not-allowed disabled:opacity-40` after `cursor-pointer`.
- Give each button an `aria-label` ("Previous items" / "Next items"). An arrow glyph is not a label.

### Build checklist (right-peeking)

- [ ] `--carousel-gutter` defined once; `maxWidth`, `basePadding`, and the `@media` breakpoint **match the real centered container** (`max-w-7xl` = `80rem`, `px-6 sm:px-10` = `1.5rem`/`2.5rem`, `sm` = `640px`).
- [ ] Gutter formula uses `100vw` (not `100%`); `2C` subtracted if the app is inset from the viewport.
- [ ] Header container and track both apply the gutter via `padding-left` — the **same property** (never mix `margin:auto` with `padding`).
- [ ] Track omits `padding-right` so it bleeds.
- [ ] Section has `py-*` only, plus `relative overflow-hidden`. No `px-*` on the section.
- [ ] Cards use `flex-none` and are wide enough that the content overflows the track.
- [ ] Track has `py-*` so focus rings and borders are not clipped by `overflow-x-auto`.
- [ ] Track has `overscroll-x-contain`, `tabIndex={0}`, `role="region"`, and an `aria-label`.
- [ ] `.no-scrollbar` CSS present in `globals.css`.
- [ ] No `hover:scale-*` / `hover:-translate-y-*` / `hover:shadow-*` on the cards.

---

## Type 2: Centered-active carousel

The active card is centered on screen. Partial cards are visible on both sides. Navigation moves one card at a time. Used for testimonials, portfolio spotlights, or any single-focus content.

**Key implementation pattern:**

```tsx
// Track uses scroll-snap-type: x mandatory; cards use snap-center.
// Calculate active index from scrollLeft on scroll event.
// Apply scale/opacity transforms to non-active cards via data attribute.

<div
  ref={trackRef}
  className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
  onScroll={handleScroll}
>
  {items.map((item, i) => (
    <div
      key={item.id}
      data-active={i === activeIndex}
      className="w-[80vw] max-w-xl flex-none snap-center px-4 opacity-40 transition-opacity duration-300 data-[active=true]:opacity-100"
    >
      <Card item={item} />
    </div>
  ))}
</div>
```

**Active index detection:**

```ts
const handleScroll = () => {
  const el = trackRef.current;
  if (!el) return;
  const cardWidth = el.scrollWidth / items.length;
  setActiveIndex(Math.round(el.scrollLeft / cardWidth));
};
```

This runs on every scroll frame. If the card body is expensive, `requestAnimationFrame`-throttle it or move the de-emphasis to CSS-only (`:has()` / scroll-driven animations) so React re-renders drop out of the scroll path entirely.

**Note on scale.** The de-emphasis of inactive cards is the one sanctioned exception to "no geometry" — it is a *scroll-position* transform, not a hover response, and the user drives it directly. Keep it subtle (`scale-95` at most) and prefer opacity alone if the design reads well without it. Hover on these cards still follows the house rule: color only.

**Build checklist (centered-active):**
- [ ] Cards use `snap-center`, not `snap-start`.
- [ ] Track is wide enough (full viewport) so partial cards show on both sides.
- [ ] Non-active cards receive reduced opacity (and optionally a subtle scale) via `data-active`, not inline `style`.
- [ ] Dot indicators or numbered progress synced to `activeIndex`.
- [ ] Any scale de-emphasis is gated behind `motion-safe:` so `prefers-reduced-motion` users get opacity only.
- [ ] `"use client"` on the component (it holds scroll state).

---

## Type 3: Autoplay / hero banner

Full-width rotating slides. Controls (prev/next, dots) are optional. Touch/swipe support expected on mobile.

**Key implementation pattern:**

```tsx
"use client";

const [current, setCurrent] = useState(0);
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (paused) return;
  const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
  return () => clearInterval(id);
}, [paused, slides.length]);

<div
  className="relative overflow-hidden"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
  aria-roledescription="carousel"
>
  <div
    className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {slides.map((slide, i) => (
      <div
        key={slide.id}
        className="w-full flex-none"
        aria-hidden={i !== current}
        role="group"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${slides.length}`}
      >
        <Image src={slide.src} alt={slide.alt} fill sizes="100vw" className="object-cover" />
      </div>
    ))}
  </div>

  {/* Dot indicators */}
  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
    {slides.map((slide, i) => (
      <button
        key={slide.id}
        onClick={() => setCurrent(i)}
        aria-label={`Go to slide ${i + 1}`}
        aria-current={i === current}
        className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
          i === current ? "bg-white" : "bg-white/50 hover:bg-white/80"
        }`}
      />
    ))}
  </div>
</div>
```

The `translateX` here is inline because it is a computed per-render value — that is fine. It does **not** conflict with the hover rule; it is the carousel's own transport, not a hover response. Just never co-locate an inline `backgroundColor`/`color` with a `hover:bg-*`/`hover:text-*` class on the dots (see [`/onex:style-hover-effects`](../style-hover-effects) — inline style kills the hover).

**Build checklist (autoplay):**
- [ ] `clearInterval` on unmount to prevent memory leaks.
- [ ] Autoplay pauses on hover **and** on keyboard focus within the carousel (`onFocus` / `onBlur`), so keyboard users aren't yanked mid-read.
- [ ] Autoplay is disabled entirely under `prefers-reduced-motion: reduce` — auto-advancing content is a vestibular trigger. Check it with `window.matchMedia("(prefers-reduced-motion: reduce)")`.
- [ ] Touch swipe: track `touchstart` and `touchend` delta to advance slides.
- [ ] `aria-label` on prev/next and dot buttons; `aria-roledescription="carousel"` on the region; `aria-hidden` on off-screen slides so screen readers don't read all of them.
- [ ] Images use a fixed aspect-ratio container (`aspect-video` / `aspect-[21/9]`) with `object-cover`, and `next/image` with `fill` + `sizes="100vw"`. Give the first slide `priority` — it is almost always the LCP element.
- [ ] `cursor-pointer` on every control.

---

## Type 4: Grid-overflow carousel

A multi-row grid that overflows horizontally, or a masonry-style layout that the user can scroll sideways. Used for image galleries, media grids.

**Key implementation pattern:**

```tsx
<div
  role="region"
  aria-label="Gallery"
  tabIndex={0}
  className="no-scrollbar overflow-x-auto overscroll-x-contain pb-4"
>
  <div className="grid auto-cols-[280px] grid-flow-col grid-rows-2 gap-3">
    {items.map((item) => (
      <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg">
        <Image src={item.src} alt={item.alt} fill sizes="280px" className="object-cover" />
      </div>
    ))}
  </div>
</div>
```

**Build checklist (grid-overflow):**
- [ ] `grid-flow-col` so items flow into columns, not rows.
- [ ] `auto-cols-[*]` sets column width; `grid-rows-*` sets how many rows before a new column starts.
- [ ] Outer wrapper has `overflow-x-auto`, `overscroll-x-contain`, and `no-scrollbar`.
- [ ] Wrapper does **not** have a fixed width — let it size to the viewport.
- [ ] Wrapper is keyboard-scrollable (`tabIndex={0}` + `role="region"` + `aria-label`) when the tiles aren't links.
- [ ] Image tiles use `next/image` with `fill` + a `sizes` value matching `auto-cols-[*]`.

---

## Type 5: Thumbnail-nav carousel

A large primary display area (image or video) with a scrollable thumbnail strip below for navigation. Used for product PDPs, photo galleries, real estate listings.

**Key implementation pattern:**

```tsx
"use client";

const [active, setActive] = useState(0);

<div>
  {/* Main display */}
  <div className="relative aspect-video overflow-hidden rounded-xl">
    <Image
      src={items[active].src}
      alt={items[active].alt}
      fill
      sizes="(min-width: 1024px) 60vw, 100vw"
      priority
      className="object-cover"
    />
  </div>

  {/* Thumbnail strip */}
  <div
    role="tablist"
    aria-label="Image thumbnails"
    onKeyDown={handleKeyDown}
    className="no-scrollbar mt-3 flex gap-2 overflow-x-auto overscroll-x-contain py-1"
  >
    {items.map((item, i) => (
      <button
        key={item.id}
        role="tab"
        aria-selected={i === active}
        aria-label={`Image ${i + 1} of ${items.length}`}
        tabIndex={i === active ? 0 : -1}
        onClick={() => setActive(i)}
        className={`relative h-16 w-24 flex-none cursor-pointer overflow-hidden rounded-lg ring-2 transition-colors ${
          i === active ? "ring-primary" : "ring-transparent hover:ring-border"
        }`}
      >
        <Image src={item.src} alt="" fill sizes="96px" className="object-cover" />
      </button>
    ))}
  </div>
</div>
```

**Keyboard navigation** — arrow keys move the active index, and the newly active thumbnail scrolls into view:

```ts
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  e.preventDefault();
  const next = e.key === "ArrowRight"
    ? Math.min(active + 1, items.length - 1)
    : Math.max(active - 1, 0);
  setActive(next);
  stripRef.current?.children[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
};
```

Use `block: "nearest"` — without it, `scrollIntoView` scrolls the whole *page* vertically to reach the strip.

**Build checklist (thumbnail-nav):**
- [ ] Active thumbnail highlighted with a ring (`ring-primary`), not a shadow or a transform.
- [ ] Main image transitions smoothly on change (opacity fade or crossfade), or swaps instantly — never a layout jump. The container holds the aspect ratio so height is stable.
- [ ] Thumbnail strip scrollable but no visible scrollbar; `py-1` so the active ring isn't clipped.
- [ ] Keyboard navigation: arrow keys advance the active index and scroll the thumbnail into view.
- [ ] Roving `tabIndex` (`0` on active, `-1` on the rest) so Tab enters the strip once, not once per thumbnail.
- [ ] Thumbnail `<img>` has `alt=""` (decorative — the button carries the label); the main image carries the real `alt`.
- [ ] If video is supported, detect `item.type === "video"` and swap the image for `<video autoPlay muted loop playsInline>`.
- [ ] `cursor-pointer` on every thumbnail button.

---

## Shared rules across all types

| Pattern | Applies to |
|---|---|
| `.no-scrollbar` CSS (see Type 1 CSS block) | All types with `overflow-x-auto` |
| `overscroll-x-contain` on the scroll container | Types 1, 2, 4, 5 |
| `snap-x snap-mandatory` on track + `snap-start` / `snap-center` on cards | Types 1, 2 |
| `flex-none` on every card | Types 1, 2, 3 |
| `py-*` on the scroll track so focus rings and borders aren't clipped | Types 1, 2, 5 |
| Keyboard-reachable scroll container (`tabIndex={0}` + `role="region"` + `aria-label`) | Types 1, 4 |
| `aria-label` on every prev/next/dot/thumbnail control | All types |
| `cursor-pointer` on every control | All types |
| `"use client"` on any component holding scroll or index state | Types 1 (with buttons), 2, 3, 5 |
| `next/image` with `fill` + `sizes`, `priority` on the first/LCP image | Types 3, 4, 5 |
| Named export for the component (`export function ProductCarousel`) | All types |

## House-style conflicts to watch for

Carousel code found in the wild almost always violates the OnEx house style. When adapting an example or an AI-generated draft, strip:

- `hover:scale-105` / `hover:-translate-y-1` on cards → replace with `hover:bg-muted` per [`/onex:style-hover-effects`](../style-hover-effects).
- `hover:shadow-lg` / `shadow-xl` on cards → drop it; the flat style has no shadows.
- `transition-all` → `transition-colors` (except the slide-transport `transition-transform` in Type 3, which is deliberate).
- Gradient fade overlays at the track edges → the peek *is* the affordance; a fade is redundant and breaks on dark mode.
- shadcn `ScrollArea` → `overflow-x-auto` + `.no-scrollbar`.

## When NOT to use this skill

- Fewer items than fill one screen — use a grid or a flex row. A carousel that never scrolls is a grid with extra code.
- Content that must all be seen (pricing tiers, feature comparison) — carousels hide content behind an interaction; only ~1% of users click past the first hero slide.
- A vertical list — this skill is horizontal-axis only.
- The user wants an infinite-loop / free-drag physics slider — that's a library decision, not this skill.
