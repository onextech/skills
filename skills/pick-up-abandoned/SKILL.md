---
description: "Scan a codebase for abandoned modules (features that were built, often in one Claude Code session, then never adopted, finished or removed) and give a product owner one verdict and one next step per module: revive, prove, park, absorb or kill. Classifies each candidate as dead (unreachable), zombie (deployed but unused) or stalled (half-finished), diagnoses why it stalled (setup, refinement, confidence, adoption or priority), sizes the smallest next step, and sets a use-it-or-lose-it date so nothing stays in limbo. Keeps a register in docs/abandoned/ so modules that survive several scans with no decision escalate toward deletion. Use when the user says \"/onex:pick-up-abandoned\", \"pick up abandoned\", \"find abandoned modules\", \"zombie code\", \"dead features\", \"what did we never finish\", \"what's half-built\", \"unused modules\", \"forgotten features\", \"clean up dead code\", or \"what should we revive or delete\". Do NOT use for line-level lint (unused imports, variables), for reviewing a module that is actively used (use /onex:ideate), or for finishing one feature the user already chose (use /onex:feature)."
---

# /onex:pick-up-abandoned — find abandoned modules, then revive or kill them

Every codebase that moves fast with Claude Code collects the same residue: a module built in an afternoon, merged, deployed, and never touched again. Nobody uses it because it was never surfaced, never set up, never finished, or never trusted. Nobody deletes it because nobody is sure it's safe to. It costs a little every day: CI time, dependency upgrades, security surface, migrations, and the confusion of the next engineer who finds it.

This skill finds those modules and forces a decision on each one. It is written for the **product owner**, not the engineer: the output is a short register of modules, each with evidence, a diagnosis of why it stalled, a verdict, the smallest next step, and a date after which the default is deletion.

**The two outcomes are equally good.** A revived module that ships to users and a deleted module that stops costing money are both wins. The only bad outcome is the one this skill exists to end: a module that stays in limbo.

## Vocabulary

Every candidate gets exactly one **state**, one **stall reason** and one **verdict**.

### States (what the code is)

| State | Meaning | Typical evidence |
|---|---|---|
| 💀 **Dead** | Unreachable. Nothing can execute it in production. | No inbound imports, no route, route not registered, handler not wired, job not scheduled. |
| 🧟 **Zombie** | Deployed and reachable, but nobody uses it. | Live route with no nav link or entry point, empty tables, no analytics events, flag permanently off. |
| 🚧 **Stalled** | Half-built. The work stopped before the module was done. | TODO/stub density, mocked data, unchecked plan phases in `docs/`, skipped tests, "coming soon" copy. |

A module can show evidence for more than one; pick the state that drives the decision (a stalled module nobody can reach is **dead**, because there is nothing to adopt yet).

### Stall reasons (why it stopped)

| Reason | What's missing | The tell |
|---|---|---|
| **Setup** | Config, keys, a vendor account, a migration, a seed, a cron, a webhook registration. | Env vars read in the module but absent from `.env.example`; integration SDK imported but never configured; a migration in the module but nothing seeds it. |
| **Refinement** | The last 20%: edge cases, empty states, errors, mobile, copy. | Stubs, TODOs, placeholder copy, `console.log`, happy-path-only handlers. |
| **Confidence** | Proof it works. Nobody dares to point users at it. | No tests, no error tracking, no golden-path walkthrough, never exercised outside the dev who built it. |
| **Adoption** | A way for users to find it and a reason to try it. | Works end to end, but no nav entry, no onboarding, no announcement, no link from the flow users are already in. |
| **Priority** | Nothing. It was simply deprioritized. | Finished and reachable, but the problem it solves stopped mattering. |

The stall reason matters more than the state, because it decides what the next step is. A module stalled on **adoption** needs a nav link and an announcement, not another sprint of features.

### Verdicts (what to do)

| Verdict | When | The next step looks like |
|---|---|---|
| 🔁 **Revive** | Plausible value, close to done (effort S or M). | Finish the one thing that blocks launch, then ship it to users. |
| 🧪 **Prove** | Value unknown. It works, but nobody knows if anyone wants it. | Surface it to a small cohort for a fixed window with one success metric. Decide on the date. |
| 🧊 **Park** | Real value, no capacity now, carry cost low. | Freeze it behind an off flag, write an owner and a review date into the register. Rare: see Rules. |
| 🔀 **Absorb** | Its useful part belongs inside another module. | Move the part that matters, then kill the rest. |
| 🗑️ **Kill** | Low or no value, or carry cost exceeds value, or it has already survived scans without a decision. | Remove it on a branch, using the removal checklist in Step 6. |

