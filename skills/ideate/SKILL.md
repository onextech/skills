---
description: Brainstorm gaps, loopholes, and improvement ideas across an entire module or app, reviewed through a product manager's lens. Always confirms scope first by asking which module to review (with a detected list to pick from) unless the user already named one. Returns a thematic, severity-marked, continuously-numbered list and ends with a prioritized "top 5 this week" pick, then offers to phase implementation. Use when the user says "ideate", "ideate on X", "what are we missing", "review this as a PM", "what could we improve", "brainstorm gaps", "loopholes in this", "what's next on this module/app", or asks for a numbered list of refinements at the module or product level. Do NOT use for bug fixes, one-line changes, pure code reviews, or architectural decisions — this is product-thinking scope at the module/app level, not engineering scope.
---

# Ideate

Brainstorm gaps and improvement ideas across an **entire module or app**, reviewed as a senior product manager. The goal is to surface what a heads-down engineer most likely missed across the whole surface — security, activation, billing, ops, growth, polish — then let the user pick which items to implement next.

**Scope is module- or app-level, not a single feature or recent diff.** This is intentionally broader than a code review or a feature retrospective.

## How to run

### 1. Confirm scope — REQUIRED first step

You MUST establish which module/app you are ideating on before generating any ideas. Run this decision in order:

1. **If the user explicitly named a module/app in their prompt** (e.g. "ideate on the auth module", "ideate the admin panel", "review the billing flow as a PM"), use that and proceed.
2. **Otherwise, detect candidate modules and ask the user to pick.** Do not guess. Do not default to "the recent diff" or "the whole repo at once" — both produce shallow results.

To detect candidate modules, inspect the working tree without reading source code line-by-line:

- For Next.js/monorepo apps: list `apps/*`, top-level `app/` route segments (e.g. `app/dashboard`, `app/admin`, `app/[slug]`), and large `components/` or `lib/` clusters.
- For backend services: list top-level packages/services, route groups, or bounded contexts.
- For libraries: list top-level exports or feature folders.
- Use `git ls-files | head -200`, `ls -la apps/`, `ls -la app/`, or equivalent — fast surface scan, no deep reads.

