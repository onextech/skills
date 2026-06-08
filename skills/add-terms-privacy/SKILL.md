---
description: Add Terms of Service and Privacy Policy pages to a Next.js App Router app, with every company-specific detail gathered from the user at run time — nothing hardcoded. Scaffolds app/(legal)/terms and app/(legal)/privacy as server components with a shared layout, typography helpers, and a site footer; auto-detects the app's data processors (Stripe, Resend, Neon, Twilio, R2, AI providers, hosting) from package.json and .env to build an accurate Privacy "who we share with" list; interpolates the legal entity name, registration number (UEN/company no.), registered address, governing law, contact emails, product name, and effective date the user supplies; produces GDPR-aware starter content flagged for counsel review; then offers to wire consent links into the app's sign-up and checkout surfaces and add a footer. Reusable across different apps — it asks, it does not assume. Use when the user says "/onex:add-terms-privacy", "add terms and privacy pages", "add a privacy policy", "add terms of service", "I need legal pages", "add a ToS", "Stripe needs terms and privacy", or wants reusable, customizable legal pages.
---

# /onex:add-terms-privacy — Add Terms of Service + Privacy Policy

Scaffold a **Terms of Service** page and a **Privacy Policy** page into a Next.js App Router app. Every company-specific value — legal entity, registration number, address, governing law, contact emails, product name, effective date — is **collected from the user at run time and interpolated in**. This skill hardcodes **no company data**: it asks, then implements.

The goal is reuse: the same skill drops into any app and produces customized, on-brand legal pages that satisfy what payment processors (Stripe) and privacy law (GDPR/CCPA) expect — while making clear the output is a starter that needs a lawyer's review.

This skill is a build procedure. Work through the steps **in order**. Do not write any page content until the legal details in Step 1 are gathered — guessing company facts is the one thing this skill must never do.

## What this skill produces

- `app/(legal)/layout.tsx` — a shared layout for both legal pages: brand link at top, centered prose container, footer at bottom.
- `app/(legal)/terms/page.tsx` — the Terms of Service, server component, with per-page `metadata`.
- `app/(legal)/privacy/page.tsx` — the Privacy Policy, server component, with per-page `metadata`.
- `components/legal.tsx` — small typography helpers (`LegalTitle`, `LegalUpdated`, `H2`, `P`, `UL`, `Placeholder`) so both pages stay consistent and readable.
- `components/site-footer.tsx` — a footer linking Home / Terms / Privacy (created only if the app has no footer; otherwise the skill adds the two links to the existing one).
- **Offered, not forced:** consent links wired into the app's sign-up surface(s) and a note on enabling Terms acceptance at Stripe checkout.

## Preflight — detect the stack

Before asking anything, inspect the repo and establish ground truth:

- Confirm **Next.js App Router** + TypeScript (an `app/` directory). If it is Pages Router or not Next.js, stop and tell the user this skill targets the App Router.
- Confirm **Tailwind CSS**. The templates use utility classes and design tokens (`text-fg`, `text-muted`, `text-dim`, `border-border`, `bg`, `font-display`). If the project uses different token names, map them to the project's equivalents as you write — match the surrounding code, do not introduce a new palette.
- **Do not clobber.** Check for existing `app/(legal)/`, `app/terms`, `app/privacy`, `pages/terms`, or `pages/privacy`. If legal pages already exist, surface them and ask whether to update in place or stop — never overwrite blindly.
- Detect a **brand/logo** convention from the home or auth pages (a wordmark link, a logo component) so the legal layout header matches the app.
- Detect **sign-up / checkout surfaces** for the optional wiring step (Step 4): an auth dialog, a `register`/`signup` form, a Stripe checkout action.

## Step 1 — Gather the legal details (ask the user — REQUIRED)

This is the heart of the skill. Collect **all** of the following before writing any page. **Never invent, guess, or carry over values from another app.** Batch the questions to minimize round-trips: use `AskUserQuestion` for the bounded choices, and ask for the free-text identity fields together in one clear message.

