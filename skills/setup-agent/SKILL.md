---
description: Set up a modern AI agent on top of the six protocols that define how it connects to tools, other agents, suppliers, payments, the UI, and the user — MCP (Model Context Protocol, tools), A2A (Agent-to-Agent, discovery + delegation), UCP (Universal Commerce Protocol, supplier discovery + structured orders), AP2 (Agent Payments Protocol, typed mandates for bounded spend), A2UI (Agent-to-User Interface, interactive UI primitives), and AGUI (event streaming from agent to frontend). Confirms scope first by asking which agent framework — Claude Agent SDK or OpenAI Agent SDK — whether the agent has a commerce segment (gates UCP + AP2), whether it has a user-facing UI (gates A2UI + AGUI), whether it delegates to or is discoverable by other agents (gates A2A), runtime / language, greenfield vs existing repo, and identity / auth posture. Writes a detailed plan to `docs/agent-setup-plan.md` with concrete setup steps, code stubs, env vars, and verification steps per protocol — then offers to scaffold each protocol, one commit at a time, in dependency order. Use when the user says "/onex:setup-agent", "set up an agent", "scaffold an AI agent", "wire up the agent protocols", "add MCP / A2A / UCP / AP2 / A2UI / AGUI", "build a commerce agent", "make this app agentic", "set up agent tools", or asks how to wire up the modern agent protocols.
---

# /onex:setup-agent — Set up the six modern AI agent protocols

`/onex:setup-agent` plans and scaffolds an AI agent on top of the six protocols that define how a modern agent connects to tools, other agents, suppliers, payments, the UI, and the user — independent of the underlying model or framework.

| Protocol | One-liner | Gated by |
|---|---|---|
| **MCP** — Model Context Protocol | Connects the agent to tools and data sources at runtime — no hard-coded tool definitions. | Always included. |
| **A2A** — Agent-to-Agent Protocol | Standardizes agent discovery and cross-framework delegation. | Multi-agent or "discoverable" was selected. |
| **UCP** — Universal Commerce Protocol | Machine-readable supplier discovery, catalog browsing, and structured ordering. | Commerce segment = yes. |
| **AP2** — Agent Payments Protocol | Typed mandates that bound spend, restrict merchants, and produce auditable receipts. | Commerce segment = yes. |
| **A2UI** — Agent-to-User Interface Protocol | Real-time interactive UIs rendered from a fixed set of primitives the client knows how to draw. | User-facing UI = yes. |
| **AGUI** — Agent GUI streaming | Event stream from agent to frontend — token deltas, tool calls, progress, errors. | User-facing UI or voice. |

This skill is a build procedure. Lock the answers, write the plan, then scaffold protocol-by-protocol on confirmation. Do not write code until scope is confirmed.

## How to run

### 1. Confirm scope — REQUIRED first step (use `AskUserQuestion`)

Lock these answers **before** scanning the repo or writing anything. Group into one or two `AskUserQuestion` calls (max 4 per call).

**Call 1 — the four protocol-gating decisions:**

1. **Framework** (single-select):
   - **Claude Agent SDK** — Anthropic's `claude-agent-sdk` (TypeScript / Python).
   - **OpenAI Agent SDK** — OpenAI's Agents SDK (`@openai/agents` / `openai-agents` Python).
   - **Framework-agnostic / both** — wire protocols at the transport layer; pick the framework per agent.

2. **Commerce segment?** (yes / no):
   - **Yes** — the agent browses catalogs, places orders, or moves money. Gates **UCP + AP2**.
   - **No** — informational / tool-using only.

3. **User-facing surface?** (single-select):
   - **Web UI** — browser app. Gates **A2UI + AGUI**.
   - **CLI / backend only** — headless. A2UI / AGUI skipped.
   - **Voice / phone** — AGUI applies (audio token streaming); A2UI typically does not.

4. **Multi-agent or discoverable?** (single-select):
   - **Yes — this agent delegates** to specialist sub-agents. Full A2A client + server.
   - **Yes — this agent must be discoverable** by other agents. A2A server only.
   - **No — single, isolated agent.** A2A optional; include only if a registry listing is wanted.

