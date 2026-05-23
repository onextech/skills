# setup-agent

A Claude Code skill that plans and scaffolds an AI agent on top of the six modern agent protocols — **MCP**, **A2A**, **UCP**, **AP2**, **A2UI**, **AGUI** — independent of the underlying model or framework.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:setup-agent`**.

## What it does

When you're starting (or extending) an agent and want it wired correctly for tools, delegation, commerce, payments, and a real-time UI — trigger setup-agent (`/onex:setup-agent`, or "set up an agent", "scaffold an AI agent", "wire up the agent protocols"). Claude will:

1. **Lock the scope** — asks four gating questions before doing anything: which **framework** (Claude Agent SDK / OpenAI Agent SDK), whether there's a **commerce segment** (gates UCP + AP2), whether there's a **user-facing UI** (gates A2UI + AGUI), and whether the agent is **multi-agent or discoverable** (gates A2A). Then runtime / greenfield / identity follow-ups.
2. **Scan the stack** — package manager, existing agent code, existing UI framework.
3. **Verify each protocol's current spec** via context7 / web search — never bakes in stale package names or schemas.
4. **Write a plan** to `docs/agent-setup-plan.md` — decision log, stack summary, one section per included protocol (*what / why-here / setup steps / code stubs / env vars / verification*), cross-cutting concerns (identity, tracing, sandbox), and a prioritized "recommended next steps" list.
5. **Scaffold protocol-by-protocol on confirmation** — one commit per protocol, in dependency order: MCP → AGUI → A2UI → A2A → AP2 → UCP.

## The six protocols at a glance

| Protocol | What it does | Gated by |
|---|---|---|
| **MCP** — Model Context Protocol | Tools and data sources, connected dynamically — no hard-coded tool definitions. | Always included. |
| **A2A** — Agent-to-Agent Protocol | Standardizes agent discovery and cross-framework delegation. | Multi-agent / discoverable. |
| **UCP** — Universal Commerce Protocol | Machine-readable supplier discovery, catalog browsing, structured orders. | Commerce segment = yes. |
| **AP2** — Agent Payments Protocol | Typed mandates that bound spend, restrict merchants, produce auditable receipts. | Commerce segment = yes. |
| **A2UI** — Agent-to-User Interface Protocol | Real-time interactive UIs from a fixed primitive set the client renders natively. | User-facing UI. |
| **AGUI** — Agent GUI streaming | Event stream from agent to frontend (tokens, tool calls, progress, errors). | User-facing UI or voice. |

## How it's different from "just install an SDK"

- **Protocols, not just an SDK.** The Agent SDK is one piece. Tools (MCP), other agents (A2A), suppliers (UCP), money (AP2), UI primitives (A2UI), and the streaming transport (AGUI) are six separate problems with six separate specs.
- **Plan first.** The skill writes a plan before touching code, so you can review what's about to be wired before any package lands.
- **Spec-fresh.** Every protocol's current spec is re-verified at runtime — no stale package names baked into the skill.
- **One commit per protocol.** Each protocol scaffolds independently and is independently revertable.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then trigger it by saying `/onex:setup-agent`, "set up an agent", "scaffold an AI agent", "wire up the agent protocols", or any of the phrases listed in `SKILL.md`'s description.

## License

MIT
