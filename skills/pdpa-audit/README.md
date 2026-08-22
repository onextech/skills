# pdpa-audit

A Claude Code skill that audits an app, module, or data model against **Singapore's Personal Data Protection Act** — building a real personal-data inventory from the schema and the code, then testing it against the data protection obligations, the NRIC rules, Do Not Call, breach notification, and cross-border transfer.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:pdpa-audit`**.

Grounded in **PDPC primary sources with paragraph-level citations** — every finding names the obligation and the paragraph it comes from. The cited corpus lives in [`references/`](./references) (sources register, obligations + Annex B/C checklists, NRIC, DNC, breach, AI + transfers) so it loads only when a step needs it, not on every invocation.

> Engineering guidance, not legal advice. Material findings go to counsel or your DPO.

## What it does

Trigger it (`/onex:pdpa-audit`, or say "pdpa audit", "are we PDPA compliant", "check how we handle NRIC", "DNC check"). Claude will:

1. **Confirm scope first** — which app or module (detected candidates offered to pick from), whether Singapore PDPA is actually the governing regime (EU/UK users mean GDPR too, which this skill does not cover), and whether you act as an **organisation** or as a **data intermediary** for someone else. The obligations differ; the audit waits for the answer.
2. **Build a personal-data inventory** — ripgrep patterns over the schema and code to find the fields, then the crossing points: third-party SDKs, analytics, LLM providers, email/SMS/WhatsApp senders, object storage, error trackers (PII in `Sentry.captureException` extras is a classic leak), and server logs. Plus every collection point (forms, imports, scrapers, webhooks) and disclosure point (exports, PDFs, share links, public routes). Output is a table: data element, where stored, why, legal basis, disclosed to, retention, encrypted at rest.
3. **Audit against the obligations** — Consent, Purpose Limitation, Notification, Access & Correction, Accuracy, Protection, Retention, Transfer, Breach Notification, Accountability. Four traps get checked explicitly every time: soft-delete does not discharge retention (¶18.11); an access request is a legal hold that must suppress purge jobs (s22A); per-purpose withdrawal is mandatory and must fan out to processors (¶12.42(c), ¶12.52); and a vendor that reuses your data for its own purposes stops being a data intermediary (¶6.25).
4. **Check the Singapore hard edges** — the **31 December 2026 deadline to cease using NRIC for authentication**; Do Not Call (WhatsApp expressly in scope, two separate 21-day clocks, DP consent ≠ DNC consent); breach notification (30 days to assess, 3 calendar days to notify, 500-individual scale limb); and AI + overseas transfer (prompts and logs are personal data you control; training on user data needs an AI-Specific Notification; transfer contracts must name countries).
5. **Return a thematic, severity-marked list** — lettered sections with continuous numbering. Every finding: what, where (`file:line` or `table.column`), which obligation with its paragraph cite, and the fix.
   - 🔴 **unlawful-now** — a live unlawful collection/use, or a gap that would trigger breach notification
   - 🟡 **obligation-gap** — a clear obligation with nothing implemented behind it
   - 🟢 **hardening** — implemented but thin
6. **Close with "fix these first"** — the highest-exposure items called out by number, then an offer to phase the remediation: plan to `docs/`, commit per phase.

## How it's different from a security review

A security review asks whether an attacker can get the data. This asks whether **you are allowed to have it** — and whether you can produce it, correct it, stop using it, and delete it when someone asks. The Protection Obligation overlaps a pentest; the other nine obligations do not overlap it at all. Retention with no purge job, a global consent boolean, a scraper with no notification, and an NRIC on a lead form are all clean security reviews and all PDPA findings.

## How it's different from `/onex:add-terms-privacy`

`/onex:add-terms-privacy` **writes** the Terms and Privacy Policy pages. This skill **audits what the app actually does**. Running the audit first makes the policy accurate — a privacy policy that describes purposes the code does not honour is a liability, not a defence. Use them together, in that order.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then trigger it by saying `pdpa audit`, `/onex:pdpa-audit`, or any of the phrases listed in `SKILL.md`'s description.

## Why this exists

"Are we PDPA compliant?" is a question nobody can answer from a policy document, because the answer lives in the schema and the send jobs. The compliance checklists that exist are written for lawyers and stop at the level of "have a retention policy" — they never say *the soft-delete you shipped last week is retention*, or *the purge cron will delete data that is under an access request*, or *the last-4-of-NRIC login has a hard deadline of 31 December 2026*.

Making it a skill turns that into something an engineer can run:

- **Grounded, not recalled** — paragraph-level citations from PDPC primary sources kept in `references/`, with a currency method that survives the PDPC replacing PDFs in place.
- **Concrete by construction** — the inventory is built from real columns and real integration points, so no finding is abstract.
- **Singapore-specific** — the NRIC deadline, the DNC clocks, and the 3-calendar-day breach window are exactly what a GDPR-shaped review misses.
- **One-shot to remediation** — pick numbers, Claude plans to `docs/` and executes in phases.

## License

MIT
