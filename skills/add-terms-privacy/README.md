# add-terms-privacy

A Claude Code skill that adds **Terms of Service** and **Privacy Policy** pages to a Next.js App Router app — with every company-specific detail gathered from you at run time, so **nothing is hardcoded** and the same skill works across different apps.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:add-terms-privacy`**.

## What it does

Trigger it with `/onex:add-terms-privacy` (or "add terms and privacy pages", "add a privacy policy", "Stripe needs terms and privacy"). Claude will:

1. **Detect the stack** — confirms Next.js App Router + Tailwind, finds your brand/logo and sign-up/checkout surfaces, and refuses to clobber existing legal pages.
2. **Ask for your legal details** — product name, domain, registered legal entity, registration number (UEN/company no.), registered address, governing law, contact emails (legal/privacy/DPO), effective date, minimum age, whether you take payments, and whether EU/UK users are in scope. Nothing is assumed; anything you don't have becomes a clearly-marked placeholder rather than an invented fact.
3. **Detect your data processors** — scans `package.json` and env keys for Stripe, Resend, Neon/Supabase, Twilio, R2/S3, Anthropic/OpenAI, Vercel, and more, then asks you to confirm the list that goes into the Privacy "who we share with" section.
4. **Scaffold the pages** — `app/(legal)/terms` and `app/(legal)/privacy` as server components with a shared layout, typography helpers, and GDPR-aware starter content interpolating your answers.
5. **Offer to wire them in** — adds a footer (or links to your existing one) and consent links on your sign-up surfaces, and tells you how to enable Terms acceptance at Stripe checkout. It only edits other files with your consent.
6. **Verify** — builds, checks the pages render, confirms no example data leaked and no unfilled tokens remain, and lists any placeholders plus the counsel-review follow-up.

## Design choices

- **Asks, never assumes.** All company facts are collected at run time — there is no hardcoded entity, address, jurisdiction, registration number, or email anywhere in the skill.
- **Unknown ≠ invented.** Values you don't have render as a highlighted placeholder; the skill never fabricates a plausible-looking legal fact.
- **Accurate processors.** The Privacy sharing list is built from your repo's real dependencies, not a generic template.
- **Reusable + customizable.** The same skill produces on-brand legal pages for any Next.js App Router app.
- **Starter, not legal advice.** Output is always flagged for review by counsel.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:add-terms-privacy`.

## License

MIT
