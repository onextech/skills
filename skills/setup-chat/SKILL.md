---
description: Wire a chat UI in a Next.js app with the OnEx default stack — `react-markdown` + `remark-gfm` for markdown, `shiki` for syntax-highlighted code blocks, per-message **Copy** and **Regenerate** actions, multi-conversation persistence with chat history, a **real LLM via Vercel AI SDK v6 + AI Gateway** (`anthropic/claude-sonnet-4-6` by default, swappable per request) with a Next.js Route Handler that streams via `streamText` and a `useChat` client, and a **ChatGPT-style layout** — left sidebar of conversations + main chat pane. Confirms scope first by asking provider/model (AI SDK + Gateway is the default; direct Anthropic or direct OpenAI optional), persistence backend (Postgres via raw SQL is the default; local-only `zustand persist` or Supabase optional), syntax highlighting library (shiki default, react-syntax-highlighter optional, none), greenfield vs existing route, and layout (sidebar + main default, drawer-toggled sidebar or single-pane optional). Writes a setup plan to `docs/chat-setup-plan.md`, then scaffolds dependencies, the route handler, the persistence schema, the layout shell, and the message renderer. Use when the user says "/onex:setup-chat", "set up a chat", "wire the chat", "add a chatbot to this app", "add AI SDK with the gateway", "scaffold chat history", "add a ChatGPT-style sidebar", "render markdown in the chat", "add syntax highlighting to messages", "add a copy button to messages", "add a regenerate button", or asks how to wire the engineering side of a chat (deps, route handler, persistence, layout) — not just the visual style.
---

# /onex:setup-chat — Wire a chat UI with the OnEx default stack

`/onex:setup-chat` is the **engineering** counterpart to [`/onex:style-chat`](../style-chat). Style-chat governs how the chat **looks and behaves**; setup-chat **wires it up** — dependencies, the Route Handler, model routing through the AI Gateway, persistence for multi-conversation history, the markdown / code-block renderer, the per-message actions (copy + regenerate), and the ChatGPT-style sidebar + main-pane layout shell.

| Default | Package(s) | Why this is the default |
|---|---|---|
| **Markdown rendering** | `react-markdown` + `remark-gfm` | ~30 KB gzipped. Essential — raw LLM output (`**bold**`, lists, links, tables) renders correctly. |
| **Syntax-highlighted code blocks** | `shiki` | TextMate grammars + VS Code themes — the best-looking code in chat. Heavier (~100 KB+), but ship it on day one so codegen doesn't look like a plain pre tag. |
| **Copy message** | none (Clipboard API) | A hover affordance on every assistant message. Trivial to add, painful to lack. |
| **Regenerate** | `useChat` regenerate | Re-runs the last user turn. The single most-used action after Copy. |
| **Multi-conversation + history** | Postgres (raw SQL via [`/onex:add-auth-db`](../add-auth-db)) | A real product needs persistence. Conversations + messages tables, owned by the signed-in user. |
| **Real LLM via AI SDK + Gateway** | `ai` v6 (`streamText`, `useChat`) | AI Gateway lets the app switch providers (`anthropic/claude-sonnet-4-6`, `openai/gpt-…`, etc.) without changing client code. Streams natively. Needs `AI_GATEWAY_API_KEY`. |
| **ChatGPT-style layout** | shadcn primitives | Left sidebar lists conversations; main pane is the active chat. The default layout users already know. |

This skill is a **build procedure**. Confirm scope, write the plan to `docs/chat-setup-plan.md`, then scaffold on the user's go-ahead.

## How to run

### 1. Confirm scope — REQUIRED first step (use `AskUserQuestion`)

Lock the answers **before** scanning the repo or writing anything. Group into one or two `AskUserQuestion` calls (max 4 per call). Each question presents the OnEx default first, labeled `(Recommended)`.

**Call 1 — provider, persistence, layout, syntax highlighter:**