**Call 2 — the runtime / shape decisions (skip any already obvious from a quick scan):**

5. **Runtime / language** (single-select):
   - **Node / TypeScript**.
   - **Python**.
   - **Both** — note which packages live where.

6. **Greenfield or existing repo?** (single-select):
   - **Greenfield** — scaffold a fresh app/service.
   - **Existing** — extend the current repo; respect its package manager (yarn / npm / pnpm / pip / uv).

7. **Identity / auth posture** (single-select, only if commerce or multi-tenant):
   - **End-user delegation** — every action carries the user's authorization (OAuth, signed mandates).
   - **Service identity** — the agent acts as itself (machine credentials).
   - **Both** — depends on the operation.

**Do not proceed** until *framework*, *commerce*, *UI*, and *multi-agent* are locked.

### 2. Preflight — detect the stack

A short surface scan, no deep reads:

- Detect the **package manager** (lockfile) and **runtime** (`package.json` vs `pyproject.toml` / `requirements.txt`).
- Detect any **existing agent code** — `*agent*.ts`, `*agent*.py`, prior MCP server, prior `tools/` directory.
- Detect any **existing UI framework** — Next.js, React, SvelteKit — needed for A2UI / AGUI.
- Reconcile with the locked answers. If "greenfield" was chosen but a repo with active code is present, flag the conflict and ask which to honor before continuing.

### 3. Verify current specs — REQUIRED before scaffolding any protocol

These protocols evolve quickly — package names, mandate fields, and primitive lists move. Before any code stub lands in the codebase, verify the current spec:

- **MCP** — `context7` query for `/modelcontextprotocol/specification`; confirm the SDK package names for the chosen runtime and the current server / client APIs.
- **A2A** — search "A2A protocol spec" / "agent-to-agent agent card schema"; confirm the current Agent Card shape, discovery endpoint, and task envelope.
- **UCP** — search "Universal Commerce Protocol spec"; confirm supplier discovery, catalog query, and order schemas.
- **AP2** — search "Agent Payments Protocol AP2"; confirm the current mandate taxonomy (intent / cart / payment or otherwise), signing scheme, and any reference implementation.
- **A2UI** — search "Agent-to-User Interface protocol primitives"; confirm the current primitive list (≈18 was the snapshot count — treat as a hint, re-verify) and the renderer client.
- **AGUI** — `context7` for `/copilotkit/copilotkit` and search "AG-UI protocol events"; confirm the current event schema (token / tool-call-start / tool-call-end / done / error).

Record in the plan, **per protocol**, the source URL / commit / spec version used. If a spec can't be verified, mark that section `PENDING — verify spec` and skip scaffolding it until the user confirms.

### 4. Write the plan

Write to **`docs/agent-setup-plan.md`** (create `docs/` if missing). Structure, in this order:

1. **Decision log** — the locked answers from Step 1 verbatim, with the date. This is the contract.
2. **Stack summary** — runtime, package manager, existing surfaces, chosen framework.
3. **Protocol sections** — one section per included protocol, using the templates in *The six protocols* below. Each section: *what / why-here / setup steps / code stubs / env vars / verification*. Omitted protocols get a one-line "Skipped because …".
4. **Cross-cutting concerns** — observability (one trace ID across MCP, A2A, AP2, UCP calls), auth (one identity strategy reused across MCP + A2A + AP2), error handling, rate limits, sandbox vs production toggles.
5. **Recommended next steps** — a prioritized numbered list (3–7 items) telling the user which protocol to scaffold first, why, and what unblocks the next. Default order:
   1. **MCP first** — everything else assumes the agent has tools.
   2. **AGUI** (if UI) — needed before A2UI to stream anything.
   3. **A2UI** (if UI) — builds on the AGUI event stream.
   4. **A2A** (if multi-agent / discoverable) — once the agent has tools, expose / consume them.
   5. **AP2** (if commerce) — mandates must exist before any UCP order is placed.
   6. **UCP** (if commerce) — last, so tools and payment rails are already wired when orders start flowing.

