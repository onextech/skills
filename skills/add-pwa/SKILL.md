---
description: Turn an existing Next.js App Router app into an installable Progressive Web App using the OnEx defaults — a web app manifest, code-generated brand icons (favicon, apple-touch, and 192/512/maskable PNGs via next/og ImageResponse), an app-shell service worker (network-first navigations, stale-while-revalidate assets, an /offline fallback — no Workbox/Serwist, Turbopack-safe), a dismissible install banner (Chromium beforeinstallprompt button + iOS Add-to-Home-Screen hint), PWA metadata/viewport (theme-color, appleWebApp, viewportFit cover), security headers for sw.js, and Vitest contract tests. Asks only for the app name + production domain (which can't be defaulted) and confirms the theme color and icon mark; everything else uses the locked OnEx defaults (app-shell offline, no web push, code-generated icons). Use when the user says "/onex:add-pwa", "make this app a PWA", "make this installable", "add a PWA", "add a web app manifest", "add a service worker", "add to home screen", "add offline support", or wants their Next.js app to be installable to the home screen / dock.
---

# /onex:add-pwa — Make a Next.js app an installable PWA

Turn an existing **Next.js App Router** app into an installable **Progressive Web App** so it can be added to the home screen / dock and launched standalone. This skill applies the **OnEx PWA defaults** end-to-end: manifest, code-generated brand icons, an app-shell service worker with offline support, an install banner, PWA metadata, security headers, and contract tests.

This is a build procedure. Work the steps **in order**. The only values you must collect from the user are the **app name** and the **production domain** — everything else has a sensible default that you confirm rather than invent.

## Locked OnEx defaults (don't re-litigate unless the user asks)

These are the choices already made for OnEx apps. **Adopt them by default**; only deviate if the user explicitly wants something else.

1. **Offline:** **App-shell offline** via a hand-rolled service worker — network-first for navigations, stale-while-revalidate for same-origin assets, a precached `/offline` fallback. **No Workbox / Serwist** (those need webpack config and conflict with the default Turbopack build).
2. **Push notifications:** **Skipped.** No `web-push`, no VAPID keys, no subscription store. (Most OnEx apps have nothing to notify about; adding it is net-new backend infra.)
3. **Icons:** **Code-generated** from a brand monogram via `next/og` `ImageResponse` — no binary asset files to manage. A single shared element drives the favicon, apple-touch icon, and the manifest 192/512/maskable PNGs.

If the user wants offline disabled, push included, or a supplied logo instead of a generated mark, accommodate it — but default to the above without a multi-question interrogation.

## What this skill produces

- `src/app/manifest.ts` → served at `/manifest.webmanifest`, auto-linked in `<head>`.
- `src/lib/brand-icon.tsx` — the **shared** icon element (one source of truth for the mark).
- `src/app/icon.tsx` (favicon) and `src/app/apple-icon.tsx` (apple-touch) — metadata file conventions.
- `src/app/manifest-icon-192.png/route.ts`, `…-512.png/route.ts`, `…-maskable.png/route.ts` — `force-static` `ImageResponse` route handlers at **stable** URLs the manifest references.
- `src/app/site-metadata.ts` — a **pure, testable** module exporting `siteMetadata` + `siteViewport`, wired into `layout.tsx`.
- `public/sw.js` — the app-shell service worker.
- `src/components/PwaController.tsx` — `"use client"`: registers the SW + renders the install banner.
- `src/app/offline/page.tsx` — the offline fallback page.
- `next.config.ts` — security headers (global + `sw.js`).
- `vitest.config.ts` + `src/**/*.test.ts(x)` — contract tests for the pure modules (manifest, metadata, icon).

> Path note: these templates assume a `src/` layout with the `@/*` → `./src/*` alias. If the app keeps `app/` at the repo root (no `src/`), drop the `src/` prefix throughout and keep everything else identical.

## Preflight — detect the stack (do this before asking or writing)

1. **Read the Next.js docs in the repo first.** OnEx apps may run a Next.js whose conventions differ from training data (see the app's `AGENTS.md`). Before writing any file, read the relevant guides under `node_modules/next/dist/docs/`:
   - `01-app/02-guides/progressive-web-apps.md`
   - `01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md`
   - `01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`
   - `01-app/03-api-reference/04-functions/generate-viewport.md`
   Heed any deprecation notices and adjust the templates below to match the installed version.
2. **Confirm it's a Next.js App Router app** (an `app/` or `src/app/` directory, a `layout.tsx`). If it's Pages Router or not Next.js, stop and say this skill targets the App Router.
3. **Confirm `next/og` is available** (it ships with Next). The icon generators import `ImageResponse` from `next/og`.
4. **Detect the design tokens / theme color.** Read `globals.css` (or the Tailwind theme) for the app's background/foreground. OnEx apps are typically dark (`--background: #000000`). These become the default `theme_color` / `background_color`.
5. **Detect the package manager.** Default to **yarn** (OnEx house rule). Use the lockfile present (`yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, else npm).
6. **Don't clobber.** Check for an existing `manifest.ts`/`manifest.json`, `public/sw.js`, `icon.tsx`, `apple-icon.tsx`, or a registered service worker. If found, surface them and ask whether to update in place or stop — never overwrite blindly.
7. **Note the existing favicon.** A stale `app/favicon.ico` (e.g. a template's logo) will coexist with the generated `/icon`. Flag it at the end as an optional delete.

## Step 1 — Gather inputs

**Ask directly (REQUIRED — no safe default):**

| Value | Token | Notes |
|---|---|---|
| App name | `{{APP_NAME}}` | The `name` + `short_name` in the manifest, the title, OG `siteName`, `appleWebApp.title`. e.g. "Brandshot". |
| Production domain | `{{SITE_URL}}` | Full origin incl. scheme, e.g. `https://www.brandshot.io`. Drives `metadataBase` + OG `url`. |

If the user already gave the name and domain in their prompt, **don't re-ask** — confirm them inline and proceed.

**Confirm with detected defaults (batch via `AskUserQuestion`; keep it to the few that matter):**

1. **Theme & background color** — default to the detected app background (e.g. `#000000`). Tokens `{{THEME_COLOR}}` / `{{BACKGROUND_COLOR}}` (usually the same).
2. **Icon mark** — default: **generate** a monogram. The monogram `{{MONOGRAM}}` defaults to the app name's first letter, lowercased, with a trailing period (e.g. "Brandshot" → `b.`); the icon background `{{ICON_BG}}` defaults to `#ffffff` and foreground `{{ICON_FG}}` to `#000000` for high contrast on any home screen. Offer "I'll provide a logo" as the alternative (then generate the set from their SVG/PNG instead).
3. **Short description** — `{{DESCRIPTION}}`, one line for the manifest + metadata. Default: derive from what the app does (read the home page); confirm.

Do **not** turn the three locked defaults (offline app-shell, no push, code-gen icons) into questions. Mention them once ("using app-shell offline + generated icons, no push — say the word to change any") and move on.

## Step 2 — Brand icons (code-generated)

**`src/lib/brand-icon.tsx`** — the shared element. One source of truth; every icon surface stays in sync.

```tsx
import type { ReactElement } from "react";

export const BRAND_BACKGROUND = "{{ICON_BG}}";
export const BRAND_FOREGROUND = "{{ICON_FG}}";
export const BRAND_MONOGRAM = "{{MONOGRAM}}";

type BrandIconOptions = {
  // Maskable icons render full-bleed (no rounding) with the glyph in the
  // central safe zone, so adaptive platforms can crop to any shape.
  maskable?: boolean;
};

export function brandIconElement(
  size: number,
  { maskable = false }: BrandIconOptions = {},
): ReactElement {
  const glyphRatio = maskable ? 0.46 : 0.64;
  const borderRadius = maskable ? 0 : Math.round(size * 0.22);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_BACKGROUND,
        borderRadius,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: Math.round(size * glyphRatio),
          fontWeight: 800,
          letterSpacing: "-0.06em",
          color: BRAND_FOREGROUND,
        }}
      >
        {BRAND_MONOGRAM}
      </div>
    </div>
  );
}
```

> If the user supplied a logo instead, replace the `<div>` glyph with their mark (inline SVG, or an `<img>` to a base64 data URI) and keep the same wrapper/sizing/maskable logic.

**`src/app/icon.tsx`** (favicon / browser tab):

```tsx
import { ImageResponse } from "next/og";
import { brandIconElement } from "@/lib/brand-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(brandIconElement(size.width), { ...size });
}
```

**`src/app/apple-icon.tsx`** (apple-touch icon — opaque, full-bleed; iOS rounds it):

```tsx
import { ImageResponse } from "next/og";
import { brandIconElement } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(brandIconElement(size.width, { maskable: true }), {
    ...size,
  });
}
```

**Manifest icon route handlers.** Create three directories whose names **end in `.png`** so the route serves at a stable, predictable URL the manifest can reference (a manifest needs literal paths, not the hashed `/icon` convention URL):

`src/app/manifest-icon-192.png/route.ts`:

```ts
import { ImageResponse } from "next/og";
import { brandIconElement } from "@/lib/brand-icon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(brandIconElement(192), { width: 192, height: 192 });
}
```

`src/app/manifest-icon-512.png/route.ts` — same, `brandIconElement(512)` at `512×512`.
`src/app/manifest-icon-maskable.png/route.ts` — same, `brandIconElement(512, { maskable: true })` at `512×512`.

> These serving a generated **GET image** is a legitimate route-handler use; it does **not** violate the "prefer server actions over API routes" house rule, which is about data mutations.

## Step 3 — Web app manifest

**`src/app/manifest.ts`** — Next serves this at `/manifest.webmanifest` and auto-injects `<link rel="manifest">`.

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "{{APP_NAME}}",
    short_name: "{{APP_NAME}}",
    description: "{{DESCRIPTION}}",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "{{BACKGROUND_COLOR}}",
    theme_color: "{{THEME_COLOR}}",
    categories: ["productivity"],
    icons: [
      { src: "/manifest-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/manifest-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/manifest-icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

## Step 4 — Metadata & viewport

Keep PWA metadata in a **pure module** (no CSS / `next/font` imports) so it's unit-testable in isolation.

**`src/app/site-metadata.ts`**:

```ts
import type { Metadata, Viewport } from "next";

export const SITE_URL = "{{SITE_URL}}";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "{{APP_NAME}}",
  title: {
    default: "{{APP_NAME}} — {{DESCRIPTION}}",
    template: "%s · {{APP_NAME}}",
  },
  description: "{{DESCRIPTION}}",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "{{APP_NAME}}",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "{{APP_NAME}}",
    url: SITE_URL,
    title: "{{APP_NAME}}",
    description: "{{DESCRIPTION}}",
  },
};

export const siteViewport: Viewport = {
  themeColor: "{{THEME_COLOR}}",
  colorScheme: "dark", // match the app; use "light" / "light dark" if appropriate
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

**Wire into `src/app/layout.tsx`** — re-export the pure module's values as the route's `metadata` / `viewport` (note: `themeColor` belongs in the **`viewport`** export in modern Next, not `metadata`), and render the controller in `<body>`:

```tsx
import { siteMetadata, siteViewport } from "./site-metadata";
import { PwaController } from "@/components/PwaController";
// …existing font + globals.css imports stay…

export const metadata = siteMetadata;
export const viewport = siteViewport;

// …inside <body>, after {children}:
//   <PwaController />
```

Replace any placeholder `metadata` the template shipped with (e.g. a leftover "Customer stories | OpenAI").

## Step 5 — Service worker, install UX, offline page

**`public/sw.js`** — app-shell strategy. Bump `VERSION` to invalidate the cache.

```js
/* {{APP_NAME}} service worker — app-shell offline support.
 *   - navigations: network-first, fall back to cache, then /offline
 *   - same-origin static assets: stale-while-revalidate */
const VERSION = "v1";
const CACHE = `{{CACHE_PREFIX}}-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE = ["/", OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match(request)) ||
            (await cache.match("/")) ||
            (await cache.match(OFFLINE_URL)) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => undefined);
      return cached || (await network) || Response.error();
    })(),
  );
});
```

(`{{CACHE_PREFIX}}` = the app name kebab-cased, e.g. `brandshot`.)

**`src/components/PwaController.tsx`** — `"use client"`. Registers the SW after `load` and renders a dismissible install banner. **Two gotchas baked in:**
- `isIOS` is computed in a **lazy, SSR-guarded `useState` initializer** (not in an effect) — reading `window` there is safe because the banner is hidden at hydration (`show=false`), so server/client markup match.
- The iOS hint is revealed via **`requestAnimationFrame`**, never a synchronous `setState` in the effect body — this satisfies the `react-hooks/set-state-in-effect` lint rule (setState in event handlers / rAF callbacks is fine; synchronous-in-effect is not).

```tsx
"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "{{CACHE_PREFIX}}:pwa-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function PwaController() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS] = useState(
    () =>
      typeof window !== "undefined" &&
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream,
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
          /* best-effort; the app still works without it */
        });
    };
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissed = (() => {
      try {
        return localStorage.getItem(DISMISS_KEY) === "1";
      } catch {
        return false;
      }
    })();
    if (dismissed) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt; reveal the manual hint after hydration.
    const raf = isIOS ? requestAnimationFrame(() => setShow(true)) : 0;

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isIOS]);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode: hide for this session */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4">
      <div className="flex max-w-md items-center gap-3 rounded-2xl border border-border bg-surface-2/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground font-extrabold text-background">
          {{MONOGRAM}}
        </div>
        {isIOS && !deferred ? (
          <p className="text-foreground/90">
            Install {{APP_NAME}}: tap the Share icon, then{" "}
            <span className="font-medium">Add to Home Screen</span>.
          </p>
        ) : (
          <p className="text-foreground/90">
            Install {{APP_NAME}} for a faster, full-screen experience.
          </p>
        )}
        <div className="ml-auto flex items-center gap-1">
          {deferred ? (
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-foreground px-3 py-1.5 font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Install
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="rounded-full px-2 py-1.5 text-muted transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
```

> Map the Tailwind tokens (`border`, `surface-2`, `foreground`, `background`, `muted`) to the app's actual token names. If the app isn't dark, adjust the banner colors to match.

**`src/app/offline/page.tsx`** — server component, no client JS. Use HTML entities for apostrophes (avoids `react/no-unescaped-entities`):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-2xl font-extrabold text-background">
        {{MONOGRAM}}
      </div>
      <h1 className="text-xl font-semibold">You&rsquo;re offline</h1>
      <p className="max-w-sm text-sm text-muted">
        {{APP_NAME}} can&rsquo;t reach the network right now. Pages you&rsquo;ve
        already opened stay available — reconnect to load anything new.
      </p>
    </main>
  );
}
```

## Step 6 — Security headers

**`next.config.ts`** — global security headers + `sw.js` content-type/no-store/CSP. Merge into any existing `headers()`.

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## Step 7 — Tests (Vitest)

Add Vitest (dev only) and contract-test the **pure** modules — meaningful assertions that catch a broken/non-installable manifest, a branding regression, or a bad icon, without faking a service worker.

Install: `yarn add -D vitest @vitest/coverage-v8`. Add scripts `"test": "vitest run"` and `"test:coverage": "vitest run --coverage"`. Add `/coverage` to `.gitignore`.

**`vitest.config.ts`**:

```ts
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/app/manifest.ts", "src/app/site-metadata.ts", "src/lib/brand-icon.tsx"],
      reporter: ["text", "json-summary"],
    },
  },
});
```

Create three suites mirroring the contract:

- **`src/app/manifest.test.ts`** — `name`/`short_name` = `{{APP_NAME}}`; `display: "standalone"`, `start_url`/`scope` = `/`; theme/background colors match; icons include `192x192` + `512x512` and a `maskable` purpose; every `src` is origin-relative (`/…`) and `type: "image/png"`.
- **`src/app/site-metadata.test.ts`** — `SITE_URL` = `{{SITE_URL}}`, `metadataBase.toString()` matches, `applicationName` = `{{APP_NAME}}`; `appleWebApp` is `{ capable: true, title: "{{APP_NAME}}" }`; `formatDetection.telephone === false`; `siteViewport.themeColor` = `{{THEME_COLOR}}`; `siteViewport.viewportFit === "cover"`.
- **`src/lib/brand-icon.test.tsx`** — root fills `100%`×`100%` with `BRAND_BACKGROUND`; glyph text = `BRAND_MONOGRAM` in `BRAND_FOREGROUND`; maskable variant has `borderRadius === 0` while the favicon's is `> 0`; maskable `fontSize` < plain; `fontSize` scales with size.

These assert real exported values (not mocks). SW runtime + the install flow are browser concerns — verified by build + Lighthouse/manual, not by faking `ServiceWorkerRegistration`.

## Step 8 — Verify

Run the full gate and a live smoke test:

1. **Lint** — `yarn lint` clean (watch for `react-hooks/set-state-in-effect` on the controller — the lazy-init + rAF pattern above is what keeps it clean).
2. **Types** — `yarn tsc --noEmit` clean.
3. **Tests** — `yarn test:coverage`; the pure modules should be at/near 100%.
4. **Build** — `yarn build` succeeds and lists the new routes: `/icon`, `/apple-icon`, `/manifest-icon-192.png`, `/manifest-icon-512.png`, `/manifest-icon-maskable.png`, `/manifest.webmanifest`, `/offline`.
5. **Live smoke test** — start the production server on a spare port and confirm:
   - `curl -s $B/manifest.webmanifest` → valid JSON, `standalone`, correct name/colors/icons.
   - each icon URL returns `Content-Type: image/png` and PNG magic bytes (`89504e47`).
   - `curl -sI $B/sw.js` → `application/javascript`, `no-store`, the CSP.
   - `curl -s $B/` `<head>` has `theme-color`, `<link rel="manifest">`, `apple-touch-icon`, `apple-mobile-web-app-*`, and the rebranded `<title>`.
   - security headers present on `/`; `/offline` renders.
   Stop the server afterward.
6. **Report** — summarize what was created, the test/coverage result, and the optional follow-ups: delete the stale template `favicon.ico` if present; swap any leftover template wordmark in the nav/footer; and note that a real local install test needs HTTPS (`npx next dev --experimental-https`) since a SW requires a secure context.

## Conventions

- **Adopt the locked defaults** (app-shell offline, no push, code-gen icons); confirm only name, domain, color, and the mark. Don't interrogate.
- **One source of truth for the icon** — `brand-icon.tsx`; every surface renders from it.
- **Pure, testable metadata** — `site-metadata.ts` carries no CSS/font imports so Vitest can import it.
- **Stable manifest icon URLs** — `…-NNN.png/route.ts` route handlers, not the hashed `/icon` convention URL.
- **House rules:** yarn (not npm); named exports; the controller lives in `@/components` (not `@/components/ui`); it needs `"use client"`; icon GET route handlers are fine (the server-actions-over-API-routes rule is about mutations); don't clobber existing PWA files.
- **Don't break the design** — map the banner/offline Tailwind classes to the app's real tokens; match dark/light.
- **Small blast radius** — only the PWA files above; touch `layout.tsx` and `next.config.ts` minimally and merge, don't overwrite.

## When NOT to use this skill

- The app is already a PWA (has a manifest + service worker) — adjust the specific piece directly instead.
- It's not a Next.js App Router app (Pages Router, or a non-Next framework).
- The app genuinely needs **offline-first with rich runtime caching** beyond an app shell — reach for Serwist/Workbox (and accept the webpack config), which is out of scope for these defaults.
- The user actually wants **push notifications** as the goal — that's a separate, backend-bearing feature (VAPID + subscription store); this skill deliberately skips it.
- The user only wants a single piece (just a manifest, or just a theme-color) — add that one thing directly.
