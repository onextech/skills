# onex-skills

The **`x`** [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) plugin — a collection of OnEx skills for building, reviewing, and shipping software. Once the plugin is installed, every skill is namespaced under `x:` and invoked as `/x:<name>`.

Each skill lives in `skills/<name>/` with its own `SKILL.md` and `README.md`. The plugin manifest is in `.claude-plugin/`.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| [`ideate`](./skills/ideate) | `/x:ideate` | Brainstorm gaps, loopholes, and improvements across a module or app — reviewed as a PM, returned as a categorized, severity-marked numbered list you can pick from. |
| [`add-auth-db`](./skills/add-auth-db) | `/x:add-auth-db` | Add Better Auth + a Neon Postgres database to a Next.js app using raw SQL (no ORM) — migration runner, admin seeder, email/magic-link/OTP auth, and a login dialog. |
| [`style`](./skills/style) | `/x:style` | Audit and refactor a module's UI against an opinionated flat-design house style — no shadows, dark/light-safe tokens, consistent sections, dialogs, drawers, text areas, and chat UI. |

## Install

Add the marketplace, then install the plugin:

```bash
/plugin marketplace add onextech/onex-skills
/plugin install x@onex-skills
```

Or from your shell:

```bash
claude plugin marketplace add onextech/onex-skills
claude plugin install x@onex-skills
```

After installing, invoke any skill with `/x:<name>` — e.g. `/x:ideate`, `/x:add-auth-db`, `/x:style`.

## Repository layout

```
onex-skills/
├── .claude-plugin/
│   ├── plugin.json        # the `x` plugin manifest
│   └── marketplace.json   # marketplace catalog listing the plugin
└── skills/
    ├── ideate/SKILL.md
    ├── add-auth-db/SKILL.md
    └── style/SKILL.md
```

## Contributing a new skill

1. Create `skills/<your-skill>/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill body. The `name` stays a bare slug — the `x:` namespace is applied automatically by the plugin.
2. Optionally add `skills/<your-skill>/README.md` for a human-facing description.
3. Add a row to the **Skills** table above.
4. Bump `version` in `.claude-plugin/plugin.json`.
5. Open a PR.

## License

MIT — see [LICENSE](./LICENSE).