1. **LLM provider / wiring** (single-select):
   - **Real LLM via AI SDK + Gateway** *(Recommended)* — Vercel AI SDK v6 with the AI Gateway. Model picked per request (default `anthropic/claude-sonnet-4-6`). Needs `AI_GATEWAY_API_KEY`.
   - **Direct Anthropic** — AI SDK's Anthropic provider. Needs `ANTHROPIC_API_KEY`.
   - **Direct OpenAI** — AI SDK's OpenAI provider. Needs `OPENAI_API_KEY`.
   - **Mock only** — local echo / canned responses for offline development. No external calls.

2. **Persistence backend** (single-select):
   - **Postgres (raw SQL)** *(Recommended)* — extends [`/onex:add-auth-db`](../add-auth-db); adds `conversations` + `messages` tables tied to the signed-in user.
   - **Local only** — `zustand` + `persist` (localStorage). No server, no cross-device history.
   - **Supabase** — Supabase client + RLS-protected tables.
   - **Custom** — user wires their own backend; this skill emits only the typed schema + client calls.

3. **Layout** (single-select):
   - **ChatGPT-style: left sidebar + main pane** *(Recommended)* — sidebar lists conversations with "New chat" at top; main pane is the active thread.
   - **Drawer-toggled sidebar** — sidebar is a sheet/drawer on mobile, fixed on desktop.
   - **Single pane (no sidebar)** — one chat, no history navigation.

4. **Syntax highlighter** (single-select):
   - **`shiki`** *(Recommended)* — TextMate grammars, VS Code themes. Heaviest, best-looking.
   - **`react-syntax-highlighter`** — Prism-based, lighter, fewer themes.
   - **None** — plain pre + code — only acceptable if the chat never shows code.

**Call 2 — runtime decisions (skip any obvious from a quick scan):**

5. **Greenfield or existing chat route?** (single-select):
   - **Greenfield** — scaffold a new route, default `app/chat/page.tsx` + `app/api/chat/route.ts`.
   - **Existing** — extend the current chat route; respect its package manager (yarn / pnpm / npm) and conventions.

6. **Default model on the Gateway** (single-select, only if AI SDK + Gateway):
   - **`anthropic/claude-sonnet-4-6`** *(Recommended)* — best balance for chat.
   - **`anthropic/claude-opus-4-7`** — strongest reasoning; pricier.
   - **`anthropic/claude-haiku-4-5`** — fastest / cheapest; good for triage / follow-up chip generation.
   - **`openai/gpt-…`** — pick the current GPT id (verify in Step 3).

**Do not proceed** until the *provider*, *persistence*, *layout*, and *syntax highlighter* are locked.

### 2. Preflight — detect the stack

A short surface scan, no deep reads:

- **Package manager** — lockfile (`yarn.lock` → `yarn`, `pnpm-lock.yaml` → `pnpm`, otherwise `npm`). User prefers `yarn`.
- **Next.js + App Router** — confirm `app/` exists and Next.js is in `package.json`. This skill assumes App Router; flag if Pages Router and ask.
- **Auth + DB already present?** — if `/onex:add-auth-db` already ran, reuse its migration runner and seed. If not and the user picked Postgres persistence, recommend running `/onex:add-auth-db` first or fold the chat tables into a fresh migration.
- **shadcn primitives** — confirm `components/ui/` and `lib/utils.ts` exist. If not, the layout step installs the shadcn pieces it needs (`button`, `dropdown-menu`, `dialog`, `textarea`).
- **Existing chat code** — `*chat*.ts`, `*chat*.tsx`, prior `useChat` usage. Reconcile with "greenfield vs existing" — if "greenfield" but an active chat is present, stop and ask.

### 3. Verify current specs — REQUIRED before scaffolding

These move fast. Before any code lands:

- **Vercel AI SDK v6** — `context7` query-docs for `/vercel/ai`; confirm the current `streamText` + `useChat` API, the **`regenerate()` vs `reload()`** naming on the current major, and the AI Gateway model id format (`provider/model-id`).
- **`react-markdown` + `remark-gfm`** — confirm current major versions and any ESM caveats.
- **`shiki`** (or `react-syntax-highlighter`) — confirm current API. Shiki has both async (`getHighlighter` / `createHighlighter`) and the newer `codeToHtml` paths; pick the one that fits the chosen rendering surface (server component vs client).

