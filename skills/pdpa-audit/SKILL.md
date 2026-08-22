---
description: Audit an app, module, or data model against Singapore's Personal Data Protection Act (PDPA) — build a personal-data inventory from the actual schema and code, then test it against the data protection obligations, the NRIC rules, the Do Not Call provisions, breach notification, and cross-border transfer. Confirms scope first (which app/module, whether Singapore PDPA is the governing regime, whether the org acts as an organisation or a data intermediary), then returns a thematic, severity-marked, continuously-numbered finding list with paragraph-level PDPC citations and a concrete fix per finding, and offers to phase the remediation. Use when the user says "/onex:pdpa-audit", "pdpa audit", "are we PDPA compliant", "audit personal data", "privacy audit", "check how we handle NRIC", "data breach obligations", "do not call registry", "DNC check", "PDPC", "personal data inventory", or "retention policy audit". Do NOT use for drafting the privacy policy or terms themselves — that is `/onex:add-terms-privacy`; not for generic application security review (auth, injection, secrets); and not for GDPR-only or EU-only apps, which this skill does not cover.
---

# /onex:pdpa-audit — Singapore PDPA audit

Audit what an app actually does with personal data against **Singapore's Personal Data Protection Act (PDPA)** and the PDPC's advisory guidelines. The skill reads the schema, the code, and the integration surface to build a real personal-data inventory, then tests that inventory against each data protection obligation, the NRIC rules, the Do Not Call provisions, breach notification, and cross-border transfer. Output is a severity-marked, numbered finding list where every item names a file or a column, cites the obligation by paragraph, and states the fix.

> **This is engineering guidance, not legal advice.** It tells you where the code and the data model diverge from what the PDPA and the PDPC's guidelines require, at the level of detail an engineer can act on. It does not decide your organisation's legal position, and it is not a defence. **Material findings — anything marked 🔴, anything touching NRIC, and every suspected breach — go to counsel or your DPO**, not into a commit.
>
> **Scope is Singapore.** This skill covers the PDPA only. It does not cover GDPR, UK GDPR, CCPA, or any sectoral regime (MAS TRM, HIPAA, PCI DSS). Overlap is real but the obligations are not the same — see Step 1(b).

## How this skill is laid out

This skill deviates from the repo's usual two-file (`SKILL.md` + `README.md`) layout by adding a `references/` directory. The reason is size: the cited corpus — the obligations with their paragraph numbers, the Annex B/C checklists, the NRIC rules, the DNC provisions, the breach thresholds, the AI advisory — runs to thousands of lines, and none of it needs to be in context to *start* an audit. `SKILL.md` stays the procedure; `references/` holds the law. **Read a reference file when you reach the step that needs it, not before.**

| File | Holds |
|---|---|
| [`references/sources.md`](./references/sources.md) | Source register — every PDPC document cited, its cover date, URL, and how currency was verified. |
| [`references/obligations.md`](./references/obligations.md) | The data protection obligations, cited by paragraph, plus the Annex B / Annex C checklists and the penalty regime. |
| [`references/nric.md`](./references/nric.md) | NRIC/FIN collection, use and disclosure rules, and the 31 Dec 2026 authentication deadline. |
| [`references/marketing-dnc.md`](./references/marketing-dnc.md) | Specified messages, the DNC registers, the Eighth Schedule exemptions, and real-estate marketing. |
| [`references/breach.md`](./references/breach.md) | Breach assessment thresholds and the notification deadlines. |
| [`references/ai-and-transfers.md`](./references/ai-and-transfers.md) | The Generative AI advisory and the Transfer Limitation Obligation. |

Work through the steps **in order**. Do not audit before Step 1 is answered.

## Step 1 — Confirm scope (REQUIRED first step)

**Do not audit blind.** A PDPA audit over "the whole repo" produces a list of generalities; a PDPA audit over a named module with a known regime and a known role produces findings someone can fix. Establish all three of the following, then wait.

### (a) Which app or module

If the user named one, use it. Otherwise detect candidates with fast surface scans — no deep reads:

```bash
git ls-files | head -200                 # overall shape
ls app/ apps/ 2>/dev/null                # route groups / monorepo apps
ls sql/ sql/migrations/ 2>/dev/null      # migrations = where the data model actually lives
rg -l 'CREATE TABLE' sql/ | head -40     # candidate tables
```

