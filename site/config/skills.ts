/**
 * Display metadata for the landing page. SKILL.md stays the source of truth for
 * which skills exist; this file only adds marketing-facing details. A skill with
 * no entry still renders, with fallbacks (category "Other", tagline from its
 * description). A test fails if an entry names a skill folder that no longer exists.
 */

export const SKILL_ICONS = [
  "archive-restore",
  "bot",
  "file-text",
  "gallery-horizontal",
  "git-branch",
  "key-round",
  "lightbulb",
  "lock",
  "message-square",
  "messages-square",
  "mouse-pointer",
  "palette",
  "pen-line",
  "shield-check",
  "smartphone",
  "sparkles",
  "trending-up",
  "users",
] as const;
export type SkillIcon = (typeof SKILL_ICONS)[number];

export const CATEGORIES = [
  { id: "build", label: "Build", blurb: "Scaffold production features into a Next.js app with the house stack." },
  { id: "style", label: "Style", blurb: "Bring UI in line with the flat house style." },
  { id: "audit", label: "Audit", blurb: "Check compliance, writing quality and abandoned code, with fixes." },
  { id: "think", label: "Think", blurb: "Plan, scope and pressure-test before writing code." },
  { id: "grow", label: "Grow", blurb: "Diagnose and fix go-to-market and growth." },
  { id: "other", label: "Other", blurb: "Skills that are not categorised yet." },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** A skill counts as new when it shipped within this many minor plugin releases. */
export const NEW_SKILL_WINDOW = 3;

export type SkillMeta = {
  category: CategoryId;
  icon: SkillIcon;
  /** Card copy. Defaults to the first sentence of the SKILL.md description. */
  tagline?: string;
  /** Plugin version that first shipped the skill (from .claude-plugin/plugin.json history). */
  addedIn?: string;
};

export const SKILL_META = {
  "add-auth-db": { category: "build", icon: "lock", addedIn: "0.1.0", tagline: "Better Auth + Neon Postgres in raw SQL, with migrations, a seeder and a login dialog." },
  "add-terms-privacy": { category: "build", icon: "file-text", addedIn: "0.9.0", tagline: "Terms and Privacy pages built from your real company details." },
  "add-pwa": { category: "build", icon: "smartphone", addedIn: "0.10.0", tagline: "Installable PWA: manifest, generated icons, service worker and install banner." },
  "add-carousel": { category: "build", icon: "gallery-horizontal", addedIn: "0.11.0", tagline: "Native scroll-snap carousels in five patterns, with no carousel library." },
  "setup-chat": { category: "build", icon: "message-square", addedIn: "0.7.0", tagline: "Chat UI on the AI SDK and AI Gateway, with history, markdown and code blocks." },
  "setup-agent": { category: "build", icon: "bot", addedIn: "0.3.0", tagline: "Plan and scaffold an agent on MCP, A2A, UCP, AP2, A2UI and AGUI." },
  style: { category: "style", icon: "palette", addedIn: "0.1.0", tagline: "Audit a module against the flat house style, then refactor it." },
  "style-chat": { category: "style", icon: "messages-square", addedIn: "0.5.0", tagline: "Composer, streaming, thinking states and suggestion chips for chat UIs." },
  "style-hover-effects": { category: "style", icon: "mouse-pointer", addedIn: "0.6.0", tagline: "Hover states that change color, never geometry." },
  "style-auth-ui": { category: "style", icon: "key-round", addedIn: "0.2.0", tagline: "OAuth buttons with the right icons, brand colors, layout and states." },
  "pdpa-audit": { category: "audit", icon: "shield-check", addedIn: "0.12.0", tagline: "Audit personal-data handling against Singapore's PDPA, with PDPC citations." },
  "pick-up-abandoned": { category: "audit", icon: "archive-restore", addedIn: "0.15.0", tagline: "Find modules nobody adopted, then revive or kill each one by a date." },
  rewrite: { category: "audit", icon: "pen-line", addedIn: "0.4.0", tagline: "Strip AI writing tells and rewrite in a human voice." },
  feature: { category: "think", icon: "git-branch", addedIn: "0.13.0", tagline: "Ship complex features through six gated phases, tests first." },
  ideate: { category: "think", icon: "lightbulb", addedIn: "0.1.0", tagline: "A product manager's gap review of a module, ending in this week's top five." },
  council: { category: "think", icon: "users", addedIn: "0.8.0", tagline: "Pressure-test a decision with a five-advisor council and a chairman's verdict." },
  "b2b-saas-marketing": { category: "grow", icon: "trending-up", addedIn: "0.14.0", tagline: "Diagnose B2B SaaS growth: ads, unit economics, funnels, lifecycle email and pricing." },
} as const satisfies Record<string, SkillMeta>;