**Free-text identity fields** (ask directly, in one batch):

| Value | Token | Notes |
|---|---|---|
| Product / brand name | `{{PRODUCT_NAME}}` | e.g. "Acme Cards" — used in titles and copy. |
| Canonical domain | `{{DOMAIN}}` | e.g. `acme.com` — for the brand link + canonical references. |
| Registered legal entity name | `{{COMPANY_LEGAL_NAME}}` | e.g. "Acme Pte. Ltd." / "Acme, Inc." |
| Company registration number | `{{REG_NUMBER}}` | UEN (Singapore), company number (UK), EIN/incorporation no. — label it per the entity's country. Optional. |
| Registered office address | `{{REG_ADDRESS}}` | Full address as it should appear. |
| Country of incorporation | `{{COUNTRY}}` | Drives governing-law defaults below. |
| Governing law | `{{GOVERNING_LAW}}` | e.g. "Singapore", "England and Wales", "the State of Delaware". Default to `{{COUNTRY}}` and confirm. |
| Courts with jurisdiction | `{{COURTS}}` | e.g. "the Singapore courts". Usually mirrors governing law. |
| Legal / general contact email | `{{LEGAL_EMAIL}}` | e.g. `legal@acme.com`. |
| Privacy contact email | `{{PRIVACY_EMAIL}}` | e.g. `privacy@acme.com`. May equal the legal email. |
| Data Protection Officer email | `{{DPO_EMAIL}}` | Optional — only if they have a DPO. |

**Bounded choices** (`AskUserQuestion`):

1. **Effective / "last updated" date** — default to **today**; confirm or let them set one. Token `{{EFFECTIVE_DATE}}` (render human-readable, e.g. "7 June 2026").
2. **Minimum age** — default **16** (GDPR-aligned); offer 13 (US/COPPA) or 18. Token `{{MIN_AGE}}`.
3. **Do you take payments?** — yes/no. If yes, the Terms gets a payment & refund clause and Privacy lists the payment processor; if no, omit both.
4. **Is the service offered to EU/UK users?** — yes/no (default yes). If yes, include the GDPR sections (legal bases, international transfers, rights, DPO contact); if no, keep a lighter privacy section.