Then enumerate the tables that look like they hold people, and offer 3–5 candidate scopes plus an "entire app" option via `AskUserQuestion`. Name real paths in each option — `crm` (`app/crm/*`, `client`, `client_note`) beats "the CRM module".

### (b) Is Singapore PDPA the governing regime

Ask explicitly. **The PDPA applies to organisations that collect, use or disclose personal data in Singapore, regardless of where the organisation is.** The question that changes the answer is whether there are **EU/UK data subjects**: GDPR overlaps the PDPA substantially but is stricter in places this skill does not check (DPIAs, Article 30 records, lawful-basis documentation, the 72-hour breach clock, DSAR scope). If the user says yes to EU/UK users, say plainly that this audit covers the PDPA half only and that the GDPR half needs separate work — then continue.

### (c) Organisation or data intermediary

The obligations differ and this changes which findings apply.

- **Organisation** — you decide the purposes. All obligations apply.
- **Data intermediary** — you process personal data *on behalf of and for the purposes of another organisation, under a written contract*. Only the Protection and Retention obligations apply to you directly (plus breach notification **to the principal**, not to the Commission).
- **Both** — the common case. A SaaS is an organisation for its own account data and an intermediary for its customers' end-user data. Ask which data sets fall on which side and audit them separately.

A vendor's status is not permanent — see the ¶6.25 trap in Step 3.

**Wait for the answer. Do not produce findings until scope is confirmed.**

## Step 2 — Build the personal-data inventory

This is the heart of the audit and it must be concrete. You are not describing categories of data in the abstract; you are listing the columns, the fields, and the wires that carry them.

### 2.1 Discover the fields

Run the pattern over the schema first, then over the code — the schema tells you what is stored, the code tells you what is in flight.

```bash
# Schema: columns that smell like personal data
rg -in 'nric|fin|passport|uen|dob|date_of_birth|birth|mobile|phone|email|address|postal|photo|avatar|salary|income|bank|account_no|next_of_kin|marital|nationality|race|religion|gender' \
  sql/ --glob '*.sql'

# Code: the same surface in types, forms, and payloads
rg -in --glob '!node_modules' --glob '!*.lock' \
  'nric|fin|passport|uen|dob|date_of_birth|birth|mobile|phone|email|address|postal|photo|avatar|salary|income|bank|account_no|next_of_kin|marital|nationality|race|religion|gender' \
  lib/ app/ components/ actions/

# NRIC specifically — word-boundaried, because "fin" and "dob" over-match
rg -inw 'nric|fin|uin' --glob '!node_modules'
```

Read the hits with judgement: `email` on a `notification_template` row is not personal data; `email` on a `client` row is. **A pattern miss is not an absence** — also read the `CREATE TABLE` statements for the tables Step 1 scoped, in full, and scan free-text columns (`notes`, `description`, `remarks`, `message`, JSONB blobs) because unstructured fields are where NRICs and salaries actually end up.

### 2.2 Map the crossing points

Every place personal data leaves your process is a disclosure or a transfer, and each one needs a basis, a contract, or both.

- **Third-party SDKs** — anything in `package.json` that phones home. Session replay and heatmap tools capture form contents by default.
- **Analytics** — check whether user IDs, emails, or phone numbers are sent as event properties or user traits.
- **LLM / AI providers** — prompts, tool arguments, retrieved context, and outputs. See Step 4.
- **Email / SMS / WhatsApp senders** — Resend, Twilio, SendGrid. Recipient lists are personal data; template variables often carry more.
- **Object storage** — uploaded documents, ID scans, signed PDFs, avatars. Check whether the bucket is public and whether object keys are guessable.
- **Error trackers** — **`Sentry.captureException(error, { extra: { ... } })` is a classic PII leak.** Grep every capture site and read what is in `extra`, `tags`, `setUser`, and the breadcrumb payloads. An error object that carries the row that caused it ships that row to a third-party US-hosted service.
  ```bash
  rg -n 'captureException|captureMessage|setUser|setContext|addBreadcrumb' --glob '!node_modules' -A 4
  ```
- **Server logs and `console.log`** — logs are retained personal data with no retention policy and usually no access control.
  ```bash
  rg -n 'console\.(log|info|warn|error)' app/ lib/ actions/ scripts/ | rg -i 'user|client|profile|nric|phone|email|payload|body|row'
  ```