Record the source URL / version used per dependency in the plan. If a spec can't be verified, mark `PENDING — verify spec` and stop before scaffolding that piece.

### 4. Write the plan

Write to **`docs/chat-setup-plan.md`** (create `docs/` if missing). Structure, in this order:

1. **Decision log** — locked answers from Step 1 verbatim, dated. This is the contract.
2. **Stack summary** — Next.js version, App Router, package manager, auth/db state, chosen provider/persistence/layout/highlighter.
3. **Default sections** — one section per default (Markdown, Code, Copy, Regenerate, Multi-conversation, AI SDK + Gateway, Layout). Each: *what / why / install / files to add / code stub / env vars / verification*. Sections the user opted out of get a one-line "Skipped because …".
4. **Cross-cutting concerns** — auth (every chat call is for the signed-in user), env vars, streaming + cancellation, error surface, observability.
5. **Recommended scaffold order** — fixed: **deps → renderer (markdown + code) → route handler (AI SDK + Gateway) → persistence → layout shell → per-message actions**. Each step is one commit.

End the plan with this exact follow-through prompt:

> Tell me which steps to scaffold (numbers, names, or "all"), and I'll set them up in that order with a commit per step.

### 5. Scaffold per step — on the user's pick

When the user picks, scaffold in the order above (or the explicit order they give). For each step:

1. Restate the spec source verified in Step 3; re-fetch if more than a session has passed.
2. Run the install + file additions from that step's section below.
3. Smoke-test with the verification at the end of that section.
4. Commit with a message like `setup-chat: add markdown + shiki renderer`.

If a step depends on another that isn't done (e.g. persistence before the route handler can read prior turns), stop and warn — do not fake the dependency.

## The defaults

Treat package names and code stubs as **templates** — re-check against the live spec before they land.

### A. Markdown rendering — `react-markdown` + `remark-gfm`

**What.** A renderer that turns the assistant's markdown text into safe React nodes — headings, lists, links, bold/italic, tables, task lists, strikethrough.

**Why.** Without this, raw `**bold**` / `[link](url)` literally shows in the bubble. With this, the chat looks like ChatGPT / Claude. ~30 KB gzipped — cheap.

**Install:**

```bash
yarn add react-markdown remark-gfm
```

**Files:**

- `components/chat/message-content.tsx` — the renderer shared by every assistant message.

**Code stub (verify current `react-markdown` API):**

```tsx
"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./code-block"
import { cn } from "@/lib/utils"

export function MessageContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const lang = /language-(\w+)/.exec(className ?? "")?.[1]
          if (inline) return <code className={cn("rounded bg-muted px-1 py-0.5 text-[0.9em]", className)} {...props}>{children}</code>
          return <CodeBlock language={lang}>{String(children).replace(/\n$/, "")}</CodeBlock>
        },
        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" className="underline underline-offset-2" />,
        ul: ({ node, ...props }) => <ul {...props} className="my-2 ml-5 list-disc space-y-1" />,
        ol: ({ node, ...props }) => <ol {...props} className="my-2 ml-5 list-decimal space-y-1" />,
        table: ({ node, ...props }) => <div className="my-2 overflow-x-auto"><table {...props} className="w-full border-collapse text-sm" /></div>,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
```

**Env vars:** none.

**Verification:** send a user message asking the model to produce bold text, a bullet list, a link, a table, and a code fence — confirm each renders correctly.

### B. Syntax-highlighted code blocks — `shiki`

**What.** A code-block component that highlights using TextMate grammars and VS Code themes (default), with a **Copy** button on hover and the language label in the top-right.

**Why.** Code in chat without highlighting is illegible. Shiki produces the best-looking output. Pre-bundle a small set of common langs (`ts`, `tsx`, `js`, `jsx`, `py`, `bash`, `json`, `md`, `sql`, `css`, `html`) — load others lazily.

**Install:**

```bash
yarn add shiki
```

**Files:**

- `components/chat/code-block.tsx` — the highlighted block.
- `lib/chat/highlighter.ts` — a memoized highlighter singleton.