End the plan with this exact follow-through prompt:

> Tell me which protocols to scaffold (numbers, names, or "all"), and I'll set them up in that order with a commit per protocol.

### 5. Scaffold per protocol — on the user's pick

When the user picks protocols, scaffold them in the order above (or the explicit order they give), one commit per protocol. For each protocol:

1. **Restate the spec source** verified in Step 3; re-fetch if more than a session has passed.
2. **Run the setup steps** from that protocol's section below — install packages, create files, add env vars to `.env.example`.
3. **Smoke-test** with the verification step at the end of that section.
4. **Commit** with a message like `setup-agent: add MCP server + tools wiring`.

If a chosen protocol depends on another that isn't scaffolded yet (e.g. UCP without AP2 mandates), stop and warn — do not fake the dependency.

## The six protocols

Each section assumes the spec was verified in Step 3. Treat package names and code stubs as **templates** — re-check against the live spec before they land in the codebase.

### A. MCP — Model Context Protocol

**What it is.** A standard for connecting an agent to external tools and data sources at runtime. The agent enumerates and calls tools over a single MCP transport instead of hard-coding tool definitions in the model prompt.

**Why we need it.** Every other protocol below assumes the agent has tools. MCP is the substrate. Without it, every new capability is a hand-rolled function the model has to be told about.

**Setup steps:**

1. **Pick MCP servers**, in priority order: filesystem, web fetch, the project's database (Postgres), a vector store if retrieval is needed, plus any product-specific server. For **Claude Agent SDK**, configure them through the SDK's MCP config. For **OpenAI Agent SDK**, register them via the SDK's tools interface (or an MCP-to-tools adapter if the SDK doesn't speak MCP natively yet).
2. **Add a project-specific MCP server** for any custom tool the agent needs (e.g. `create_profile`, `look_up_order`). Each tool gets a typed schema — `zod` (TS) / `pydantic` (Python). Never accept untyped tool args.
3. **Sandbox + authorize** — tools that touch the filesystem, run code, or hit external APIs must declare their effects and either prompt per-call or honor a stored policy.

**Code stubs (TS — verify package names against current MCP SDK):**

```ts
// lib/agent/mcp-servers.ts
export const mcpServers = [
  { name: "filesystem", command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"] },
  { name: "postgres",   command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres", process.env.DATABASE_URL!] },
  { name: "app-tools",  command: "node", args: ["./mcp/app-tools.js"] }, // custom
];
```

```ts
// mcp/app-tools.ts — a tiny custom MCP server
import { Server } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";
// server.tool("create_profile", { schema: z.object({ … }) }, async (args) => { … });
```

**Env vars:**

```bash
ANTHROPIC_API_KEY=     # Claude Agent SDK
OPENAI_API_KEY=        # OpenAI Agent SDK
DATABASE_URL=          # used by the postgres MCP server, if enabled
```

**Verification:** start the agent, ask it to list tools, confirm the expected ones appear, then call one tool round-trip end-to-end (e.g. read a file via the filesystem server).

### B. A2A — Agent-to-Agent Protocol

*(Include only if multi-agent or "discoverable" was selected.)*

**What it is.** A standard envelope for agents to **advertise themselves** (Agent Card), **be discovered**, and **exchange tasks** — independent of the underlying agent framework.

**Why we need it.** Lets this agent delegate to specialists (research, scheduling, support) and lets other agents call this one — without sharing a runtime.

**Setup steps:**

1. **Publish an Agent Card** at a well-known URL (e.g. `/.well-known/agent.json`) describing this agent's name, capabilities, auth requirements, and task endpoint.
2. **Expose a task endpoint** (`POST /a2a/tasks`) that accepts an A2A message, hands it to the agent runtime, and streams the result.
3. **Add an A2A client** if this agent delegates — discover an Agent Card by URL or registry, validate the schema, and call its task endpoint.
4. **Authenticate** — A2A supports several schemes; pick exactly one and document it (bearer, mTLS, signed-request, or OAuth-on-behalf-of-user).

