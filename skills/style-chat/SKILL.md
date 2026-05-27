---
description: Style and structure a chat UI in a Next.js app — input behavior (Enter inserts a newline, ⌘/Ctrl + Enter sends), the always-visible bottom-fixed composer with send button and `+` attachment menu, message bubbles with timestamp / copy / edit, streaming with auto-scroll and a scroll-to-bottom button, reasoning-model "Thinking…" accordions (dev vs prod detail), header controls (New chat + `⋮` Delete chat in destructive red), an empty state with welcome + at least three suggestion chips, follow-up suggestion chips above the input, and lightweight-then-reasoning model routing with an optimistic interim message for slow responses. Use when the user says "/onex:style-chat", "style the chat UI", "fix the chat", "add streaming", "add suggestion chips", "the chat input keeps overflowing", "auto-scroll the chat", "show the thinking steps", "add a chatbot", or asks how a chat / assistant UI should look and behave.
---

# /onex:style-chat — Style and structure a chat UI

`/onex:style-chat` standardizes how a chat / assistant UI looks and behaves across a Next.js app — the message input, attachments, message bubbles, streaming and auto-scroll, reasoning-model display, header controls, empty state, follow-up suggestions, and model routing.

It pairs with [`/onex:style`](../style) (the flat-design house style). Use the same flat tokens — `text-foreground`, `text-muted-foreground`, `border`, `bg-muted` — and the same rules: no shadows, restrained radii, color-driven (not motion-driven) hover. This skill is the *chat-specific* contract on top of that base.

Several items here are behavioral, not purely cosmetic (streaming, model routing, edit-truncates-thread). Implement them — but confirm with the user before large architectural additions (e.g. introducing streaming infrastructure or a model router where none exists).

## When to use

- Building a new chat / assistant surface from scratch.
- Restyling or restructuring an existing chat UI.
- Adding streaming, reasoning steps, follow-up chips, or attachment uploads.
- Fixing chat-input quirks (Enter behavior, auto-grow, scroll-to-bottom).
- Bringing a chat surface in line with the flat house style.

## Golden rules

1. **Enter inserts a newline. ⌘/Ctrl + Enter sends.** One keyboard contract — same as text areas in [`/onex:style`](../style) §J.
2. **The composer is always visible.** Fixed to the bottom even when the user scrolls through history.
3. **Responses stream.** No non-streaming chat replies.
4. **Auto-scroll on new messages — unless the user has scrolled up.** Then show a scroll-to-bottom button instead of yanking them down.
5. **Show progress, never empty silence.** An animated loader, a "Thinking…" state, or an optimistic interim message — never a frozen UI between send and first token.
6. **Triage with a lightweight model first.** Escalate to a reasoning model only when the task genuinely needs it.

## Layout

Top to bottom, full height:

```
┌──────────────────────────────────────────────────┐
│ header   ·   New chat   ⋮ (Delete chat)          │  ← header controls
├──────────────────────────────────────────────────┤
│                                                  │
│ message thread (scrolls)                         │
│                                                  │
│                                  [↓ to bottom]   │  ← only when scrolled up
├──────────────────────────────────────────────────┤
│ ◂ chip · chip · chip · chip · chip · chip ▸      │  ← follow-up chips
│ [ + ]  textarea…                       [ send ]  │  ← composer, fixed
└──────────────────────────────────────────────────┘
```

The composer is fixed; the thread scrolls behind it. Add bottom padding to the thread equal to the composer height so the last message clears the input.

## Composer (the input)

- **Enter** inserts a newline. **⌘/Ctrl + Enter** sends.
- Show a `<kbd>⌘ Enter</kbd>` hint on or beside the send button so the keyboard contract is discoverable.
- The composer is a **textarea** that **auto-grows** with content — **min ~3 rows**, with a **max-height** so it stops growing and scrolls internally past that point. (See [`/onex:style`](../style) §J.)
- A **send button** is always present — typically a circular icon button (`Send` from `lucide-react`) on the bottom-right of the composer.
- Disable the send button when the textarea is empty *or* a response is streaming.
- The whole composer is **fixed to the bottom** of the chat surface and **always visible**, even as the user scrolls history.

```tsx
function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    send()
  }
  // plain Enter falls through → newline (default behavior)
}
```

## Attachments

- A **bottom-left `+` icon button** opens a dropdown — *Attach file*, *Upload image*, plus any app-specific entries (*Camera*, *From URL*, …).
- Image upload uses the **native file input** so mobile opens the camera / photo gallery:
  - `<input type="file" accept="image/*">` for gallery.
  - `<input type="file" accept="image/*" capture="environment">` for a *Camera* entry on mobile.
- The dropdown is nested inside a fixed/dialog surface — add the `modal` prop (per shadcn house rule).

## Message bubbles

Every message renders:

