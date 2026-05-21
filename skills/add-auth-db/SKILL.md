---
name: add-auth-db
description: Add Better Auth plus a Neon Postgres database to a Next.js App Router app using raw SQL — no ORM. Scaffolds a raw-SQL migration runner (`yarn db:migrate`) and an idempotent admin seeder (`yarn db:seed`), wires email+password / passwordless magic-link / email-OTP authentication via Resend, builds a compact login / sign-up / forgot-password dialog with the logo top-centered, and updates `.env.example`. Asks at run time whether to add Google/LinkedIn OAuth and SMS OTP as extra login methods, and whether the app is a multi-tenant SaaS (Better Auth organization model + seeded org). Use when the user says "/x:add-auth-db", "add auth and a database", "set up Better Auth with Neon", "add login to this app", "scaffold authentication", or wants authentication + Postgres without an ORM.
---

# /x:add-auth-db — Add Better Auth + Neon (raw SQL, no ORM)

Add a complete authentication layer and a Neon Postgres database to a Next.js App Router app. The database is driven by **raw SQL** — there is no ORM, no schema-as-code, no query builder for app code. Migrations are plain `.sql` files run by a small custom runner; app queries use the Neon driver directly.

This skill is a build procedure. Work through the steps **in order** — every step depends on decisions locked in Step 1. Do not write code until scope is confirmed.

## What this skill produces

- `lib/db.ts` — Neon Postgres client, `DATABASE_URL` sourced from `.env.local`.
- `migrations/*.sql` — numbered raw-SQL migration files (`0001_auth.sql`, `0002_profile.sql`, …).
- `scripts/migrate.ts` + `scripts/seed.ts` — wired to `yarn db:migrate` and `yarn db:seed`.
- `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts` — Better Auth server, client, and route handler.
- `lib/email.ts` + `emails/*` — Resend client and React Email templates.
- `components/auth-dialog.tsx` — login / sign-up / forgot-password dialog, logo top-centered, `sm:max-w-md`.
- A `profile` table (1:1 with the auth user) and a seeded admin user (and organization, if multi-tenant).
- An updated `.env.example` listing every variable the app needs.

## Preflight — detect the stack

Before anything, inspect the repo and confirm the ground truth:

- Confirm **Next.js App Router** + TypeScript. If it is Pages Router or not Next.js, stop and tell the user this skill targets the App Router.
- Detect the package manager (lockfile). Commands below use `yarn`; substitute if the project uses another.
- Detect shadcn/ui + Tailwind (needed for the dialog). If absent, note it and offer to initialise shadcn first.
- Check for an **existing** database, ORM, or Better Auth setup. If found, do not clobber it — surface what exists and ask how to proceed.
- Confirm a Neon database is available (or that the user will create one) — the skill needs a `DATABASE_URL`.
- Better Auth's API shifts between versions. Before writing config, confirm the current API via context7 (`/better-auth/better-auth`) or the `better-auth-best-practices` skill if installed.

## Step 1 — Confirm scope (ask the user — REQUIRED)

Two run-time decisions change the plugins, schema, env vars, dialog, and seed. Resolve **both** with `AskUserQuestion` before installing anything.

**Baseline (always included, no need to ask):** email + password, passwordless magic link, and email OTP.