**Code stubs (Next.js TS — verify Agent Card schema against current A2A spec):**

```ts
// app/.well-known/agent.json/route.ts
export function GET() {
  return Response.json({
    schemaVersion: "1",
    name: "Onex Concierge",
    description: "Books and manages reservations.",
    endpoints: { tasks: "/a2a/tasks" },
    auth: { schemes: ["bearer"] },
    capabilities: ["reservations.search", "reservations.book"],
  });
}
```

```ts
// app/a2a/tasks/route.ts
export async function POST(req: Request) {
  const message = await req.json();
  // validate envelope, authenticate caller, dispatch to agent runtime, stream response.
}
```

**Env vars:**

```bash
A2A_REGISTRY_URL=        # optional discovery registry
A2A_AGENT_BASE_URL=      # this agent's public URL — required in the Agent Card
```

**Verification:** `curl /.well-known/agent.json`, then post a task and read it back. From another agent (or a CLI client), discover this one and round-trip a task.

### C. UCP — Universal Commerce Protocol

*(Include only if commerce = yes.)*

**What it is.** A machine-readable contract for **supplier discovery**, **catalog browsing**, and **structured order placement** — the agent talks to suppliers over a stable JSON shape instead of scraping a checkout page.

**Why we need it.** Commerce agents that parse HTML break the moment a supplier ships a redesign. UCP makes the supplier responsible for exposing its catalog and accepting orders in a stable shape.

**Setup steps:**

1. **Discover suppliers** — via a supplier registry or a well-known endpoint per merchant (e.g. `/.well-known/commerce.json`).
2. **Build a UCP client** in the agent's runtime: list suppliers → query catalog → build a cart → submit an order.
3. **Validate every response** against the UCP schema (zod / pydantic) before it reaches the model — never feed unvalidated supplier JSON into a tool result.
4. **Wire order placement to AP2** — every order must carry a mandate that AP2 signs and tracks. Do not place an order without a mandate.

**Code stubs (TS — verify schema against current UCP spec):**

```ts
// lib/agent/ucp/client.ts
export async function listCatalog(supplierUrl: string, query: { q?: string }) {
  const res = await fetch(`${supplierUrl}/ucp/catalog?q=${encodeURIComponent(query.q ?? "")}`);
  return CatalogSchema.parse(await res.json());
}

export async function placeOrder(supplierUrl: string, order: Order, mandate: SignedMandate) {
  const res = await fetch(`${supplierUrl}/ucp/orders`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-ap2-mandate": mandate.token },
    body: JSON.stringify(order),
  });
  return OrderResultSchema.parse(await res.json());
}
```

**Env vars:**

```bash
UCP_REGISTRY_URL=        # optional supplier registry
```

**Verification:** discover a supplier (fixture or sandbox), pull a catalog, place a test order against the sandbox using a sandbox AP2 mandate. Confirm the response validates against the UCP schema.

### D. AP2 — Agent Payments Protocol

*(Include only if commerce = yes.)*

**What it is.** Typed **mandates** that the user (or their wallet) signs to bound what the agent may spend: amount cap, merchant allow-list, expiry, scope. Every payment carries a verifiable receipt back to the user — an auditable trail of *who authorized what, when, against which agent*.

**Why we need it.** A commerce agent without bounded spend authority is a liability. AP2 gives the user (and the auditor) a typed, signed trail.

**Setup steps:**