**Bias toward Kill and Revive.** Park is where zombies come from; use it only with a named owner and a review date no more than 90 days out. Code in git history is not lost: deletion is cheap to undo, and a revived module can be restored from the commit that removed it.

## Step 1 — Set up the scan

### (a) Read the register first

If `docs/abandoned/register.md` exists, read it before anything else. It holds every module flagged by earlier scans, the verdict given, the decision made, the owner and the review date. This scan updates it; it does not start over. If no register exists, this is the first scan.

### (b) Pick the scan root

Default to the whole repository. If it is a monorepo (`apps/*`, `packages/*`, `services/*`), list the apps and ask which to scan, with "all" as an option. If the user named a path, use it.

### (c) Ask about usage evidence (one question)

Code and git can prove a module is **unreachable** or **unfinished**. Only usage data can prove a reachable module is **unused**. Ask once, with `AskUserQuestion`:

> To tell "deployed but unused" apart from "quiet but working", I need some usage evidence. What can I use?
> - **Read-only database access** — I'll count rows and the latest `created_at` in each module's tables. No writes.
> - **Analytics or logs** — tell me where (PostHog, GA, Vercel, Sentry, request logs) and I'll check page views and events per route.
> - **I'll tell you** — I'll list the modules and you mark which ones get used.
> - **None — code and git only** — verdicts on zombie candidates will be marked provisional.

Wait for the answer. If the user picks database access, use the connection they give you, run **only** `SELECT` statements, and never print personal data: counts and timestamps only.

Also confirm the quiet threshold if the user hasn't given one: **60 days** without a meaningful commit is the default.

## Step 2 — List candidate modules

A **module** is a unit a product owner would recognize as a feature: something you could put on a roadmap or announce. Not a file, not a utility.

Enumerate candidates with fast surface scans; do not read source line by line yet.

```bash
git ls-files | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn | head -60   # where the code is
ls app/ src/app/ pages/ 2>/dev/null           # route segments (Next.js); one candidate per segment
ls app/api/ src/app/api/ 2>/dev/null          # API route groups
ls apps/ packages/ services/ 2>/dev/null      # monorepo units
ls src/features/ src/modules/ lib/ 2>/dev/null   # feature folders
ls sql/ sql/migrations/ migrations/ prisma/ drizzle/ supabase/migrations/ 2>/dev/null   # data model
ls docs/ 2>/dev/null                          # plans written by /onex:feature, /onex:ideate, /onex:setup-agent
```

Group files into modules by feature, not by folder: a "referrals" module might be `app/referrals/`, `app/api/referrals/`, `lib/referrals.ts`, `components/referral-card.tsx` and a `referral` table. Grepping a feature's noun across the tree usually reveals the whole cluster:

```bash
rg -il 'referral' --glob '!node_modules' --glob '!*.lock'
```

**Exclude** before scoring: vendored and generated code, `node_modules`, lockfiles, build output, test fixtures, past migrations (never a candidate on their own), framework config, and UI primitive libraries (`components/ui/*` from shadcn and the like: unused primitives go in the dead-code sweep, not as modules).

## Step 3 — Profile each candidate

Run the bundled git script once over all candidate paths. It is read-only and prints a TSV row per path:

```bash
bash "<skill-dir>/scripts/git-activity.sh" -q 60 app/referrals app/api/referrals lib/referrals.ts app/billing ...
```

(`<skill-dir>` is the directory this `SKILL.md` is in.)

| Column | Use it for |
|---|---|
| `first`, `last_meaningful`, `days_quiet` | Staleness. Meaningful excludes chores (deps, lint, format, bumps, merges) and repo-wide sweeps, because a module that only ever receives renames and dependency bumps is not being worked on. |
| `claude` | How many commits carry a Claude Code trailer. A module built mostly by Claude in one session is the classic case this skill exists for. |
| `burst_pct` | Share of all lines that landed in the first 14 days. ≥ 70% with a long quiet = built in one sitting, never iterated. |
| `signal` | `burst-then-quiet` is the strongest git signal. `quiet` alone is weak. |

If the script warns about a shallow clone, run `git fetch --unshallow` (ask first if the network is restricted) or treat the dates as lower bounds.

**Quiet is not abandoned.** A stable auth module or a finished settings page can go a year without a commit and be the most used code in the app. Git tells you a module stopped changing; only reachability and usage tell you whether that's a problem. Never flag a module on git signals alone.