### 2.3 Map the collection points and the disclosure points

- **Collection** — public forms, authenticated forms, CSV/Excel imports, scrapers and enrichment jobs, inbound webhooks, third-party syncs, support inboxes. For each: was notification given, and what purposes were stated?
- **Disclosure** — data exports, generated PDFs and reports, share links (are they unguessable? do they expire?), public routes, sitemap/OG endpoints, admin impersonation, downstream API pushes.

Scraped and enriched data deserves its own line: collecting personal data from a third-party site does not create consent, and "it was publicly available" is a narrow exception, not a general one — check `references/obligations.md` before assuming it covers you.

### 2.4 Output the inventory table

Produce this before any findings. It is both an artefact the user keeps and the evidence base for Step 3 — a finding that does not trace to a row here is a finding you guessed.

| Data element | Where stored | Why collected | Legal basis | Disclosed to | Retention | Encrypted at rest |
|---|---|---|---|---|---|---|
| `client.nric_enc` | Postgres, AES-GCM | AML/CDD for a transaction | Consent + legal obligation | None | 5 yrs post-transaction | Yes (app-layer) |
| `client.mobile` | Postgres | Contact, WhatsApp sends | Consent | Twilio (SG/US) | Life of relationship | No |

Fill every cell. **"Unknown" is a legitimate value and a finding in itself** — an inventory with unknowns is honest; an inventory with invented bases is worse than none. Where the basis is unclear, write `UNKNOWN — see finding #n`.

## Step 3 — Audit against the obligations

Keep this pass short and mechanical. Walk each obligation, ask the one question next to it, and record a finding where the answer is no. **The cited rules, the paragraph numbers, and the Annex B / Annex C checklists live in [`references/obligations.md`](./references/obligations.md)** — read it now, cite from it, and do not restate law from memory.

| Obligation | Look for |
|---|---|
| **Consent** | A real consent record per purpose, with timestamp and version — not an implied checkbox and not a `terms_accepted` boolean. |
| **Purpose Limitation** | Each use traces to a purpose that was actually notified; no silent repurposing of data collected for something else. |
| **Notification** | The notice was given *at or before* collection, at every collection point, and states purposes a reasonable person would understand. |
| **Access & Correction** | A working path to produce an individual's data and their disclosure history, and to push corrections downstream. |
| **Accuracy** | Data used to make a decision about someone is verified and current, especially where it came from a scraper or an import. |
| **Protection** | Access control, encryption at rest for sensitive fields, least privilege on admin surfaces, and no personal data in logs. |
| **Retention** | A defined period per data class, and a job that actually deletes — plus the soft-delete trap below. |
| **Transfer Limitation** | Overseas recipients bound to a comparable standard by contract, with countries named. See Step 4. |
| **Data Breach Notification** | An assessment procedure, an owner, and a route that meets the clocks in the quick-reference table. |
| **Accountability** | A named DPO with published contact details, documented policies, and staff who have been trained. |

Four obligations are surfaced inline because they are the highest-yield and most commonly missed — check these explicitly, every time:

1. **Soft-delete does not discharge retention (¶18.11).** Archived, anonymised-in-name-only, or access-limited data is still *retained*. A `deleted_at IS NOT NULL` row is retained personal data; so is a row moved to an archive table, and so is a nightly backup that never expires. Retention ends at deletion or genuine anonymisation, and nothing less.
2. **An access request is a legal hold (¶15.40–15.42, s22A).** Once an individual makes an access request, the data in scope must be preserved — which means the request has to **suppress TTL, purge, and retention jobs** for those rows. Where access is refused, preserve the withheld data for at least 30 calendar days. An audit finding here is usually structural: the purge cron has no idea an access request exists.
3. **Per-purpose withdrawal is mandatory (¶12.42(c)).** A single global consent boolean fails by construction — an individual may withdraw consent for *one* purpose while continuing the service. Withdrawal must also **fan out to processors and downstream recipients (¶12.52)**, and **withdrawal is not deletion (¶12.54)** — the two are separate rights and the code must implement both, separately.
4. **A vendor that reuses your data for its own purposes stops being a data intermediary (¶6.25).** When the contract or the vendor's terms allow it to use the data to improve its own product, train models, or build its own profiles, it is an organisation in its own right — and your handover to it is a **disclosure requiring consent**, not processing under instruction. Read the actual DPA terms of every processor in the Step 2.2 list, not the marketing page.

