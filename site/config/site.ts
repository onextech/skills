export const SITE = {
  name: "One X Skills",
  shortName: "One X",
  description:
    "Claude Code skills that turn \"add auth\" or \"audit for PDPA\" into the exact steps your best engineer would take, with gates, tests and house style built in.",
  repoUrl: "https://github.com/onextech/skills",
  repoBranch: "main",
} as const;

export const INSTALL_MODES = ["claude", "shell"] as const;
export type InstallMode = (typeof INSTALL_MODES)[number];

export const INSTALL = {
  claude: { label: "Claude Code", commands: ["/plugin marketplace add onextech/skills", "/plugin install onex@skills"] },
  shell: { label: "Shell", commands: ["claude plugin marketplace add onextech/skills", "claude plugin install onex@skills"] },
} as const satisfies Record<InstallMode, { label: string; commands: readonly string[] }>;

export const NAV = [
  { label: "Skills", href: "/#skills" },
  { label: "Install", href: "/#install" },
] as const;

export const STACK = ["Next.js", "Neon", "Better Auth", "shadcn/ui", "AI SDK", "Resend"] as const;

/** Scripted run shown in the hero product shot. `skill` must exist in the catalog. */
export const DEMO = {
  skill: "add-auth-db",
  project: "my-saas-app",
  scope: "Scope confirmed: email + magic link, Google OAuth, multi-tenant: no",
  phases: [
    { status: "done", text: "Install better-auth, @neondatabase/serverless, resend" },
    { status: "done", text: "Write migrations/0001_auth.sql + yarn db:migrate runner" },
    { status: "running", text: "Scaffold lib/auth.ts, app/api/auth/[...all]/route.ts" },
    { status: "pending", text: "Login dialog in components/auth-dialog.tsx" },
    { status: "pending", text: "Seed admin, update .env.example, run typecheck" },
  ],
} as const;

/** Bento grid columns per breakpoint; filler cells keep the last row complete at each. */
export const BENTO_COLUMNS = { sm: 2, lg: 3 } as const;

/** Page copy. `{count}` is replaced at render time. */
export const COPY = {
  hero: {
    headline: "Claude Code, with your team\u2019s taste.",
    lede: "{count} skills that turn \u201cadd auth\u201d or \u201caudit for PDPA\u201d into the exact steps your best engineer would take, with gates, tests and house style built in.",
    primaryCta: "Install plugin",
    secondaryCta: "Browse skills",
  },
  stack: "Built for the stack you already ship on",
  skills: {
    heading: "Skills",
    subtitle: "{count} skills, generated from the repo on every release.",
    empty: "No skills yet. The first one lands here on the next release.",
    readMore: "Read guide \u2192",
  },
  skillPage: { install: "Install the plugin", related: "More {count} skills", source: "View source" },
  notFound: {
    eyebrow: "404",
    title: "No skill by that name",
    body: "It may have been renamed. Every current skill is listed on the home page.",
    cta: "Browse skills",
  },
} as const;