**Code stub (verify against current `shiki` API — `codeToHtml` vs `getHighlighter` / `createHighlighter`):**

```ts
// lib/chat/highlighter.ts
import { createHighlighter, type Highlighter } from "shiki"

let cached: Promise<Highlighter> | null = null
export function getHighlighter() {
  cached ??= createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["ts", "tsx", "js", "jsx", "py", "bash", "json", "md", "sql", "css", "html"],
  })
  return cached
}
```

```tsx
// components/chat/code-block.tsx
"use client"
import { useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHighlighter } from "@/lib/chat/highlighter"

export function CodeBlock({ language, children }: { language?: string; children: string }) {
  const [html, setHtml] = useState<string>("")
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    let cancelled = false
    getHighlighter().then(h => {
      const out = h.codeToHtml(children, {
        lang: language ?? "text",
        themes: { dark: "github-dark", light: "github-light" },
      })
      if (!cancelled) setHtml(out)
    })
    return () => { cancelled = true }
  }, [children, language])
  const copy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative my-2 overflow-hidden rounded-md border bg-muted">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
        <span>{language ?? "text"}</span>
        <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="overflow-x-auto text-sm [&_pre]:m-0 [&_pre]:px-3 [&_pre]:py-2" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
```

**Env vars:** none.

**Verification:** ask the model for a small TypeScript snippet — confirm tokens are colored, the language label shows `typescript` / `ts`, and the copy button copies the raw source.

### C. Copy-message button

**What.** A hover-revealed icon button on every assistant message that copies the **raw markdown** (not the rendered HTML) to the clipboard, with a brief "Copied" confirmation.

**Why.** The single highest-frequency follow-up action. Trivial to add; painful to lack.

**Files:**

- `components/chat/message-actions.tsx` — the action row under each message.

**Code stub:**

```tsx
"use client"
import { useState } from "react"
import { Copy, Check, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MessageActions({ raw, onRegenerate }: { raw: string; onRegenerate?: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="mt-1 flex items-center gap-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={copy} aria-label="Copy message">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      {onRegenerate && (
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onRegenerate} aria-label="Regenerate response">
          <RefreshCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
```

Wrap each assistant bubble in a `group` so `group-hover:opacity-100` reveals the row. On touch, drop the `opacity-0` gating.

**Env vars:** none.

**Verification:** hover an assistant message → the copy button appears; click → clipboard contains the raw markdown; UI shows ✔ for ~1.5s.

### D. Regenerate last response

**What.** A second hover action — only on the **last assistant message** — that re-runs the previous user turn through the model. Disabled while streaming.

**Why.** Models miss; the user shouldn't have to retype.

**Files:**

- `components/chat/message-actions.tsx` (extended).
- Wire the regenerate function from `useChat` — verify the current name (older versions used `reload()`).

**Code stub:**

```tsx
"use client"
import { useChat } from "@ai-sdk/react"   // verify import path — AI SDK v6 may export from "ai/react" or "@ai-sdk/react"
import { MessageActions } from "./message-actions"

const { messages, regenerate, status } = useChat({ /* … */ })
const isStreaming = status === "streaming"
const lastAssistantId = [...messages].reverse().find(m => m.role === "assistant")?.id

{messages.map(m => (
  <div key={m.id} className="group …">
    {/* render bubble */}
    {m.role === "assistant" && (
      <MessageActions
        raw={m.content}
        onRegenerate={m.id === lastAssistantId && !isStreaming ? regenerate : undefined}
      />
    )}
  </div>
))}
```

**Env vars:** none.

**Verification:** send a message, get a reply, click regenerate on the last assistant message — confirm a new streamed response replaces the previous one and the conversation row in the DB updates correctly (one user turn, one assistant turn, no duplicates).

### E. Multi-conversation + chat history (Postgres, raw SQL)

**What.** Per-user `conversations` and `messages` tables. The sidebar lists the signed-in user's conversations newest-first. Selecting a conversation hydrates the chat; **New chat** creates a fresh row on the first user message.

**Why.** A real product needs history — across devices, across sessions. Local-only persistence breaks the moment a user logs in on a second device.

**Setup steps:**