1. **Define the mandate types** the app issues — typically *intent* (user's authority to act), *cart* (a specific basket), and *payment* (the final pay-this transaction). **Verify the current AP2 mandate taxonomy** before locking the type names.
2. **Pick a signer / wallet** — provider SDK, the user's own wallet, or a custodial service. Mandates must be signed; do not roll your own crypto.
3. **Build a mandate broker** — a server endpoint where the agent requests a mandate, the user approves (UI or pre-set policy), and the broker returns a signed token.
4. **Persist + audit** — every issued mandate, attempted use, and resulting receipt logged to an append-only table.
5. **Enforce on every payment call** — the AP2 verifier checks the mandate's caps, allow-list, and expiry before any charge is sent. Reject with a clear error if any constraint fails.

**Code stubs (TS — verify mandate fields against current AP2 spec):**

```ts
// lib/agent/ap2/mandate.ts
export type IntentMandate = {
  user_id: string;
  scope: { merchants: string[]; max_amount_cents: number; currency: string };
  expires_at: string;  // ISO
  signature: string;
};

export async function issueIntent(user_id: string, scope: IntentMandate["scope"]) {
  // 1. surface approval UI / check stored policy
  // 2. sign via the wallet provider
  // 3. persist row in `ap2_mandates`
  // 4. return signed token
}

export function verifyMandate(token: string, spend: { merchant: string; amount_cents: number }) {
  // verify signature, decode, check caps + expiry + merchant allow-list — throw on any failure
}
```

**Env vars:**

```bash
AP2_WALLET_PROVIDER=
AP2_WALLET_API_KEY=
AP2_AUDIT_DATABASE_URL=  # optional separate DB for the audit trail
```

**Verification:** issue a sandbox intent mandate with a $10 cap; place a $5 sandbox order via UCP — should succeed and record a receipt. Place a $20 order — should fail before any provider call, surfacing the cap breach.

### E. A2UI — Agent-to-User Interface Protocol

*(Include only if the agent has a web (or otherwise interactive) UI surface.)*

**What it is.** A fixed set of UI **primitives** (button, slider, text field, list, card, …) the agent emits as a JSON document and the client renders natively. The agent doesn't ship HTML — it ships a primitive tree the client knows how to draw. **Verify the current primitive list** in Step 3 — the count was ≈18 at brief time.

**Why we need it.** Lets the agent build *interactive* surfaces (forms, confirmations, choosers) without the client and agent agreeing on every screen in advance. Forms feel native; the agent stays simple.

**Setup steps:**

1. **Adopt the primitive schema** — install the A2UI client renderer for the chosen frontend (React / Next.js).
2. **Build a renderer map** from primitive type → app component, using the project's existing shadcn / Tailwind primitives where possible.
3. **Add an agent tool** (`render_ui`) that emits an A2UI document. AGUI (section F) is what actually streams it to the client.
4. **Handle events from the UI back to the agent** — the client posts user events (submit, change, click) back as tool calls / messages.

**Code stubs (React — verify primitives and prop names against current A2UI spec):**

```tsx
// components/agent-ui/render.tsx
import type { A2UIDoc, A2UINode } from "@a2ui/react"; // package name TBD — verify

const primitives = {
  button: ({ label, action }: A2UINode<"button">) => <Button onClick={() => emit(action)}>{label}</Button>,
  text_field: ({ id, label, value }: A2UINode<"text_field">) => (
    <Input id={id} aria-label={label} defaultValue={value} onChange={onChange(id)} />
  ),
  // …rest of the verified primitive list
};

export function AgentUI({ doc }: { doc: A2UIDoc }) {
  return doc.nodes.map(node => primitives[node.type](node.props));
}
```

**Env vars:** none unique — A2UI piggybacks on the AGUI transport.

**Verification:** the agent emits a small form (`text_field` + `button`); the client renders it; submitting fires a tool call the agent receives and acts on.

### F. AGUI — Agent GUI streaming

*(Include only if UI surface = web or voice.)*

**What it is.** A standardized **event stream from agent to frontend** — tool-call started, partial tokens, tool-call finished, message done, error — so the user sees live progress instead of a blocking spinner.

**Why we need it.** A2UI needs an incremental transport to render as the agent thinks. Without AGUI the UI either blocks until the whole response is ready or invents an ad-hoc streaming format.

**Setup steps:**

1. **Pick the AGUI implementation** — AG-UI (CopilotKit) is the common reference; verify the current event schema.
2. **Wire the server side** — when the agent emits an event (token, tool call, tool result), serialize it to an AGUI event and write it to an SSE / WebSocket / HTTP-stream response.
3. **Wire the client side** — subscribe to the stream, dispatch events into the chat state (tokens append, tool calls show as inline blocks, A2UI documents render via the renderer from section E).
4. **Backpressure + cancellation** — closing the connection must cancel the agent run.

**Code stubs (Next.js TS — verify event names against current AG-UI spec):**

```ts
// app/api/agent/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      for await (const ev of runAgent({ messages })) {
        // ev = { type: "token" | "tool_call_start" | "tool_call_end" | "done" | "error", ... }
        controller.enqueue(enc.encode(`event: ${ev.type}\ndata: ${JSON.stringify(ev)}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "text/event-stream" } });
}
```

```tsx
// components/agent-chat.tsx
useEffect(() => {
  const es = new EventSource("/api/agent");
  es.addEventListener("token",           e => append(JSON.parse(e.data).delta));
  es.addEventListener("tool_call_start", e => showToolCall(JSON.parse(e.data)));
  es.addEventListener("tool_call_end",   e => settleToolCall(JSON.parse(e.data)));
  es.addEventListener("done",            () => es.close());
  return () => es.close();
}, []);
```

**Env vars:** none unique.

**Verification:** trigger an agent run; the client sees tokens appear word-by-word and tool calls render as they happen, not after the whole reply.

## Cross-cutting concerns

Wire these once, share across protocols:

- **Identity.** One token strategy reused across MCP (server auth), A2A (caller auth), and AP2 (signing identity). Don't issue three different credentials for the same user.
- **Tracing.** A single trace / correlation ID per agent run, propagated into MCP tool calls, A2A delegations, UCP requests, and AP2 mandate uses. Makes "what happened in this conversation" a single query.
- **Sandbox toggles.** Every protocol has a sandbox mode — keep an `AGENT_ENV` switch (`development` / `staging` / `production`) and gate live calls on it. The first end-to-end run is always sandbox.
- **Rate limits & retries.** Tool calls (MCP), supplier calls (UCP), payment calls (AP2) all need bounded retries with exponential backoff. Never retry a payment without checking idempotency.
- **Error surface.** A consistent error envelope across all protocols so the AGUI stream can show a single "Something went wrong with X" block instead of six different shapes.

## Rules

- **Confirm scope first** — framework, commerce, UI, multi-agent — before any scan or write.
- **Verify specs at runtime** — these protocols move fast; never bake stale package names or schemas without re-checking via context7 / web search.
- **Plan before scaffolding** — `docs/agent-setup-plan.md` is written first; only scaffold protocols on explicit confirmation.
- **Skip ungated sections** — commerce = no means UCP / AP2 get a one-line "skipped because …" only, not full sections. Same for A2UI / AGUI when there's no UI.
- **One protocol per commit** — each scaffolded protocol gets its own commit so it can be reverted independently.
- **Typed schemas everywhere** — `zod` (TS) / `pydantic` (Python) for every tool arg, mandate, UCP payload, and A2A message. No `any`, no `dict[str, Any]`.
- **Never roll your own crypto** for AP2 — use the wallet provider's signing primitives or a vetted library.
- **MCP first, UCP last** — recommended order is MCP → (AGUI → A2UI) → A2A → AP2 → UCP. Each step assumes the previous; reversing creates dead-ends (placing UCP orders before AP2 mandates exist; rendering A2UI before AGUI can stream).
- **Sandbox before live** — every protocol has a sandbox / test mode. The first end-to-end run is always sandbox.

## When NOT to use this skill

- The user wants a one-off LLM completion (no tools, no multi-turn) — just call the model API directly.
- The agent already exists and only needs a single new tool — add the tool with the relevant MCP / add-tool skill or directly, not the full setup flow.
- The user wants pure RAG / search — that's a retrieval problem, not an agent-protocols one.
- The user is building a non-agentic chatbot — most of these protocols are overkill.
- Pure backend automation with no agentic decision-making — orchestration tools (cron, queues) are usually a better fit.
