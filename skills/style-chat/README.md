# style-chat

A Claude Code skill that standardizes how a **chat / assistant UI** looks and behaves across a Next.js app — composer behavior, attachments, message actions, streaming, reasoning-model display, header controls, empty state, follow-up suggestions, and model routing.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:style-chat`**.

## What it does

Trigger it with `/onex:style-chat` (or "style the chat UI", "fix the chat", "add streaming", "add suggestion chips", "show the thinking steps"). Claude will apply the house contract for chat surfaces:

1. **Keyboard contract** — Enter inserts a newline; **⌘/Ctrl + Enter** sends, with a visible `kbd` hint.
2. **Always-visible composer** — fixed to the bottom with a `+` attachment menu (bottom-left) and a send button (bottom-right) that disables while empty or streaming.
3. **Message actions** — timestamp + copy on every message; **edit** on user messages truncates the thread and re-runs; **regenerate** on assistant messages.
4. **Streaming with intent** — auto-scroll on new messages, a scroll-to-bottom button when the user has scrolled up, and an animated loader while waiting for the first token.
5. **Reasoning UX** — "Thinking…" with an accordion of reasoning steps; tool calls + token usage in dev, plain-language summary only in prod.
6. **Header + empty state + follow-ups** — New chat / `⋮ Delete chat`, a welcome state with ≥3 suggestion chips, and follow-up chips in a single side-scrolling row above the composer.
7. **Model routing** — triage with a lightweight model, escalate to reasoning only when needed, and cover slow reasoning starts with an optimistic interim message.

## Covers

- **Composer** — Enter vs ⌘+Enter, auto-grow / min ~3 rows / max-height, always-visible fixed bottom, send button states.
- **Attachments** — `+` dropdown, native file input for camera/gallery on mobile.
- **Bubbles** — timestamp, copy, edit (user) / regenerate (assistant); hover affordances per the flat house style.
- **Streaming** — auto-scroll, scroll-to-bottom button, loader.
- **Reasoning** — accordion with dev vs prod content.
- **Chrome** — header controls, empty state, follow-up chips, model routing.

Pairs with [`style`](../style) (the flat-design house style — chat surfaces inherit its tokens and rules).

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:style-chat`.

## License

MIT