Then gather reachability, completeness and usage evidence for each candidate that is not clearly active. Adapt the commands to the stack; these are for a Next.js / TypeScript app:

**Reachability (is it dead?)**

```bash
rg -l "from ['\"][^'\"]*referrals" --glob '!app/referrals/**' --glob '!**/*.test.*'   # inbound imports from outside the module
rg -n "href=[\"'{\`]/referrals|push\(['\"\`]/referrals|redirect\(['\"\`]/referrals" # links and navigations to the route
rg -n "/api/referrals" --glob '!app/api/referrals/**'                                # callers of its API
rg -n "referrals" vercel.json next.config.* middleware.* 2>/dev/null                 # crons, rewrites, middleware gates
```

If the project already has a dead-code tool configured (`knip`, `ts-prune`, `vulture`, `deadcode`, `unimported`), run it and use its output. Do not install one without asking.

**Gates (is it switched off?)**

```bash
rg -n "FEATURE_|ENABLE_|isEnabled\(|useFlag|flags\.|featureFlag|posthog.isFeatureEnabled" -- app lib src
rg -on "process\.env\.([A-Z0-9_]+)" app/referrals lib/referrals.ts | sort -u           # env vars the module reads
cat .env.example 2>/dev/null                                                              # ...and whether they're documented
```

An env var read by the module but missing from `.env.example` is a **setup** stall. A flag defaulting to off with no rollout plan is a **zombie** behind a gate.

**Completeness (is it stalled?)**

```bash
rg -c "TODO|FIXME|HACK|XXX|stub|mock|placeholder|lorem|coming soon|not implemented" app/referrals lib/referrals.ts
rg -n "\.skip\(|xit\(|xdescribe\(|test\.todo|it\.todo" --glob '*referral*'
rg -n -- "- \[ \]" docs/ | rg -i referral     # unchecked plan items
git branch -a --no-merged | rg -i referral    # unmerged branches for the same feature
```

**Usage (is it a zombie?)** — only with the evidence source from Step 1(c):

```sql
-- per table owned by the module: volume and recency, never row contents
SELECT count(*), max(created_at) FROM referral;
```

For analytics, check page views for the module's routes and the events it emits over the last 90 days.

**Carry cost** — what it costs to keep:

- Lines and files (from the script).
- Dependencies only this module uses (`package.json` entries with no import outside it).
- Tables, crons, webhooks, queues and background jobs it owns.
- Env vars and third-party secrets it needs, and any **paid vendor** behind them.
- Security surface: public routes, unauthenticated endpoints, file uploads, webhooks.

## Step 4 — Decide

For each candidate, write down state, stall reason, verdict and next step. Use this order:

1. **Was it already on the register?** If a previous scan flagged it and nobody acted, increment its strike count. At **3 strikes** the verdict is **Kill** unless the product owner overrides it in this session with an owner and a date.
2. **Is it dead?** Dead + no plan to wire it up = **Kill**. Dead + plausible value + effort S = **Revive** (the next step is wiring it in).
3. **Is it a zombie?** Reachable + unused + finished = stall reason is **adoption** or **priority**. Adoption → **Prove** (surface it and measure). Priority → **Kill** or **Absorb**.
4. **Is it stalled?** Estimate the remaining effort from the TODOs, the unchecked plan items and the missing pieces:
   - **S** (≤ 1 day) → **Revive**.
   - **M** (≤ 1 week) → **Revive** if value is plausible, otherwise **Prove** the demand before finishing it.
   - **L** (> 1 week) → **Kill** or **Park**. A large unfinished module nobody has touched in months will not be finished by accident.
5. **Value.** You cannot know business value from code. Infer it from the plan docs, the commit messages and how central the module is, **label it as inferred**, and let the product owner overwrite it in Step 6.

Every verdict except Kill gets a **use-it-or-lose-it date**: the date by which, if the next step hasn't happened, the default becomes Kill. Default: 30 days for Revive and Prove, 90 days for Park.

**The next step must be small.** It is the single action that unblocks the module, sized to under a day where possible. "Finish the referrals module" is not a next step. "Add a Referrals link to the account menu in `components/account-menu.tsx` and post it in the changelog" is. Match the step to the stall reason:

| Stall reason | Next step looks like |
|---|---|
| Setup | List the exact keys, accounts, migrations and seeds needed; add the missing env vars to `.env.example`; write a 5-line setup note in the module's README. |
| Refinement | Name the 3–5 specific gaps blocking launch (not a backlog). Offer `/onex:ideate <module>` for the full list. |
| Confidence | One golden-path E2E test plus error tracking on the module's handlers, then a 15-minute walkthrough on production. |
| Adoption | An entry point in the flow users are already in (nav, empty state, settings), one success metric, an announcement, a cohort and a window. |
| Priority | Usually nothing to unblock: Kill or Absorb. |

