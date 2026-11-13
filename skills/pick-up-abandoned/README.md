# pick-up-abandoned

A Claude Code skill that finds the modules you built and never followed through on, then makes you decide what to do with each one: revive it, prove it, park it with a date, absorb it into something else, or kill it.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:pick-up-abandoned`**.

## The problem

It's easy to ask Claude Code for a whole epic in one session. The module gets built, merged and deployed. Then it stalls: it needs keys and a vendor account nobody set up, or the last 20% never got done, or nobody trusts it enough to point users at it, or users simply never found it. Everyone moves on. The module stays in the codebase, deployed and unused, with nobody confident enough to launch it or delete it.

Those modules cost something every day: CI minutes, dependency upgrades, security surface, paid vendors, and the confusion of the next person who finds them.

## What it does

Trigger it with `/onex:pick-up-abandoned`, or say "find abandoned modules", "what did we never finish", "zombie code". Claude will:

1. **Read the register** in `docs/abandoned/register.md` from earlier scans, if there is one.
2. **Ask what usage evidence it can use**: read-only database counts, analytics, your own knowledge, or none.
3. **List candidate modules** by feature (route + API + lib + table), not by folder.
4. **Profile each one**: a bundled git script measures how long since the last meaningful commit (ignoring dependency bumps and repo-wide sweeps), how much was built by Claude Code, and how much landed in the first two weeks. Then it checks reachability (imports, links, crons), gates (flags, missing env vars), completeness (TODOs, stubs, unchecked plan phases) and usage.
5. **Classify and diagnose**: each module is 💀 dead, 🧟 zombie or 🚧 stalled, and stalled on setup, refinement, confidence, adoption or priority.
6. **Give one verdict and one small next step**: 🔁 Revive, 🧪 Prove, 🧊 Park, 🔀 Absorb or 🗑️ Kill, with a use-it-or-lose-it date.
7. **Report** a numbered register you can answer with "kill 3, 7 · revive 2 · prove 1".
8. **Act on your decisions**: do the next step, park behind a flag with an owner, or remove the module on a branch with a 12-point kill checklist (routes, nav links, deps, env vars, crons, vendor webhooks, paid subscriptions, flags, docs, and finally data, in a separate PR).

## How it keeps you honest

- **Quiet isn't abandoned.** A module isn't flagged on git history alone. Finished, used code that rarely changes goes on a "cleared" list so you can trust the scan.
- **Strikes.** Every scan where a module is still flagged and nothing was done adds a strike. At three strikes the verdict becomes Kill unless someone takes ownership with a date.
- **Dates on everything.** Revive, Prove and Park all carry a decide-by date. Undated "later" is how zombies are made.
- **Deletion is a win.** The report totals what the kill list would remove (lines, dependencies, tables, vendors) so cleanup gets credit like a feature does.
- **Read-only until you decide.** The scan never edits code, writes data or changes flags, and it confirms before deleting anything.

## Layout

This skill adds a `scripts/` directory next to `SKILL.md`:

| File | Holds |
|---|---|
| `SKILL.md` | The procedure. |
| `scripts/git-activity.sh` | Read-only git profiler: per path, prints files, lines, first and last meaningful commit, days quiet, Claude Code commit count, build-burst share and a signal (`new`, `active`, `quiet`, `burst-then-quiet`). Portable to macOS bash and BSD awk. |

## Install

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then run `/onex:pick-up-abandoned`. Run it monthly: the register makes each scan build on the last.

## License

MIT