Then ask the user with `AskUserQuestion` (or a clear question if the tool isn't available), offering 3–5 detected candidates plus an "entire app" option. Example:

> Which module should I ideate on?
> - **auth** — sign-in/sign-up flows, sessions, password reset (`lib/auth.ts`, `app/(auth)/*`)
> - **dashboard** — owner-facing profile editor (`app/dashboard/*`)
> - **admin** — operator UI for managing users/profiles (`app/admin/*`)
> - **public profile** — `/[slug]` rendering, vCard, OG image, agent chat (`app/[slug]/*`)
> - **billing** — Stripe checkout, webhooks, entitlements (`app/api/stripe/*`, `lib/billing.ts`)
> - **entire app** — cross-cutting review across everything above

Wait for the answer. **Do not generate ideas until scope is confirmed.**

### 2. Map the module before reviewing

Once scope is set, build a quick mental map (5–10 minutes of reading max) so the review is grounded in what actually exists:

- The main entry points and routes in the module.
- Server actions / API endpoints / mutations the module exposes.
- Data model touchpoints (which tables, which schemas).
- External integrations (Stripe, email, storage, third-party APIs).
- The user-visible flows the module supports end-to-end.

You are mapping the **surface area** — not auditing every line. If the module is large, skim. If it's tiny, you'll know within a minute.

### 3. Review as a PM, across the full module surface

Apply a senior product manager's lens — **not** a code reviewer's. Skip naming, lint, micro-refactors. The review must span these themes (omit any theme that genuinely doesn't apply, but check each one):

- **Security & correctness** — Real bugs, secrets, auth gaps, injection vectors, abuse paths.
- **Onboarding & activation** — How a new user goes from zero → value. Drop-off points.
- **Billing & monetization** (if applicable) — Upgrade paths, refunds, portals, tax, multi-currency.
- **Feature gaps** — What the module promises but doesn't fully deliver.
- **Admin / operator UX** — Can the team support, debug, and manage users without DB access?
- **Public-facing / agent surface** (if applicable) — Spam, abuse, caching, personalization.
- **SEO & growth** — Indexability, sitemaps, attribution, viral loops.
- **Reliability, ops & data hygiene** — Error tracking, GDPR, soft-deletes, migrations.
- **Tests & DX** — Golden-path E2E, lint, dev ergonomics.
- **Polish** — Mobile layout, toasts, 404s, copy.

### 4. Output the thematic, severity-marked list

Use **lettered thematic sections (A, B, C…)** with **continuous numbering across all sections** (1, 2, 3… running through every section). Each item is one sentence (occasionally two if the fix needs to be named). Reference concrete file paths where you can — they make items actionable instead of abstract.

**Severity markers** — prefix every item with one:

- 🔴 **ship-blocker** — real bug, open security hole, or correctness issue that must be fixed before the module is on a real domain or used by a real user.
- 🟡 **strong-recommend** — will bite within the first 20–100 users; near-term obligation.
- 🟢 **next-quarter** — makes the product, not just the demo; nice-to-have or future bet.

Open with a one-line scoping statement ("Putting on the PM hat and reviewing the X module…"). Then the lettered sections. **Aim for 25–50 items** for a real module review — this is intentionally broader than a feature ideate; if you only find 10, either the module is tiny or you didn't look hard enough.

Then close with **two required sections**:

#### "My pick for 'if you do 5 things this week'"

A short numbered list (3–5 items) calling out the highest-leverage picks from the full list, referencing them by their numbers. Each pick gets a one-line "why this one" rationale.

#### Follow-through prompt

End with exactly this line (do not paraphrase):

> Let me know which numbers you want to pursue (and any reordering) and I'll work them in slices.

### 5. Handle the user's picks

When the user replies with numbers — or says "do all the red and yellow items", or "phase out the top 10" — implement them as a normal task. Default behavior:

- If the user asks to do **multiple items** or **all of a severity bucket**: phase the work. Write a short plan to `docs/` (or wherever the project keeps plans) detailing each phase before executing, and commit after each phase before moving on. Confirm the plan location with the user if unclear.
- If the user picks **1–3 specific numbers**: just implement them as one slice unless they say otherwise.
- If any pick is ambiguous (e.g. "number 12" but two items could match), confirm scope before writing code.
- If the user says "skip" or signals they are done, stop cleanly.

## Output shape (illustrative — abridged)

```
Putting on the PM hat and reviewing the **billing** module (`app/api/stripe/*`, `lib/billing.ts`, `app/pricing/*`, the upgrade flow in `app/dashboard/upgrade/`). Findings grouped by theme — numbered continuously so you can reference them. Severity markers: 🔴 ship-blocker · 🟡 strong-recommend · 🟢 next-quarter.

**A. Security & correctness**

1. 🔴 Stripe webhook signature isn't verified in `app/api/stripe/webhook/route.ts` — any caller can post fake checkout-completed events and grant entitlements. Use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`.
2. 🔴 Entitlement is written from the client success-page redirect in `app/checkout/success/page.tsx` rather than the webhook — a user can refresh that page after refund and re-grant themselves access.
3. 🟡 No idempotency key on the Checkout Session create call; a double-click on "Upgrade" creates two sessions and two charges.

**B. Billing & monetization**

4. 🟡 No Stripe Customer Portal wired up — users can't update payment method, download receipts, or cancel. One server action + one link.
5. 🟡 No upgrade path Personal → Pro at the price delta; today the user would re-pay full Pro price.
6. 🟢 Annual SKU isn't offered — Stripe supports it natively; ~15% revenue lift typical.

**C. Admin / operator UX**

7. 🟡 No way to issue a refund from `app/admin` — operators currently jump into the Stripe dashboard. Add a "Refund" button on the order row with confirm + reason.
8. 🟢 Audit log of admin billing actions (refunds, comp upgrades, manual entitlement grants) doesn't exist.

… (sections D–J, items 9–40+)

---

**My pick for "if you do 5 things this week"**

1. **Items 1, 2** — webhook signature + move entitlement to webhook. Anything else is moot if entitlements aren't trustworthy.
2. **Item 4** — Stripe Customer Portal. The first refund request is coming; this is one server action.
3. **Item 7** — refund button in admin. Removes the "jump into Stripe dashboard" tax on the team.
4. **Item 3** — idempotency. Cheap; prevents the support tickets nobody wants to debug.
5. **Item 5** — upgrade path. Currently blocking a real user request.

> Let me know which numbers you want to pursue (and any reordering) and I'll work them in slices.
```

## Rules

- **Always confirm module scope first** — never default to "the recent diff" or "the whole repo at once". The required first question prevents shallow reviews.
- **Continuous numbering across all sections.** Start at 1 in section A and count through to the end.
- **Severity markers on every item.** No unmarked items.
- **Reference real files.** `app/foo/bar.ts` beats "the billing service" — every time.
- **One sentence per item** (two max if the fix needs naming). No paragraphs, no sub-bullets.
- **25–50 items for a real module review.** Fewer is acceptable only if the module is genuinely small.
- **No code-style critiques.** This is PM scope. Code smells belong in a code-review skill.
- **Every item must be actionable.** "Improve UX" is not an item; "Add an empty state to the dashboard's profiles table when the user has zero profiles" is.
- **Always end with the 'top 5 this week' pick** and the follow-through prompt verbatim.

## When NOT to use this skill

- **Bug fixes** — just fix the bug; ideation is overhead.
- **One-line changes** — surface area too small.
- **Code review requests** — use a code-review skill or agent; this is PM scope.
- **Architectural decisions** — those need a plan or design doc, not a brainstorm.
- **Greenfield feature design** — this skill reviews what *exists*, not what *might exist*.
- **Single recent feature only** — if the user really wants a tight review of just the last diff, that's fine, but confirm scope first; the default is module-wide.
