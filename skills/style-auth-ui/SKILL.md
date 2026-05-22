---
description: Style the OAuth / social sign-in buttons of a Next.js app's auth UI — which official provider icons and brand colors to use (Google, LinkedIn, Apple, GitHub, Microsoft), where the buttons sit on the login page and in the auth dialog, and the exact button layout, sizing, hover/pending/error states, and accessibility. Use when the user says "/onex:style-auth-ui", "style the login buttons", "style the auth UI", "add a Google/LinkedIn/Apple button", "fix the OAuth buttons", "the social buttons look off", "lay out the social login", or asks how third-party sign-in buttons should look or where they belong.
---

# /onex:style-auth-ui — Style the auth UI (OAuth buttons)

`/onex:style-auth-ui` standardizes how **OAuth / social sign-in buttons** look and where they sit across a Next.js app's auth surfaces — the login/sign-up page and the auth dialog. It covers official provider icons, brand colors, button anatomy, placement relative to the email form, and the loading / error states.

It pairs with `/onex:add-auth-db` (which *wires* the providers) and `/onex:style` (the flat-design house style). This skill is the *visual* contract for the buttons. Use the flat house style's tokens — `text-foreground`, `text-muted-foreground`, `border`, `bg-muted` — and its rules: no shadows, restrained radii, color-driven hover.

## When to use

- Adding a new OAuth provider button (Google, LinkedIn, Apple, GitHub, Microsoft, …).
- Restyling or relocating social buttons on a login page or auth dialog.
- Fixing wrong icons, recolored brand marks, or an inconsistent button stack.
- Building any new sign-in surface that combines social providers with email.

## Golden rules

1. **One shared component.** Put all social buttons in a single
   `SocialButtons` component and render *that* everywhere (login page, auth
   dialog, anywhere else). Never hand-roll a provider button inline.
2. **A provider button renders only when its credentials exist.** Resolve the
   enabled providers server-side (env check) and pass them down as a list.
   Never show a button that 500s on click.
3. **Brand icons keep brand colors.** Google's "G" is always its four official
   colors; LinkedIn's mark is always LinkedIn blue. Never tint, greyscale, or
   monochrome a colored brand mark.
4. **Buttons are neutral; the icon carries the color.** The button surface is a
   neutral app token (`bg-background` / `bg-muted`), not a branded fill. A wall
   of red/blue/black branded buttons looks broken — a neutral stack with
   colored marks looks intentional.
5. **One label format:** `Continue with {Provider}` — not "Sign in with",
   "Login", or bare "Google".

## Location & layout

Social sits **above** the email form — it is the faster path. Login page, top
to bottom:

```
logo / wordmark
Heading        ("Welcome back")
short subtext

[  Continue with Google    ]   ← <SocialButtons>: vertical stack, gap ~10px
[  Continue with LinkedIn  ]

──────────  or  ──────────     ← divider, only when ≥1 provider is enabled

[ email field ]                ← email-OTP / email form
[  Email me a code  ]
```

- **Stack**, full-width, vertical, ~`space-y-2.5` between buttons.
- **Divider** separates social from email. Render it *only* when at least one
  provider is enabled — otherwise the email form is the whole screen:

```tsx
{providers.length > 0 && (
  <>
    <SocialButtons providers={providers} />
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  </>
)}
```

- In an **auth dialog**, the same `<SocialButtons>` sits at the top of the
  method list, with the same `or` divider beneath it.
- Provider order: most-used first. Google → Apple → Microsoft → LinkedIn →
  GitHub is a sensible default; adjust to the audience.

## Button anatomy

A full-width pill, neutral surface, centered icon + label. Flat house style —
no shadow, restrained radius, hover shifts **color not geometry**:

```tsx
<button
  type="button"
  className="flex h-11 w-full items-center justify-center gap-3 rounded-lg
             border bg-background px-4 text-sm font-medium text-foreground
             transition-colors hover:bg-muted disabled:opacity-50"
>
  {icon}
  Continue with {Provider}
</button>
```