1. **Extra login methods** (multi-select — the user may pick none):
   - **Google OAuth** — `socialProviders.google`, adds `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
   - **LinkedIn OAuth** — `socialProviders.linkedin`, adds `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`.
   - **SMS OTP** — Better Auth `phoneNumber` plugin. If chosen, confirm the SMS provider (default **Twilio**) and add the provider's env vars.

2. **Is this a multi-tenant SaaS?** (yes / no):
   - **Yes** — add the Better Auth `organization` plugin (organizations, members, invitations). The schema gains org tables and the seed creates a starter organization with the admin as owner.
   - **No** — single-tenant; skip the organization plugin entirely.

Lock both answers before continuing. Everything downstream branches on them.

## Step 2 — Install dependencies

Core: `better-auth`, `@neondatabase/serverless`, `resend`, `@react-email/components`.
Dev: `@better-auth/cli`, `tsx`, `dotenv`.
Conditional: `twilio` (or the chosen SMS provider) only if SMS OTP was selected.

Add the scripts to `package.json`:

```json
"db:migrate": "tsx scripts/migrate.ts",
"db:seed": "tsx scripts/seed.ts"
```

## Step 3 — Database foundation (raw SQL, no ORM)

**`lib/db.ts`** — export a Neon `Pool` (and/or the `neon()` HTTP client) reading `process.env.DATABASE_URL`. Next.js loads `.env.local` automatically, so app code needs no extra config. All app queries are parameterised raw SQL through this client — never string-interpolate user input.

**`migrations/`** — a folder of numbered `.sql` files, applied in lexical order: `0001_auth.sql`, `0002_profile.sql`, …

**`scripts/migrate.ts`** — a small runner that:
1. Loads `.env.local` explicitly — `config({ path: ".env.local" })` (standalone scripts do not get Next.js's env loading).
2. Creates a ledger table if missing: `_migrations(name text primary key, applied_at timestamptz default now())`.
3. Reads `migrations/*.sql` sorted by filename, skips any already in `_migrations`.
4. For each pending file: run it inside a transaction (`BEGIN` → file SQL → `INSERT INTO _migrations` → `COMMIT`; rollback on error). Postgres DDL is transactional, so a failed migration leaves nothing half-applied.
5. Logs each applied file and exits non-zero on failure.

**`scripts/seed.ts`** — see Step 9. Scripts use **relative imports** (`../lib/auth`) so `tsx` resolves them without alias config.

## Step 4 — Email delivery (Resend)

Magic link, email OTP, email verification, and password reset all require sending email.

- **`lib/email.ts`** — a Resend client (`RESEND_API_KEY`) and a typed `sendEmail({ to, subject, react })` helper using `EMAIL_FROM`.
- **`emails/`** — React Email templates: `magic-link.tsx`, `email-otp.tsx`, `verify-email.tsx`, `reset-password.tsx`. Keep them simple and on-brand; reuse the project's logo.
- `EMAIL_FROM` must use a Resend-verified domain — note this in the env comments.

## Step 5 — Better Auth configuration

**`lib/auth.ts`** — `betterAuth({ ... })`:

- `database`: a `Pool` from `@neondatabase/serverless` (Better Auth detects the Postgres dialect — no ORM needed).
- `emailAndPassword`: `{ enabled: true, requireEmailVerification: true, sendResetPassword }` — reset email via Resend.
- `emailVerification`: `{ sendVerificationEmail }` — via Resend.
- `socialProviders`: add `google` / `linkedin` **only** if chosen in Step 1.
- `plugins`, in this order:
  - `magicLink({ sendMagicLink })` — passwordless link, via Resend.
  - `emailOTP({ sendVerificationOTP })` — email OTP code, via Resend.
  - `admin()` — role-based access; the seeded user becomes `role: "admin"`.
  - `organization()` — **only** if multi-tenant.
  - `phoneNumber({ sendOTP })` — **only** if SMS OTP chosen; sends via the chosen provider.
  - `nextCookies()` — **MUST be last** in the array.
- Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.

**`lib/auth-client.ts`** — `createAuthClient` from `better-auth/react` with the matching client plugins: `magicLinkClient()`, `emailOTPClient()`, `adminClient()`, and conditionally `organizationClient()` / `phoneNumberClient()`.

**`app/api/auth/[...all]/route.ts`** — `export const { GET, POST } = toNextJsHandler(auth)`. This catch-all is required by Better Auth; it is not an app API route, so it does not conflict with the "prefer server actions" convention.

## Step 6 — Schema & migrations

1. With **all** plugins from Step 5 configured, run `npx @better-auth/cli generate` to emit the Postgres SQL for the full schema (user, session, account, verification, plus admin columns, magic-link/OTP tables, and — if multi-tenant — `organization` / `member` / `invitation`).
2. Save that SQL verbatim as `migrations/0001_auth.sql`. **Do not** run `@better-auth/cli migrate` — it bypasses the migration files; this skill owns migrations.
3. Write `migrations/0002_profile.sql` by hand — the `profile` table, 1:1 with the auth user:

```sql
create table profile (
  id           text primary key,
  user_id      text not null unique references "user"(id) on delete cascade,
  display_name text,
  avatar_url   text,
  bio          text,
  phone        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
```

Better Auth's user table is `"user"` (a reserved word — always double-quote it) and its columns are camelCase (`"emailVerified"`, `"createdAt"`, `"organizationId"`, …). When you write raw SQL against Better Auth tables, copy the **exact** quoted names from `0001_auth.sql`.

If plugins change later, re-run `generate` and add a **new** numbered migration with the delta — never edit an already-applied file.

## Step 7 — The auth dialog

**`components/auth-dialog.tsx`** (`"use client"`, placed in `@/components`, named export):

- A shadcn `Dialog`; override width with **`sm:max-w-md`** on `DialogContent` (the `sm:` prefix is required — the base width is already set).
- **Logo top-centered** in the `DialogHeader`. Reuse the project's logo component or `/public` asset; use a placeholder only if none exists.
- A required `DialogTitle` under the logo, changing per view ("Welcome back" / "Create your account" / "Reset your password") — never omit it.
- A `view` state: `login` · `signup` · `forgot` · plus the magic-link-sent and OTP-entry states.
- **Login** — email + password, "Forgot password?" link, and toggles for magic link and email OTP. Social buttons (Google/LinkedIn) and the phone/SMS-OTP path render only if enabled in Step 1.
- **Sign up** — name, email, password.
- **Forgot password** — email field; calls `authClient.forgetPassword`. Also create a `/reset-password` page to consume the emailed token via `authClient.resetPassword` (the dialog requests the reset; the page completes it).
- Use the client methods: `authClient.signIn.email`, `signUp.email`, `signIn.magicLink`, `emailOtp.sendVerificationOtp` + `signIn.emailOtp`, `forgetPassword`, `signIn.social`, and the phone-OTP methods when enabled.
- Validate with zod + react-hook-form; surface success/error with the project's toast (e.g. sonner).
- Expose an `AuthDialogProvider` + `useAuthDialog()` so any component can open the dialog at a given view.

Conventions: any Popover/Dropdown/Combobox nested in the dialog needs the `modal` prop; for overflow use CSS `overflow-y-auto` with a max-height — never the shadcn `ScrollArea`.

## Step 8 — Environment variables

Update `.env.example` with every variable, grouped and commented. The real secrets live in `.env.local` (git-ignored) — never commit them.

```bash
# Database (Neon) — used by the app and by db:migrate / db:seed
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=        # generate: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Resend) — EMAIL_FROM must use a Resend-verified domain
RESEND_API_KEY=
EMAIL_FROM="App <noreply@yourdomain.com>"

# Seed — the first admin user
SEED_ADMIN_NAME="Admin"
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=       # strong password; the seed hashes it via Better Auth

# --- Conditional, only if selected in Step 1 ---
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# LINKEDIN_CLIENT_ID=
# LINKEDIN_CLIENT_SECRET=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
# --- Multi-tenant only ---
# SEED_ORG_NAME="Acme"
# SEED_ORG_SLUG=acme
```

Tell the user to copy `.env.example` to `.env.local` and fill it in before running migrate/seed.

## Step 9 — Seed the first admin

**`scripts/seed.ts`** — idempotent, loads `.env.local` first:

1. `SELECT id FROM "user" WHERE email = $1` — if the admin already exists, log and exit 0.
2. Create the user with Better Auth's server API — `auth.api.signUpEmail({ body: { name, email, password } })` — so the password is hashed correctly. **Never** hand-write a password hash.
3. Promote via raw SQL: `UPDATE "user" SET role = 'admin', "emailVerified" = true WHERE email = $1`.
4. Insert the `profile` row (raw SQL, `id = crypto.randomUUID()`).
5. **If multi-tenant** — insert the `organization` row, then a `member` row linking the admin with `role = 'owner'` (raw SQL; use the exact quoted column names from `0001_auth.sql`).
6. Log a clear success summary.

The seed password comes only from `SEED_ADMIN_PASSWORD` — never hardcode it.

## Step 10 — Run & verify

1. `yarn db:migrate` — confirm `0001_auth.sql` and `0002_profile.sql` apply and land in `_migrations`.
2. `yarn db:seed` — confirm the admin user, profile (and org, if multi-tenant) are created; re-run once to confirm it is idempotent.
3. `yarn build` (or typecheck) — no type errors.
4. Smoke test: open the auth dialog, sign in as the seeded admin, request a magic link and an email OTP, exercise forgot-password. Confirm each email arrives via Resend.
5. Summarise for the user: what was created, which env vars they must fill, and any follow-ups (e.g. OAuth callback URLs to register, Resend domain verification, and — if multi-tenant — that org-switcher UI is intentionally left as a follow-up; this skill only *prepares* multi-tenancy).

## Conventions

- **Raw SQL only.** No ORM, no query builder for app code. Parameterised queries always — never interpolate input.
- **Migrations are append-only.** Numbered files, never edit an applied one, ledger-tracked.
- **`nextCookies()` is always the last Better Auth plugin.**
- **Secrets stay in `.env.local`.** `.env.example` holds only keys and comments.
- **Better Auth tables are camelCase and `"user"` is reserved** — double-quote names in raw SQL.
- New components go in `@/components`; use named exports; client components get `"use client"`.
- Dialog width override uses the `sm:` prefix; every Dialog has a `DialogTitle`; no shadcn `ScrollArea`.
- Seed scripts are idempotent and re-runnable.

## When NOT to use this skill

- The app already has a working auth system — extend it, don't replace it.
- The user wants an ORM (Prisma, Drizzle) — this skill is deliberately raw-SQL.
- It is not a Next.js App Router app.
- The user wants only a database, or only auth UI, with none of the rest — do that part directly instead.
