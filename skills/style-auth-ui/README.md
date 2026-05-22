# style-auth-ui

A Claude Code skill that standardizes how **OAuth / social sign-in buttons** look and where they sit across a Next.js app's auth UI — the login page and the auth dialog.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:style-auth-ui`**.

## What it does

Trigger it with `/onex:style-auth-ui` (or "style the login buttons", "add a Google/LinkedIn button", "fix the OAuth buttons", "the social buttons look off"). Claude will apply the house contract for social auth buttons:

1. **One shared component** — all social buttons come from a single `SocialButtons` component, rendered on every auth surface.
2. **Configured-only rendering** — a provider button appears only when its credentials exist; no dead buttons.
3. **Correct icons & colors** — official provider marks in their official colors (Google's 4-color "G", LinkedIn blue, etc.); buttons stay neutral, the icon carries the color.
4. **Consistent layout & location** — a full-width vertical stack above the email form, with an `or` divider shown only when a provider is enabled.
5. **Proper states & a11y** — color-only hover, a pending `Connecting…` state that locks every button, `role="alert"` errors, `aria-hidden` icons.

## Covers

- **Icons** — the canonical Google "G" and LinkedIn "in" SVGs, plus rules for Apple, GitHub, and Microsoft marks.
- **Colors** — official brand hexes and which marks are meant to be monochrome.
- **Location** — social above the email form; the `or` divider; provider order.
- **Layout** — button anatomy (`h-11`, `rounded-lg`, neutral surface, centered icon + label) in the flat house style.
- **States** — default/hover, pending, error.
- **Add-a-provider checklist** — env → server config → enabled list → `SocialButtons`.

Pairs with [`add-auth-db`](../add-auth-db) (which wires the providers) and [`style`](../style) (the flat-design house style).

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then invoke it with `/onex:style-auth-ui`.

## License

MIT
