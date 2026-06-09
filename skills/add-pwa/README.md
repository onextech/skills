# add-pwa

A Claude Code skill that turns an existing **Next.js App Router** app into an installable **Progressive Web App** using the OnEx defaults — so it can be added to the home screen / dock and launched standalone.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:add-pwa`**.

## What it does

Trigger it with `/onex:add-pwa` (or "make this app a PWA", "make this installable", "add a service worker", "add offline support"). Claude will:

1. **Detect the stack** — reads the in-repo Next.js docs first, confirms App Router + `next/og`, picks up your theme tokens and package manager, and refuses to clobber an existing manifest/service worker.
2. **Ask only what can't be defaulted** — your **app name** and **production domain** — then confirms the theme color, the icon mark, and a one-line description.
3. **Scaffold the PWA** — a web app manifest, code-generated brand icons (favicon, apple-touch, and 192/512/maskable PNGs via `ImageResponse` from a single shared element), PWA metadata/viewport, an install banner, an offline page, security headers, and Vitest contract tests.
4. **Verify** — lint, types, tests + coverage, build, and a live smoke test of the manifest, icons, headers, service worker, and offline page.

## The OnEx defaults it bakes in

- **App-shell offline** via a hand-rolled service worker — network-first navigations, stale-while-revalidate assets, an `/offline` fallback. **No Workbox/Serwist** (Turbopack-safe, no webpack config).
- **No web push** — most OnEx apps have nothing to notify about, and it would mean net-new backend infra (VAPID + a subscription store).
- **Code-generated icons** — a brand monogram rendered with `next/og`, so there are no binary icon files to manage and a single place to restyle the mark.
- **Pure, testable metadata** and **stable manifest icon URLs**, with the install banner and offline page mapped to your app's design tokens.

It **asks, doesn't assume** the brand-specific bits, but it **does not re-litigate** the engineering defaults above — say the word and it'll enable offline differently, include push, or use a logo you supply.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:add-pwa`.

## License

MIT