1. Confirm [`/onex:add-auth-db`](../add-auth-db) ran (or fold this migration into a fresh run).
2. Add a raw-SQL migration (`db/migrations/NNNN_chat.sql`).
3. Add a typed client (`lib/chat/queries.ts`) — `listConversations`, `getConversation`, `createConversation`, `appendMessage`, `renameConversation`, `deleteConversation`.
4. Wire the route handler (Section F) to **persist** each user + assistant turn as it streams (assistant row is upserted on stream finish).
5. Auto-title the conversation from the first user message — either a literal truncation, or a 1-shot call to a fast / cheap model (`anthropic/claude-haiku-4-5`).

**Migration (raw SQL, no ORM):**

```sql
-- db/migrations/0010_chat.sql
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references "user"(id) on delete cascade,
  title text not null default 'New chat',
  model text not null default 'anthropic/claude-sonnet-4-6',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conversations_user_updated_idx on conversations (user_id, updated_at desc);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_created_idx on messages (conversation_id, created_at asc);
```

> Per the user's rules: **never** apply `.sql` files directly. Write the migration; tell the user to run `yarn db:migrate`.

**Client stubs:**

```ts
// lib/chat/queries.ts
import { sql } from "@/lib/db"   // your raw-SQL client from /onex:add-auth-db
export async function listConversations(userId: string) {
  return sql<{ id: string; title: string; updated_at: string }>`
    select id, title, updated_at from conversations
    where user_id = ${userId}
    order by updated_at desc
    limit 100`
}
export async function appendMessage(conversationId: string, role: "user" | "assistant", content: string) {
  await sql`insert into messages (conversation_id, role, content) values (${conversationId}, ${role}, ${content})`
  await sql`update conversations set updated_at = now() where id = ${conversationId}`
}
```

**Env vars:** `DATABASE_URL` (already present from `/onex:add-auth-db`).

**Verification:** create a chat, send 2 turns, refresh — the conversation reappears in the sidebar with the right title and prior messages. Sign out, sign back in — same. Sign in as a different user — empty sidebar (no cross-user leakage).

### F. Real LLM via Vercel AI SDK v6 + AI Gateway

**What.** A Next.js Route Handler that calls `streamText` against the **AI Gateway** with a model id like `anthropic/claude-sonnet-4-6`, returning a UI message stream that `useChat` consumes on the client.

**Why.** The AI Gateway lets the app switch providers / models without touching client code. Streaming is built in. `useChat` handles the buffer, cancellation, and regenerate for free.

**Install:**

```bash
yarn add ai @ai-sdk/react zod
```

> Verify the exact package set against the current AI SDK v6 docs — provider packages (`@ai-sdk/anthropic`, `@ai-sdk/openai`) are **not needed** when going through the Gateway with a `provider/model-id` string; they are needed for direct-provider mode.

**Files:**

- `app/api/chat/route.ts` — the streaming endpoint.
- `lib/chat/use-chat.ts` (optional) — a thin wrapper over `useChat` pre-configured with the conversation id.

**Code stub (verify `streamText` signature + UI message stream helper against current docs):**

```ts
// app/api/chat/route.ts
import { streamText, type UIMessage, convertToModelMessages } from "ai"
import { getSessionUser } from "@/lib/auth"
import { appendMessage, createConversation } from "@/lib/chat/queries"

export const runtime = "nodejs"     // or "edge" if your DB client supports it

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const body = (await req.json()) as { messages: UIMessage[]; conversationId?: string; model?: string }
  const conversationId = body.conversationId ?? (await createConversation(user.id)).id
  const model = body.model ?? "anthropic/claude-sonnet-4-6"

  const last = body.messages.at(-1)
  if (last?.role === "user") await appendMessage(conversationId, "user", uiMessageText(last))

  const result = streamText({
    model,                                     // gateway accepts the "provider/model-id" string
    messages: convertToModelMessages(body.messages),
    onFinish: async ({ text }) => { await appendMessage(conversationId, "assistant", text) },
  })

  return result.toUIMessageStreamResponse({
    headers: { "x-conversation-id": conversationId },   // client reads this to attach future turns
  })
}

function uiMessageText(m: UIMessage): string {
  return m.parts.filter(p => p.type === "text").map(p => (p as { type: "text"; text: string }).text).join("")
}
```