- A **timestamp** — relative (`2m ago`) inline, with the absolute time on hover.
- A **copy** icon button — copies the message text to clipboard with a brief "Copied" confirmation.
- An **edit** action on **user messages**. Editing **truncates the thread from that message forward** and re-runs the request from the edited message. This is behavioral, not cosmetic — confirm before adding if the thread store doesn't already support truncation.
- A **regenerate** action on **assistant messages** — re-runs the previous user turn (recommended, not required).

Actions appear on hover on desktop and are always visible on touch. Use `text-muted-foreground` for the icons with a `hover:text-foreground` color shift (per [`/onex:style`](../style) §B — color, not geometry).

## Streaming & loading

- **Responses always stream.** No non-streaming chat replies.
- While waiting for the first streamed token, show an **animated loader** in the bot's message slot — a looping animated `...` ellipsis or a small spinner, whichever suits the app.
- On a **new message** (user sent, or the bot's first token arrives), **auto-scroll to the bottom**.
- If the user has scrolled up while a response is streaming, **do not yank them down**. Instead show a **scroll-to-bottom button** — a small down-arrow, centered, just above the composer — that returns them to the latest message on click.
- The scroll-to-bottom button hides automatically once the user is within ~80px of the bottom.

## Reasoning models

When the assistant uses a reasoning model:

- Show **"Thinking…"** (or **"Reasoning…"**) with the animated loader while the model reasons.
- Render the **reasoning steps in an accordion** below the loader, expandable on demand. Default collapsed.
- **In development:** inside the accordion, show **tool calls as JSON code blocks**, **token usage**, and other debug detail.
- **In production:** show only a **plain-language summary** of the reasoning steps — no tool calls, no token usage, no raw JSON.

Gate dev-only detail on `process.env.NODE_ENV !== "production"`.

## Header controls

A chat header sits above the message thread. Top-right cluster, in this order (left → right):

- **New chat / Reset** — a button that starts a fresh conversation. Icon + label is preferred; an icon-only version with a tooltip is acceptable.
- A **`⋮` (vertical-ellipsis) dropdown** containing **Delete chat** — trash icon, label rendered in `text-destructive` (red).
- If the chat surface sits inside a dialog or drawer, the dropdown needs the `modal` prop.

## Empty state

The empty thread shows:

- A **welcome icon** — the bot's mark, or a friendly placeholder glyph.
- A **title** ("How can I help today?") and a **short subtitle**.
- **At least three suggestion chips** — common ways to use the bot. Clicking a chip submits its text as the first user message.

Chips use the flat house style — `rounded-md`, `border`, `bg-background`, `hover:bg-muted`, `text-sm`, `px-3 py-1.5`.

## Follow-up suggestions

After each assistant response, generate **follow-up suggestion chips** with a **fast / lightweight model** (e.g. Haiku, GPT-4o-mini) and render them as a **single side-scrolling row just above the composer**.

- The row scrolls horizontally with the **scrollbar hidden** (per [`/onex:style`](../style) §I — use the shared `scrollbar-hide` utility).
- Chips use the same look as empty-state chips.
- Clicking a chip submits its text as the next user message.

## Model routing & responsiveness

- **Triage with a lightweight model first.** Route to the reasoning model *only* when the task genuinely needs it — saves tokens and keeps simple replies fast.
- For a **slow reasoning response**, send an **immediate optimistic interim message** in the bot's slot ("Hang on — let me think this through…") with the loader and the live reasoning steps, then **replace it** with the full streamed answer once ready.
- The goal: the user never stares at a frozen UI between sending and the first visible response.

## Review checklist

- [ ] Enter inserts a newline; ⌘/Ctrl + Enter sends; a `<kbd>⌘ Enter</kbd>` hint is visible on or near the send button.
- [ ] Composer is fixed to the bottom and stays visible while the thread scrolls.
- [ ] Send button is always present and disabled while empty or streaming.
- [ ] Textarea auto-grows from ~3 rows to a max-height, then scrolls internally.
- [ ] `+` attachment menu sits in the bottom-left; image upload uses the native file input.
- [ ] Every message has a timestamp, copy, and (user) edit / (assistant) regenerate.
- [ ] Editing a user message truncates the thread from that point and re-runs.
- [ ] Responses stream; an animated loader covers the wait for the first token.
- [ ] Auto-scroll on new messages; scroll-to-bottom button appears when the user has scrolled up and disappears near the bottom.
- [ ] Reasoning steps render in an accordion below "Thinking…"; dev shows tool calls + token usage, prod shows summary only.
- [ ] Header has New chat + `⋮` Delete chat (destructive red).
- [ ] Empty state has welcome icon + title + subtitle + ≥3 suggestion chips.
- [ ] Follow-up chips render in a single side-scrolling row above the composer with the scrollbar hidden.
- [ ] Lightweight model triages; an optimistic interim message covers slow reasoning starts.
- [ ] All chat surfaces honor the flat house style — no shadows, restrained radii, color-only hover.