- Height `h-11`, radius `rounded-lg` (never `rounded-xl`+), `border`.
- Surface `bg-background` → `hover:bg-muted` (color-only hover; no scale/translate).
- Icon + label centered (`justify-center`), `gap-3`.
- Icon box `h-5 w-5`.
- `text-sm font-medium`.

## Provider icons & colors

Always use the vendor's **official** mark from their brand guidelines. Size
every icon to `h-5 w-5`. Icons are decorative — add `aria-hidden`.

| Provider  | Mark | Color treatment |
|-----------|------|-----------------|
| Google    | 4-color "G" | Four official fills — `#4285F4` blue, `#34A853` green, `#FBBC05` yellow, `#EA4335` red. Never recolor; never on a colored circle. |
| LinkedIn  | "in" glyph | LinkedIn blue `#0A66C2`. A `currentColor` glyph tinted via `text-[#0A66C2]`. |
| Apple     | Apple logo | Monochrome — `currentColor` so it is black on light, white on dark. |
| GitHub    | Octocat / mark | Monochrome — `currentColor`, theme-adaptive. |
| Microsoft | 4-square logo | Four official squares — `#F25022` `#7FBA00` `#00A4EF` `#FFB900`. Never recolor. |

**Google "G"** — the canonical SVG, drop in as-is:

```tsx
<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
</svg>
```

**LinkedIn "in"** — a single-path `currentColor` glyph, tinted blue:

```tsx
<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0A66C2]" aria-hidden>
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
</svg>
```

Prefer a vetted icon set (`simple-icons`, `react-icons/si`) over pasting SVGs
you can't verify — but keep the color rules above regardless of source.

## States

- **Default / hover** — `bg-background` → `hover:bg-muted`. Color only.
- **Pending** — when a sign-in starts, swap the label to `Connecting…` and
  disable **every** social button (`disabled={pending !== null}`), so a user
  can't trigger two OAuth redirects at once.
- **Error** — render a `role="alert"` box below the stack:
  `rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive`.
- **Success** — none to render: the browser is redirected to the provider.

## Accessibility

- Icons are decorative → `aria-hidden`.
- Every button has a real text label — no icon-only social buttons.
- Errors use `role="alert"`.
- Use `<button type="button">` (not a styled `<div>`) — focusable by default.
- Keep a visible focus ring; do not remove the outline without replacing it.

## Adding a new provider — checklist

1. **Env** — add `PROVIDER_CLIENT_ID` / `PROVIDER_CLIENT_SECRET` to
   `.env.example`, with the callback URL noted
   (`<AUTH_URL>/api/auth/callback/<provider>`).
2. **Server config** — register the provider, gated so it is only active when
   both credentials are present.
3. **Enabled-list helper** — the server helper that returns the enabled
   provider ids includes the new one when configured.
4. **`SocialButtons`** — add an entry to the provider map: official icon
   (`h-5 w-5`, `aria-hidden`) + `Continue with X` label.
5. Nothing else — every surface rendering `<SocialButtons>` picks it up, and
   the button stays hidden until the credentials are set.

## Review checklist

- [ ] All social buttons come from one shared `SocialButtons` component.
- [ ] Buttons render only for providers with credentials configured.
- [ ] Brand icons use official colors; none are recolored or monochromed
      (except marks that are *meant* to be monochrome — Apple, GitHub).
- [ ] Button surfaces are neutral tokens; color lives in the icon.
- [ ] Label is `Continue with {Provider}` everywhere.
- [ ] Social sits above the email form; an `or` divider separates them, shown
      only when ≥1 provider is enabled.
- [ ] Buttons: `h-11`, `rounded-lg`, `border`, color-only hover, no shadow.
- [ ] Pending disables all buttons and shows `Connecting…`.
- [ ] Icons `aria-hidden`; errors `role="alert"`; real `<button>` elements.