## Step 4 — Singapore hard edges

These four are where Singapore diverges most sharply from generic privacy practice, and where a GDPR-shaped review will miss things outright. Keep the audit lines tight; the detail is in the linked references.

### NRIC / FIN — and the 31 December 2026 deadline

**From 31 December 2026, organisations must cease using the NRIC number for authentication.** The NRIC number is an identifier, not a secret: it must **never** be used as a password, as a default password, as an authentication factor, or as part of one — no "last 4 digits of your NRIC" to log in, retrieve a booking, or verify a caller. Audit any such flow as 🔴 with a dated remediation.

The collection line: **the transaction can justify a full NRIC; the enquiry, the viewing sign-in, and the prospect record cannot.** Ask of every NRIC field — is there a legal requirement, or is this a transaction where accurate identification actually matters? If it is a lead form, a visitor log, a newsletter, or a "just in case" column, the NRIC should not be collected at all. Physical NRIC scans and photocopies get the same test. → [`references/nric.md`](./references/nric.md)

### Do Not Call

Marketing messages sent to **Singapore telephone numbers** engage the DNC provisions, and **WhatsApp is expressly in scope** alongside SMS and voice. Two clocks matter and they are different things: a **register check is valid for 21 days**, and an **opt-out must be effected within 21 days**. Audit for a stored check result with a timestamp — not a check performed once at import — and for an unsubscribe path that reaches the send job.

The trap: **PDPA consent and DNC consent are separate gates.** Having consent to hold someone's number under the Data Protection Provisions does not entitle you to send them a marketing message; clear DNC exemption requires its own basis. → [`references/marketing-dnc.md`](./references/marketing-dnc.md)

### Breach notification

Three numbers: **30 days to assess** whether a breach is notifiable, **3 calendar days to notify the Commission** once it is assessed as notifiable, and **500 individuals** as the scale limb that makes a breach notifiable regardless of harm. Audit for a written procedure, a named owner, and evidence the clocks can actually be met — an incident channel that is only read on weekdays cannot meet a 3-calendar-day deadline. → [`references/breach.md`](./references/breach.md)

### AI and overseas transfer

**Prompts, tool arguments, retrieved context, model outputs, and request logs are personal data that you now control.** Sending a client record into a model is a use and — where the provider is a separate organisation — a disclosure. Two specifics:

- **Training on user data requires an AI-Specific Notification, not a general one.** A privacy policy line about "improving our services" does not cover using customer personal data to train or fine-tune a model.
- **Transfer contracts must name countries.** A clause promising a "comparable standard of protection" without identifying where the data goes does not satisfy the Transfer Limitation Obligation. Check the processor list from Step 2.2 against the actual contracts. → [`references/ai-and-transfers.md`](./references/ai-and-transfers.md)

## Step 5 — Output the findings

Open with a one-line scoping statement naming the module, the regime, and the role established in Step 1. Then the inventory table from Step 2.4. Then the findings.

Use **lettered thematic sections (A, B, C…)** — group by obligation or by hard edge — with **continuous numbering running across every section** (1, 2, 3…), so the user can reference an item by number.

**Severity markers — every finding carries exactly one:**

- 🔴 **unlawful-now** — a live unlawful collection, use, or disclosure, or a gap that would itself trigger breach notification. Fix or stop the flow.
- 🟡 **obligation-gap** — a clear obligation with no implementation behind it. Not currently unlawful in effect, but nothing stands between you and it.
- 🟢 **hardening** — implemented, but thin. Works today; fails under scrutiny, scale, or an actual access request.

**Every finding states four things, in this order:**

1. **What** — one sentence, specific.
2. **Where** — `file.ts:120` or `table.column`. Never "the CRM module".
3. **Which obligation, with its paragraph cite** — e.g. *Retention Limitation, ¶18.11*. Cite from `references/`, never from memory.
4. **The fix** — concrete and scoped to this codebase.

Illustrative shape:

```
**B. Retention Limitation**

7. 🔴 Deleted clients are soft-deleted only — `client.deleted_at` is set and the row, including `nric_enc` and `mobile`, is retained indefinitely with no purge job (`actions/clients.ts:212`). Soft-delete does not discharge retention (¶18.11). Add a purge job that hard-deletes rows past the retention period, and exclude rows under an active access request.
8. 🟡 No retention period is defined for `client_note` free-text, which the Step 2 scan shows carries NRICs and salary figures (`sql/migrations/0031_client_note.sql`). The PDPC prescribes no period (Retention Limitation, ¶18.2–18.3), so the organisation must set and enforce its own. Define a period per data class in a typed config and enforce it in the same purge job.
```

