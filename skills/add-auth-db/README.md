# add-auth-db

A Claude Code skill that adds a complete **Better Auth + Neon Postgres** layer to a Next.js App Router app — using **raw SQL, no ORM**.

Ships in the [`x`](../../README.md) plugin — invoked as **`/x:add-auth-db`**.

## What it does

Trigger it with `/x:add-auth-db` (or "add auth and a database", "set up Better Auth with Neon", "add login to this app"). Claude will:

1. **Detect the stack** — confirms Next.js App Router, the package manager, shadcn/ui, and whether any database or auth already exists (it won't clobber existing setup).
2. **Confirm scope** — asks two questions up front:
   - Which **extra login methods** to add — Google OAuth, LinkedIn OAuth, SMS OTP (or none).
   - Whether the app is a **multi-tenant SaaS** — if yes, it wires the Better Auth organization model and seeds a starter org.
3. **Build the database foundation** — a Neon client, a numbered `migrations/*.sql` folder, and a small raw-SQL migration runner exposed as `yarn db:migrate`, plus `yarn db:seed`.
4. **Wire Better Auth** — email+password, passwordless magic link, and email OTP as the baseline, plus the server config, client, and route handler. Email is delivered via **Resend** with React Email templates.
5. **Generate the schema as SQL** — runs the Better Auth CLI to emit the schema, saves it as `0001_auth.sql`, and hand-writes a `profile` table (1:1 with the auth user).
6. **Build the auth dialog** — a compact (`sm:max-w-md`) login / sign-up / forgot-password dialog with the logo top-centered.
7. **Update `.env.example`** — every variable the app needs, grouped and commented.
8. **Seed the first admin** — an idempotent seeder that creates the admin user (password from an env var), promotes it via raw SQL, seeds the profile, and — if multi-tenant — seeds the organization.
9. **Run & verify** — applies migrations, runs the seed, builds, and smoke-tests the auth flows.

## Design choices

- **Raw SQL, no ORM.** Migrations are plain `.sql` files; app queries use the Neon driver directly. Deliberate — if you want Prisma or Drizzle, this isn't the skill.
- **Append-only migrations.** Numbered files, ledger-tracked in a `_migrations` table, transactional, never edited after they're applied.
- **Baseline auth is opinionated.** Email+password, magic link, and email OTP are always included; OAuth and SMS OTP are opt-in at run time.
- **`profile` table is separate** from Better Auth's `user` table — app fields (display name, avatar, bio, phone) stay out of the auth schema.
- **Resend for email** — magic links, OTP codes, verification, and password resets, with React Email templates.

## Install

This skill ships in the **`x`** Claude Code plugin:

```bash
/plugin marketplace add onextech/onex-skills
/plugin install x@onex-skills
```

Then invoke it with `/x:add-auth-db`.

## License

MIT