## Step 5 — Report

Open with one line: what was scanned and with which evidence. Then a summary table, then one numbered card per flagged module, then the dead-code sweep, then the cleared list, then the picks. **Number cards continuously** so the product owner can answer with numbers. Cap at **15 cards**, ranked by carry cost × days quiet; put the remainder in a one-line-each overflow list.

Mark every claim with its source when it isn't obvious: **(git)**, **(code)**, **(db)**, **(analytics)**, **(inferred)**. Never say "unused" without usage evidence; say "no entry point found" or "no usage data".

```
Scanned the whole repo (184 files across 11 candidate modules) with code, git and read-only DB counts.
6 modules flagged · 3,920 lines · 4 deps · 3 tables · 1 paid vendor.

| # | Module | State | Stalled on | Verdict | Quiet | Decide by |
|---|---|---|---|---|---|---|
| 1 | Referrals | 🧟 Zombie | Adoption | 🧪 Prove | 142 d | 4 Dec |
| 2 | Team invites v2 | 🚧 Stalled | Refinement | 🔁 Revive | 96 d | 4 Dec |
| 3 | AI report builder | 🚧 Stalled | Setup | 🗑️ Kill | 201 d | — |
…

### 1. 🧟 Referrals — 🧪 Prove
`app/referrals/*`, `app/api/referrals/*`, `lib/referrals.ts`, table `referral` · 1,240 lines · quiet 142 days · 11 of 12 commits by Claude Code, 94% built in the first 3 days (git)

- **Evidence:** route `/referrals` is live, but nothing links to it: no match in `components/site-header.tsx` or the account menu (code). `referral` has 0 rows (db). Plan `docs/referrals-plan.md` shows phases 1–3 checked, 4 ("launch") unchecked (code).
- **Stalled on:** Adoption. The feature works end to end; it was never surfaced.
- **Carry cost:** low. 1 table, no deps, no vendor.
- **Next step (½ day):** add a "Refer a friend" item to `components/account-menu.tsx`, add a `referral_link_copied` event, announce it to existing customers. Success = 20 links copied in 14 days.
- **If not by 4 Dec:** Kill. Removes 9 files and the `referral` table (export first).

### 3. 🚧 AI report builder — 🗑️ Kill
…
- **Stalled on:** Setup. Needs `OPENAI_API_KEY` and a paid vector store (`PINECONE_*`); neither is in `.env.example` (code). Phase 2 of 5 unchecked (code).
- **Carry cost:** high. 2 deps used nowhere else (`pinecone`, `langchain`), a public unauthenticated endpoint `app/api/report/route.ts`, a Pinecone subscription.
- **Why kill, not revive:** effort L, no usage, overlaps the export feature in `app/reports/` (inferred).
- **Next step (1 day):** removal PR using the checklist; cancel the Pinecone plan.

…

**Dead-code sweep** — one item, small unreachable files that aren't modules:
7. 🗑️ 14 unused files, 3 unused deps (`date-fns-tz`, `react-confetti`, `zod-to-json-schema`), 9 unused shadcn primitives. One PR, < 1 hour.

**Cleared (quiet but healthy)** — not flagged, so you can trust the list:
- `app/settings` — 210 days quiet, but linked from the nav and 1,800 rows in `user_settings` (db).
- `lib/auth` — 160 days quiet, imported by 38 files (code).

**My picks**
- **Kill now:** 3, 7 — high carry cost, no path to value. Fastest win.
- **Revive first:** 2 — one day from shippable, and users asked for it (inferred from the plan).
- **Prove:** 1 — cheap to surface, and a clear yes/no in 14 days.

> Reply with numbers and a verdict, e.g. "kill 3, 7 · revive 2 · prove 1 · park 5 to Jan, owner Sam". Anything without a decision stays on the register and gets a strike at the next scan.
```

## Step 6 — Record, then act

### (a) Write the register

Save the full report to `docs/abandoned/YYYY-MM-DD.md` and update `docs/abandoned/register.md`, a single table that persists across scans:

```markdown
| Module | Paths | First flagged | Strikes | State | Verdict | Decision | Owner | Decide by | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Referrals | app/referrals, lib/referrals.ts | 2026-11-04 | 1 | Zombie | Prove | Prove — approved | Sam | 2026-12-04 | success = 20 links copied |
```

Rules for the register:

- **Strikes** go up by one each scan a module is still flagged and its decision was not carried out. A module whose next step was done resets to 0; a killed module leaves the register (move it to a `## Removed` section with the commit SHA that removed it, so it can be restored).
- **Decide by** dates that have passed are the first thing the next scan reports.
- Rows the product owner overrode keep their override and the reason.

Do not commit the register unless the user asks; offer to.

### (b) Take the decisions

When the product owner replies with numbers and verdicts:

- **Revive / Prove** — do the next step as a normal task. For anything larger than the next step, offer `/onex:ideate <module>` (gap list) or `/onex:feature` (gated build) rather than improvising a plan.
- **Park** — require an owner and a date. Gate the module behind a flag that defaults to off if it is reachable, add a short `README.md` in the module stating why it is parked and when it will be reviewed, and record both in the register.
- **Absorb** — name the target module, move the useful part with its tests, then run the Kill checklist on what's left.
- **Kill** — on a new branch, work through the checklist below. Show the full list of what will be removed and **wait for confirmation before deleting anything**.

### Kill checklist

Work outward from the module. Each line is something that commonly survives a careless deletion.

1. **Routes, pages, layouts, API handlers, server actions** in the module.
2. **Entry points** to it elsewhere: nav items, links, redirects, sitemap entries, `robots` rules, command-palette entries, onboarding steps.
3. **Components, hooks and lib helpers used only by it** (re-run the inbound-import search after each removal: deleting one file can orphan another).
4. **Tests, fixtures, stories and mocks** for it.
5. **Dependencies used only by it**: remove from the manifest and refresh the lockfile.
6. **Env vars**: remove from `.env.example`, and list the ones to delete from the hosting provider (the user does this; you can't).
7. **Scheduled work**: crons (`vercel.json`, GitHub Actions schedules), queues, background workers.
8. **External registrations**: webhooks registered with vendors (Stripe, GitHub, Slack), OAuth apps, DNS records. List them for the user to remove.
9. **Paid vendors** it was the only consumer of. List them for the user to cancel: this is often the largest saving.
10. **Feature flags** that gated it, in code and in the flag service.
11. **Docs and plans**: move its plan in `docs/` to an archive section or delete it; update the README if it mentions the feature.
12. **Data** — last, and separately:
    - Never edit or delete past migrations.
    - Ship the code removal first. Drop tables in a **second, later PR** with a new migration, only after the user confirms the data is exported or worthless and nothing reads it.
    - If the table holds personal data, flag it: deletion may be required (retention obligations), or export may be required first. Point to `/onex:pdpa-audit` when Singapore PDPA applies.

After removal, run the project's typecheck, lint, tests and build, and report the real output. Commit message: `chore(<module>): remove abandoned <module>` with a body listing what was removed and the register entry, so the commit is easy to find and revert.

### (c) Offer the next scan

Close by offering to scan again on a schedule (monthly is a good default) if the environment supports scheduled or recurring tasks. Otherwise tell the user the earliest "decide by" date on the register: that's when the next scan is due.

## Rules

- **Read the register first.** A scan that ignores earlier scans can't escalate, and escalation is the point.
- **Never flag on git alone.** Quiet code is often finished code. Every flagged module needs reachability, completeness or usage evidence.
- **Never call something unused without usage evidence.** Say "no entry point found" or "no usage data", and mark the verdict provisional.
- **One verdict per module, one next step per verdict.** No menus of options on a card.
- **Every next step names a file or an action.** "Improve adoption" is not a next step.
- **Every non-Kill verdict has a date.** Undated Park is how modules become zombies.
- **Business value is the product owner's call.** Label inferred value as inferred, and accept overrides without argument.
- **Read-only until a decision is made.** The scan never edits code, runs migrations, writes to a database or changes flags. Database access is `SELECT` only, counts and timestamps only.
- **Confirm before deleting.** Show the removal list, then wait.
- **Data is removed last and separately.** Code first, tables in a later PR after export.
- **Credit the cleanup.** In the summary line, report what a full kill list would remove (lines, deps, tables, vendors). Deleting a zombie is a shipped improvement; say so.

## When NOT to use this skill

- **Line-level dead code** (unused imports, variables, parameters): that's a linter's job.
- **A module people actively use** that needs improvement: use `/onex:ideate`.
- **Finishing a feature the user already picked**: use `/onex:feature`.
- **Performance or security review**: this skill reports security surface only as carry cost.
- **A brand-new repo** with no history worth reading: everything is "new" and nothing is abandoned yet.
