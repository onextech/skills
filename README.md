# skills

The **`onex`** [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) plugin — a collection of OnEx skills for building, reviewing, and shipping software. Once the plugin is installed, every skill is namespaced under the plugin name and invoked as `/onex:<name>`.

Each skill lives in `skills/<name>/` with its own `SKILL.md` and `README.md`. The plugin manifest is in `.claude-plugin/`.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| [`ideate`](./skills/ideate) | `/onex:ideate` | Brainstorm gaps, loopholes, and improvements across a module or app — reviewed as a PM, returned as a categorized, severity-marked numbered list you can pick from. |
| [`add-auth-db`](./skills/add-auth-db) | `/onex:add-auth-db` | Add Better Auth + a Neon Postgres database to a Next.js app using raw SQL (no ORM) — migration runner, admin seeder, email/magic-link/OTP auth, and a login dialog. |
| [`style`](./skills/style) | `/onex:style` | Audit and refactor a module's UI against an opinionated flat-design house style — no shadows, dark/light-safe tokens, consistent sections, dialogs, drawers, text areas, and scrolling. |
| [`style-chat`](./skills/style-chat) | `/onex:style-chat` | Style and structure a chat / assistant UI — composer behavior (Enter newline, ⌘+Enter sends), always-visible bottom input with `+` attachment menu, message timestamp/copy/edit, streaming with auto-scroll, reasoning-model "Thinking…" accordions, header New chat + Delete, suggestion chips, and lightweight-then-reasoning model routing. |
| [`style-hover-effects`](./skills/style-hover-effects) | `/onex:style-hover-effects` | Standardize hover affordances — color-not-geometry (no `translate`/`scale`/`zoom`/`rotate`), defaults per element type (button / card / row / icon button / chip / link variants), `transition-colors` (never `transition-all`), and anti-patterns like "card lifts on hover". |
| [`style-auth-ui`](./skills/style-auth-ui) | `/onex:style-auth-ui` | Style the OAuth / social sign-in buttons of an app's auth UI — official provider icons and brand colors, button layout and sizing, where they sit on the login page and auth dialog, and the loading/error states. |
| [`setup-agent`](./skills/setup-agent) | `/onex:setup-agent` | Plan and scaffold an AI agent on top of the six modern agent protocols — MCP (tools), A2A (agent-to-agent), UCP (commerce discovery), AP2 (agent payments), A2UI (interactive UI primitives), and AGUI (event streaming). Locks framework (Claude/OpenAI Agent SDK) and commerce/UI/multi-agent scope first, writes a plan to `docs/`, then scaffolds protocol-by-protocol on confirmation. |
| [`rewrite`](./skills/rewrite) | `/onex:rewrite` | Audit and rewrite content to remove AI writing patterns — em dashes, hollow intensifiers, vocabulary tells (delve, leverage, robust…), template phrases, hashtag stuffing, chatbot artifacts, and structural uniformity. Detect-only mode and six context profiles (`linkedin`, `blog`, `technical-blog`, `investor-email`, `docs`, `casual`). |

## Install

Add the marketplace, then install the plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Or from your shell:

```bash
claude plugin marketplace add onextech/skills
claude plugin install onex@skills
```

After installing, invoke any skill as `/onex:<name>` — e.g. `/onex:ideate`, `/onex:add-auth-db`, `/onex:style`. Type `/onex:` and the menu filters to just this plugin's skills.

## Local development

To work on the skills against this repo directly (instead of the published GitHub copy), point the marketplace at the local path:

```bash
/plugin marketplace add /absolute/path/to/onex-skills
/plugin install onex@skills
```

A marketplace name is unique, and both this repo and the GitHub copy register as `skills`. If you already added the GitHub one, remove it first:

```bash
/plugin uninstall onex@skills
/plugin marketplace remove skills
/plugin marketplace add /absolute/path/to/onex-skills
/plugin install onex@skills
```

After editing a skill, run `/plugin marketplace update skills` (and reinstall if you bumped `version`) so Claude Code picks up the change.

## Repository layout

```
skills/
├── .claude-plugin/
│   ├── plugin.json        # the `onex` plugin manifest
│   └── marketplace.json   # marketplace catalog listing the plugin
└── skills/
    ├── ideate/SKILL.md
    ├── add-auth-db/SKILL.md
    ├── style/SKILL.md
    ├── style-chat/SKILL.md
    ├── style-hover-effects/SKILL.md
    ├── style-auth-ui/SKILL.md
    ├── setup-agent/SKILL.md
    └── rewrite/SKILL.md
```

## Contributing a new skill

1. Create `skills/<your-skill>/SKILL.md` with YAML frontmatter and the skill body. Include **only** a `description` field — do **not** add a `name` field. The skill name is taken from the directory, and the `onex:` namespace is applied automatically by the plugin. (A `name` field overrides the directory name and suppresses the namespace, so the skill would show as a bare `/<name>` instead of `/onex:<name>`.)
2. Optionally add `skills/<your-skill>/README.md` for a human-facing description.
3. Add a row to the **Skills** table above.
4. Bump `version` in `.claude-plugin/plugin.json`.
5. Open a PR.

## License

MIT — see [LICENSE](./LICENSE).