Client (`useChat`):

```tsx
"use client"
import { useChat } from "@ai-sdk/react"      // verify import path against current AI SDK v6
import { Composer } from "./composer"
import { MessageList } from "./message-list"

export function Chat({ conversationId }: { conversationId?: string }) {
  const chat = useChat({ api: "/api/chat", body: { conversationId } })
  return (
    <>
      <MessageList messages={chat.messages} regenerate={chat.regenerate} status={chat.status} />
      <Composer onSubmit={(text) => chat.sendMessage({ text })} disabled={chat.status === "streaming"} />
    </>
  )
}
```

**Env vars:**

```bash
AI_GATEWAY_API_KEY=     # from Vercel — required when using the AI Gateway
# OR (only if "Direct provider" was picked above)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

**Verification:** send a message → tokens stream into the bubble; on finish the assistant row appears in `messages`; cancelling mid-stream stops the request (verify in network panel).

### G. ChatGPT-style layout — left sidebar + main pane

**What.** A two-pane layout: a fixed-width left sidebar that lists the signed-in user's conversations with **New chat** pinned at the top and a per-row `⋮` menu (Rename, Delete), and a main pane that renders the active chat.

**Why.** The default layout users already know from ChatGPT, Claude, and most modern assistants. Pairs cleanly with [`/onex:style-chat`](../style-chat) — that skill handles the composer, message actions, streaming, etc.; this one is the *shell* around them.

**Layout (text sketch):**

```
┌──────────────────────────┬─────────────────────────────────────┐
│ + New chat               │ header · model picker · ⋮           │
│ ─────────────────────── │ ─────────────────────────────────── │
│ ▸ Conversation 1         │                                     │
│   Conversation 2         │ message thread (scrolls)            │
│   Conversation 3         │                                     │
│   …                      │                            [↓]      │
│                          │ ─────────────────────────────────── │
│ ─────────────────────── │ ◂ chip · chip · chip · chip ▸       │
│ user · settings · logout │ [ composer (fixed bottom) ]         │
└──────────────────────────┴─────────────────────────────────────┘
```

**Files:**

- `app/chat/layout.tsx` — server component; reads `listConversations(user.id)`, renders the sidebar + slot.
- `app/chat/page.tsx` — empty-state landing (`/onex:style-chat` defines its content).
- `app/chat/[id]/page.tsx` — renders `<Chat conversationId={id} />` with hydrated history.
- `components/chat/sidebar.tsx` — `"use client"` (uses Next router for navigation + `useTransition` for optimistic delete).

**Sidebar code stub:**

```tsx
// components/chat/sidebar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, MoreVertical, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ChatSidebar({ conversations }: { conversations: { id: string; title: string }[] }) {
  const pathname = usePathname()
  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r bg-background md:flex">
      <div className="p-2">
        <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
          <Link href="/chat"><Plus className="h-4 w-4" /> New chat</Link>
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {conversations.map(c => {
          const href = `/chat/${c.id}`
          const active = pathname === href
          return (
            <div key={c.id} className={cn("group flex items-center justify-between rounded-md px-2 py-1.5 text-sm", active ? "bg-muted" : "hover:bg-muted")}>
              <Link href={href} className="min-w-0 flex-1 truncate text-foreground">{c.title}</Link>
              <DropdownMenu modal>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Pencil className="mr-2 h-3.5 w-3.5" /> Rename</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
```

Layout shell:

```tsx
// app/chat/layout.tsx
import { getSessionUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { listConversations } from "@/lib/chat/queries"
import { ChatSidebar } from "@/components/chat/sidebar"

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  const conversations = await listConversations(user.id)
  return (
    <div className="flex h-dvh">
      <ChatSidebar conversations={conversations} />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}
```

> Per the user's rules: this is a server component reading session + DB before the chat renders — params / searchParams are awaited where used; the `Chat` client component carries `"use client"`.

**Env vars:** none unique.

**Verification:** sign in → land on `/chat` → empty state. Send a message → URL becomes `/chat/<id>`, the new conversation appears in the sidebar with the auto-generated title. Refresh → still there. Click a sibling conversation → it hydrates instantly.

## Cross-cutting concerns

- **Auth.** Every chat route handler resolves the session first; conversations and messages are filtered by `user_id` in SQL — never on the client.
- **One source of truth for the model id.** The default model lives in one constant (`lib/chat/config.ts` → `DEFAULT_MODEL = "anthropic/claude-sonnet-4-6"`) — used by the route handler **and** new-conversation creation, so a swap is one line.
- **Cancellation.** `useChat` auto-cancels on unmount; the route handler must respect `req.signal` so closing the tab stops upstream calls. `streamText` honors `AbortSignal` — pass `req.signal` through if the current API supports it.
- **Streaming UX.** The composer disables on `status === "streaming"`; pair with [`/onex:style-chat`](../style-chat) for the loader, auto-scroll, and scroll-to-bottom behavior.
- **Error surface.** A single error envelope from the route handler → rendered as a destructive `Alert` in the active conversation. Never silently drop tokens.
- **Sandbox toggle.** When `process.env.NODE_ENV !== "production"` or when "Mock only" was chosen, route to a local echo provider that returns a pre-canned streamed response — invaluable for offline dev and screenshots.

## Rules

- **Confirm scope first** — provider, persistence, layout, syntax highlighter — before any scan or write.
- **Verify specs at runtime** — AI SDK v6's API names (`regenerate` vs `reload`, `UIMessage` shape, Gateway model id format) shift between minors. Re-check via `context7` / web search; never bake stale names.
- **Plan before scaffolding** — `docs/chat-setup-plan.md` is written first; only scaffold on explicit confirmation.
- **One step per commit** — deps, renderer, route handler, persistence, layout, actions. Each lands and is verifiable on its own.
- **Never apply `.sql` directly** — write the migration; tell the user to run `yarn db:migrate`. (Per the user's hard rule.)
- **`yarn`, not `npm`** — every install command uses yarn. (Per the user's preferences.)
- **Always-on streaming** — `streamText` + `useChat`; never the non-streaming `generateText` path for the main chat call.
- **`useChat` + Route Handler, not server actions for chat** — server actions don't stream tokens to the client incrementally; chat needs the streamed response.
- **Raw markdown is the source of truth.** The **Copy** button copies the raw markdown the model produced, not the rendered HTML. The DB stores raw markdown. The renderer is presentation only.
- **Code blocks must show the language.** A `tsx` block must say `tsx` in the corner; a fence with no language defaults to `text`, never silently to `js`.
- **One model constant.** Default model id lives once, in `lib/chat/config.ts`. Sidebar / new-chat / route handler all import it.
- **Layout shell is a server component.** `app/chat/layout.tsx` runs on the server, resolves the session, fetches conversations. The sidebar is `"use client"` because of navigation + dropdown state; the chat surface is `"use client"` because of `useChat`.
- **Never use the shadcn `ScrollArea`** in the sidebar or thread — use `overflow-y-auto` with a max-height. (Per the user's shadcn rules.)
- **`DropdownMenu` inside the sidebar's per-row card uses the `modal` prop** — required when nested inside dialogs / drawers / sheets, harmless elsewhere. (Per the user's shadcn rules.)
- **Pair with `/onex:style-chat`** — this skill scaffolds the wiring; `/onex:style-chat` enforces the *visual* contract (composer behavior, message bubble actions style, streaming UX). Run `/onex:style-chat` after the wiring is in.

## When NOT to use this skill

- The user wants a one-off LLM completion with no UI — just call the model directly.
- A chat already exists and only one of the defaults is missing — apply that piece directly (e.g. "add a copy button" → just Section C) without running the full flow.
- The product is voice-only — most of this (layout, markdown, code blocks) doesn't apply; look at AGUI patterns in [`/onex:setup-agent`](../setup-agent) instead.
- The user explicitly wants a fully custom chat shell (no sidebar, no history, embedded in another surface) — this skill's defaults will fight that direction.