Close with **two required sections**:

#### "Fix these first"

A short numbered list (3–5) pulling the highest-priority items from the full list by number, each with a one-line rationale. Order by exposure, not by effort: 🔴 items, anything touching NRIC, and anything that would make a breach unnotifiable-in-practice come first.

#### Follow-through prompt

End with exactly this line (do not paraphrase):

> Let me know which numbers you want to pursue (and any reordering) and I'll work them in phases.

When the user picks a bucket or multiple items, phase the remediation: write a short plan to `docs/` naming each phase and its verification, then execute and commit per phase. For 1–3 specific numbers, just implement them as one slice. Remind the user once, at handover, that 🔴 findings and anything NRIC-related go to counsel or the DPO in parallel with the code fix.

## Quick reference — the hard numbers

These are the values that get misremembered. Cite the source alongside the number whenever you use one.

| Clock | Value | Source |
|---|---|---|
| DNC register check validity | 21 days | DNC §6.2 |
| DNC opt-out must be effected within | 21 days | DNC §8.13 / s47(3) |
| Access & correction response | 30 calendar days | ¶15.18, ¶15.52 |
| Preserve withheld data after refusing access | ≥30 calendar days | s22A / ¶15.42 |
| Assess whether a breach is notifiable | 30 days | see `references/breach.md` |
| Notify PDPC of a notifiable breach | 3 calendar days | see `references/breach.md` |
| Notifiable by scale | 500+ individuals | see `references/breach.md` |
| Disclosure history on access request | 1 year | s21(1)(b) |
| Cease NRIC for authentication | **31 Dec 2026** | PDPC media statement |

## Citing sources correctly

Every substantive claim in a finding carries a paragraph-level citation, and every citation resolves to an entry in [`references/sources.md`](./references/sources.md) — which records each document's cover date, its URL, and how currency was checked. Cite that register, not a URL you recall.

Two traps that produce confidently wrong citations:

1. **The PDPC replaces PDFs in place.** The same URL and the same filename serve a revised edition, so **a filename is not evidence of an edition** and a stale local copy looks identical to a current one. Check the cover date printed inside the document, and record it.
2. **A guideline can be current and still superseded by the Act.** Advisory guidelines are not law; where a guideline and the PDPA (or a later amendment) conflict, the Act governs. The **2014 real-estate sector guidelines are the clearest case** — still published, still cited, and predating amendments that changed the answer. Where you rely on an older sectoral guideline, check it against the current Act before the finding goes out.

## Rules

- **Confirm scope first.** Module, regime, and role — all three, every time.
- **Inventory before findings.** A finding that does not trace to an inventory row is a guess.
- **Name the file or the column.** `client.nric` beats "the client table"; `lib/crm.ts:88` beats "the CRM code".
- **Cite by paragraph, from `references/`.** Never from memory, never a bare "the PDPA says".
- **Never invent law.** If the reference does not cover it, say the point needs counsel — do not reason your way to a rule.
- **Unknown is a finding.** Write `UNKNOWN` in the inventory and raise it, rather than filling the cell with a plausible basis.
- **Do not touch `references/` while auditing.** It is a source register, not scratch space.
- **Engineering guidance, not legal advice** — say so in the report, once, and route 🔴 and NRIC findings to counsel.

## When NOT to use this skill

- **Drafting the privacy policy or terms** — that is [`/onex:add-terms-privacy`](../add-terms-privacy). This skill audits behaviour against the law; that one writes the pages. Run this first if you want the policy to describe what the app actually does.
- **Generic security review** — auth bugs, injection, secrets, dependency CVEs. Use a security-review skill. Protection Obligation findings overlap, but this is not a pentest.
- **GDPR-only or EU-only apps** — the obligations differ and this skill does not cover them.
- **A single field or one-line change** — "should I collect NRIC on this form?" is a question, not an audit. Answer it from `references/nric.md`.
- **Sectoral regimes** — MAS TRM, HIPAA, PCI DSS. Out of scope; route to the relevant specialist.
