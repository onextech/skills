# setup-chat

A Claude Code skill that **wires** a chat UI in a Next.js app with the OnEx default stack — dependencies, the streaming Route Handler, persistence for multi-conversation history, the markdown / code-block renderer, the per-message **Copy** and **Regenerate** actions, and a **ChatGPT-style sidebar + main-pane** layout shell.

Pairs with [`style-chat`](../style-chat) — that skill styles the chat; this one engineers it.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:setup-chat`**.

## What it does

Trigger it with `/onex:setup-chat` (or "set up a chat", "wire the chat", "add AI SDK with the gateway", "scaffold chat history", "add a ChatGPT-style sidebar", "render markdown in the chat"). Claude will lock scope first (provider, persistence, layout, syntax highlighter), write a setup plan to `docs/chat-setup-plan.md`, then scaffold step-by-step on confirmation.

## Defaults

| Default | Package(s) |
|---|---|
| **Markdown** | `react-markdown` + `remark-gfm` |
| **Syntax-highlighted code blocks** | `shiki` |
| **Copy message** | Clipboard API (no dep) |
| **Regenerate** | `useChat` regenerate |
| **Multi-conversation + history** | Postgres, raw SQL (extends [`/onex:add-auth-db`](../add-auth-db)) |
| **Real LLM** | Vercel AI SDK v6 + **AI Gateway** (`anthropic/claude-sonnet-4-6` default) |
| **Layout** | ChatGPT-style left sidebar + main pane |

## Locked decisions

1. **LLM provider** — AI SDK + Gateway (default), direct Anthropic, direct OpenAI, or mock.
2. **Persistence** — Postgres / raw SQL (default), local-only (`zustand persist`), Supabase, or custom.
3. **Layout** — Sidebar + main (default), drawer-toggled, or single-pane.
4. **Syntax highlighter** — `shiki` (default), `react-syntax-highlighter`, or none.
5. **Greenfield vs existing route**, **default model**, etc.

## Scaffold order (one commit per step)

1. **Dependencies** — `react-markdown remark-gfm shiki ai @ai-sdk/react zod`.
2. **Renderer** — `MessageContent` + `CodeBlock` + memoized highlighter.
3. **Route handler** — `app/api/chat/route.ts` (AI SDK + Gateway, `streamText`, `useChat`-compatible response).
4. **Persistence** — `conversations` + `messages` migration, typed `queries.ts`.
5. **Layout shell** — `app/chat/layout.tsx`, `app/chat/[id]/page.tsx`, `ChatSidebar`.
6. **Per-message actions** — `MessageActions` (Copy + Regenerate, hover-revealed).

After the wiring is in, run **`/onex:style-chat`** for the visual contract — composer, streaming UX, message bubbles, follow-up chips, header controls.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:setup-chat`.

## License

MIT