**Rules for missing answers:** if the user genuinely doesn't have a value (e.g. no registration number yet, no DPO), do **not** fabricate it. Render a clearly-marked `<Placeholder>[describe what's missing]</Placeholder>` in the page and list every remaining placeholder back to the user at the end. A visible placeholder is correct; a plausible-looking invented fact is a defect.

## Step 2 — Detect & confirm data processors

The Privacy Policy's "who we share data with" section must reflect what the app **actually uses** — this is where accuracy matters and where a generic template fails. Build the list from the repo, then confirm it:

1. Scan `package.json` dependencies and `.env.example` / `.env.local` keys and map them to processors. Common signals:
   - `stripe` → **Stripe** (payments)
   - `resend` / `@react-email/*` → **Resend** (email)
   - `@neondatabase/serverless` / `pg` / `DATABASE_URL` → the **database host** (e.g. Neon, Supabase)
   - `twilio` / `TWILIO_*` → **Twilio** (SMS)
   - `@aws-sdk/client-s3` + `R2_*` → **Cloudflare R2** (storage); plain S3 → **AWS S3**
   - `@ai-sdk/anthropic` / `ANTHROPIC_API_KEY` → **Anthropic**; `openai` → **OpenAI** (AI)
   - `@vercel/*` / `vercel.json` → **Vercel** (hosting); else infer from config
   - analytics/auth SDKs (PostHog, Sentry, Better Auth providers like Google/LinkedIn) → list as relevant
2. Present the inferred processor list with one-line purposes and **ask the user to confirm, add, or remove** entries. Only list processors that actually receive personal data.
3. The confirmed list becomes the Privacy "Sharing & processors" section. Do not list a processor the app doesn't use, and don't omit one it does.

## Step 3 — Scaffold the pages

Create the route group and shared pieces. Use the project's design tokens; if it has a typography/prose system already, prefer it over the helpers below.

**`components/legal.tsx`** — typography helpers (server component, named exports):

```tsx
import type { ReactNode } from "react";

export const LegalTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="font-display text-3xl sm:text-4xl text-fg mb-2">{children}</h1>
);
export const LegalUpdated = ({ children }: { children: ReactNode }) => (
  <p className="text-xs uppercase tracking-[0.2em] text-dim mb-10">{children}</p>
);
export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-xl text-fg mt-10 mb-3">{children}</h2>
);
export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted mb-4">{children}</p>
);
export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-dim">{children}</ul>
);
// Only for values the user could not supply — visually flags an unfilled field.
export const Placeholder = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-amber-500/15 px-1 text-amber-200">{children}</span>
);
```

**`app/(legal)/layout.tsx`** — brand link, centered container (`max-w-3xl`), footer:

```tsx
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto w-full max-w-3xl px-6 pt-10">
        <Link href="/" className="block text-xs uppercase tracking-[0.3em] text-dim transition hover:text-muted">
          {{PRODUCT_NAME}}
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
```

(`(legal)` is a route group — the URLs are `/terms` and `/privacy`, not `/legal/...`.)

**`app/(legal)/terms/page.tsx`** — export `metadata` (`title: "Terms of Service"`), then build these sections with `H2`/`P`/`UL`, interpolating the Step 1 tokens. The opening paragraph must name the entity, e.g.: *"These Terms are a legal agreement between you and `{{COMPANY_LEGAL_NAME}}` (registration no. `{{REG_NUMBER}}`), a company incorporated in `{{COUNTRY}}` with its registered office at `{{REG_ADDRESS}}` (“`{{PRODUCT_NAME}}`”, “we”, “us”)…"* Required sections:

1. **The Service** — what `{{PRODUCT_NAME}}` does (describe from the repo).
2. **Accounts & eligibility** — min age `{{MIN_AGE}}`, accurate info, account security.
3. **Payment & licence** — *only if they take payments.* State pricing model, that Stripe (or the detected processor) handles payment, and the refund stance, e.g.: *"Because the Service is delivered digitally, purchases are generally non-refundable except where required by law; contact `{{LEGAL_EMAIL}}` to request a review."*
4. **Your content** — user owns their content; grants the company a licence to host/display it for operating the Service.
5. **Acceptable use** — prohibited conduct.
6. **Third-party / AI features** — *only if applicable* — disclaimer that AI output may be inaccurate.
7. **Availability & warranties** — "as is", no uptime guarantee.
8. **Limitation of liability** — cap liability to the maximum permitted by law.
9. **Termination** — user can delete; company may suspend for breach.
10. **Changes** — terms may change; notice given.
11. **Governing law** — *"governed by the laws of `{{GOVERNING_LAW}}`, and `{{COURTS}}` have exclusive jurisdiction, subject to mandatory local consumer rights."*
12. **Contact** — `{{LEGAL_EMAIL}}`.

**`app/(legal)/privacy/page.tsx`** — export `metadata` (`title: "Privacy Policy"`), opening paragraph naming `{{COMPANY_LEGAL_NAME}}`, `{{REG_ADDRESS}}` as controller. Required sections:

1. **Data we collect** — derive from the app: account data, the app's core content, any visitor-submitted data, analytics (note hashing/anonymization if the app does it), AI messages (if any), payment data (if payments).
2. **How we use it** — operate the service, authenticate, send transactional email, process payments, prevent abuse, legal compliance.
3. **Legal bases (GDPR)** — *only if EU/UK in scope* — contract, consent, legitimate interests, legal obligation.
4. **Sharing & processors** — the **confirmed list from Step 2**, each with its purpose. State you do not sell personal data.
5. **Public information** — *only if the app publishes user content publicly* — note what's public.
6. **Cookies** — strictly-necessary/session cookies; note if no ad cookies.
7. **Retention** — kept while account active; deleted on account deletion; legal/tax exceptions.
8. **Your rights** — access, correct, export, delete, object/restrict; point to any self-serve export/delete in the app; contact `{{PRIVACY_EMAIL}}` (and `{{DPO_EMAIL}}` if provided); right to complain to a supervisory authority.
9. **International transfers** — *if EU/UK in scope* — safeguards (SCCs).
10. **Children** — not directed to under `{{MIN_AGE}}`.
11. **Changes** — policy may change; notice given.
12. **Contact** — `{{PRIVACY_EMAIL}}` (+ DPO if any).

Content quality bar: substantive, plain-English, accurate to the app. At the top of **both** pages keep the `LegalUpdated` line ("Last updated: `{{EFFECTIVE_DATE}}`"). Do **not** present these as final legal advice — see the counsel-review note in Step 5.

## Step 4 — Wire into the app (offer first)

Ask whether to wire the pages in; if yes:

- **Footer.** If the app has a footer, add **Terms** and **Privacy** links to it. If not, create `components/site-footer.tsx` (links Home / Terms / Privacy, `© <year> {{COMPANY_LEGAL_NAME}}`) and render it on marketing/auth/legal pages — **not** on immersive surfaces (a full-screen hero, the dashboard, or a public profile/card where it would clutter the design). Use `new Date().getFullYear()` in the server component for the year.
- **Sign-up consent.** On each detected sign-up surface (auth dialog, register form), add a short consent line: *"By creating an account you agree to our [Terms](/terms) and [Privacy Policy](/privacy)."* Use `next/link`. If a placeholder consent line already exists, replace it with linked text.
- **Stripe checkout.** Do **not** silently change checkout code in a way that needs matching dashboard config. Instead tell the user: enable **Stripe Dashboard → Settings → Checkout → Terms of service** pointing to `https://{{DOMAIN}}/terms`, so purchases record acceptance. (Optionally, if they confirm the dashboard URL is set, add `consent_collection.terms_of_service: "required"` to the Checkout Session.)

Keep the blast radius small: only edit files the user agreed to, and match each file's existing style.

## Step 5 — Verify

1. **Typecheck / build** — `yarn build` (or the project's typecheck) passes; the new RSC pages compile.
2. **Render** — `/terms` and `/privacy` load; the brand link and footer links work.
3. **No leaked example data** — grep the new files for any company-specific strings that are NOT the user's: they must contain `{{COMPANY_LEGAL_NAME}}` etc. as filled, and **none** of the example values from this skill. If you adapted this from another app, double-check no prior entity name, jurisdiction, registration number, or email survived.
4. **No stray tokens** — grep for unfilled `{{...}}` tokens; there should be none. Any genuinely unknown value must be a visible `<Placeholder>`, not a raw token.
5. **Report** — summarize what was created, list every remaining `<Placeholder>` the user must fill, and state the two non-code follow-ups: **(a) have counsel review the drafted clauses** (this is AI-drafted starter text, not legal advice), and **(b) set the Stripe checkout ToS URL** if they take payments.

## Conventions

- **Ask, never assume.** All company facts come from the user at run time. No hardcoded entity, address, jurisdiction, registration number, or email — ever.
- **Unknown ≠ invented.** Missing values render as a highlighted `<Placeholder>`; never fabricate a plausible fact.
- **Accurate processors.** The Privacy sharing list reflects the repo's real dependencies, confirmed by the user.
- **Don't clobber.** Existing legal pages are updated with consent, not silently overwritten.
- **Match the house style.** Reuse the app's tokens, logo, and footer; new components go in `@/components` as named exports; server components by default (no `"use client"` unless needed).
- **Not legal advice.** Always flag the output for counsel review.
- **Small blast radius.** Only the two pages + shared helpers by default; other files edited only with consent.

## When NOT to use this skill

- The app already has lawyer-approved legal pages — link them, don't regenerate.
- It is not a Next.js App Router app.
- The user needs jurisdiction-specific, lawyer-drafted terms (e.g. regulated finance/health) — this produces a starter, not compliant final copy; route them to counsel.
- The user only wants a single clause or a copy tweak — just edit it directly.
