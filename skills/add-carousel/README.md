# add-carousel

A Claude Code skill that builds **carousels** in a Next.js App Router app — horizontally-scrolling or cycling containers for cards, images, and content blocks.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:add-carousel`**.

## What it does

Trigger it with `/onex:add-carousel` (or "add a carousel", "build a slider", "card scroll", "hero banner slider", "the cards should peek off the right edge"). Claude will:

1. **Ask which of the five carousel types you need** before writing any code — the container strategy, snap alignment, and state model all differ, so guessing wastes the build.
2. **Build it natively** with `overflow-x-auto` + `scroll-snap` rather than pulling in Embla / Swiper / shadcn `Carousel`. No dependency, no fight with iOS momentum scrolling.
3. **Apply the house style** — flat cards (no shadows), hover changes color not geometry, `cursor-pointer` on every control.
4. **Wire accessibility in from the start** — keyboard-reachable scroll containers, labelled controls, roving `tabIndex` on thumbnail strips, autoplay disabled under `prefers-reduced-motion`.
5. **Run the per-type build checklist** at the end.

## The five types

| Type | Shape | Use for |
|---|---|---|
| **Right-peeking** | First card aligns with the centered container; track bleeds off the right edge so the next card peeks. | Content sections under a heading — featured articles, product rows. |
| **Centered-active** | Active card centered; neighbours partially visible and de-emphasized. | Testimonials, portfolio spotlights, single-focus browsing. |
| **Autoplay / hero** | Full-width rotating slides with dots and optional controls. | Hero sections, promotions, announcements. |
| **Grid-overflow** | Multi-row or masonry grid scrolling sideways. | Image galleries, media grids. |
| **Thumbnail-nav** | Large display area with a scrollable thumbnail strip. | Product PDPs, photo galleries, listings. |

## The hard part: right-peeking alignment

Type 1 has to satisfy two contradictory constraints at once — its **left** edge must sit exactly at a centered `max-w-*` container's content edge (aligned under the heading), while its **right** side escapes that container and runs to the screen edge.

Every obvious approach fails: nesting it inside the container traps it on both sides; re-deriving the offset with a separate `calc()` while the header uses `margin: auto` produces a sub-pixel mismatch, because the two mechanisms resolve in different layout passes; a `%` offset resolves against the wrong containing block; negative margins depend on dynamic whitespace.

The skill's fix: compute the gutter **once** as a viewport-relative (`vw`) value — position-independent, so it's identical anywhere in the tree — store it in a CSS custom property, and have both the header and the track consume it through the **same** property (`padding-left`). The track simply omits `padding-right`, so it bleeds.

> Never align two elements by writing two formulas you believe are equal. Feed one shared variable into the same CSS property on both.

## Covers

- Step-0 type elicitation, with the question to ask verbatim.
- The container problem, a failure table for the four wrong approaches, and the shared-gutter fix.
- Full CSS for `--carousel-gutter`, `.no-scrollbar`, and the `100vw` inset adjustment.
- Required-utility tables per element (track / card wrapper / section).
- Prev/next buttons with end-detection, and why `canNext` starts `true`.
- Implementation patterns and build checklists for all five types.
- Shared rules table — snap, `overscroll-x-contain`, `flex-none`, keyboard reach, `next/image` sizing, `"use client"` boundaries.
- House-style conflicts to strip out of found or generated carousel code.
- When *not* to build a carousel at all.

Pairs with [`style`](../style) (flat house style) and [`style-hover-effects`](../style-hover-effects) (hover changes color, not geometry).

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:add-carousel`.

## License

MIT
