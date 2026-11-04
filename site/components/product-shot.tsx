import Link from "next/link";
import { DEMO } from "@/config/site";
import { CATEGORIES } from "@/config/skills";
import type { Skill } from "@/lib/skills/catalog";
import { SkillIcon } from "./skill-icon";

const STATUS = {
  done: { glyph: "✓", className: "text-ok", textClassName: "" },
  running: { glyph: "●", className: "text-warn", textClassName: "" },
  pending: { glyph: "○", className: "text-dim", textClassName: "text-dim" },
} as const;

const LINE_DELAY_S = 0.25;
const FIRST_LINE_DELAY_S = 0.6;

/** A scripted Claude Code session for one skill. The log pane is decorative and hidden from assistive tech; the sidebar links stay reachable. */
export function ProductShot({ skills }: { skills: readonly Pick<Skill, "name" | "category" | "icon">[] }) {
  const running = DEMO.phases.findIndex((p) => p.status === "running");
  const groups = CATEGORIES.map((c) => ({ ...c, skills: skills.filter((s) => s.category === c.id) })).filter(
    (g) => g.skills.length > 0,
  );
  const lines = [
    { key: "cmd", node: <span className="text-fg"><span className="text-brand">›</span> /onex:{DEMO.skill}</span> },
    { key: "scope", node: <span className="text-muted">{DEMO.scope}</span> },
    ...DEMO.phases.map((p, i) => ({
      key: `p${i}`,
      node: (
        <span className="flex items-baseline gap-2.5 whitespace-nowrap">
          <span className={STATUS[p.status].className}>{STATUS[p.status].glyph}</span>
          <span className={STATUS[p.status].textClassName}>
            Phase {i + 1}&nbsp;&nbsp;{p.text}
          </span>
        </span>
      ),
    })),
  ];

  return (
    <div className="relative px-6 pt-14 [perspective:1600px]">
      <div className="mx-auto grid h-[420px] max-w-[1040px] origin-top animate-tilt overflow-hidden rounded-t-lg bg-panel ring-1 ring-line [mask-image:linear-gradient(#000_70%,transparent)] motion-reduce:animate-none motion-reduce:[transform:rotateX(8deg)] md:grid-cols-[220px_1fr]">
        <nav aria-label="Skills in the demo" className="hidden min-w-0 flex-col gap-0.5 overflow-hidden bg-[#0B0C0D] px-2.5 py-3.5 md:flex">
          <span className="flex items-center gap-2 px-2 pt-1.5 pb-3 text-[13px] font-medium">
            <i className="size-[18px] rounded-[5px] bg-[linear-gradient(135deg,var(--color-brand),var(--color-ok))]" />
            onex
          </span>
          {groups.map((g) => (
            <div key={g.id} className="flex flex-col gap-0.5">
              <span className="px-2 pt-2.5 pb-1 text-[11px] text-dim">{g.label}</span>
              {g.skills.map((s) => (
                <Link
                  key={s.name}
                  href={`/skills/${s.name}`}
                  aria-current={s.name === DEMO.skill ? "page" : undefined}
                  className="flex items-center gap-2 truncate rounded-[6px] px-2 py-[5px] font-mono text-[12.5px] text-muted transition-colors hover:bg-panel-2 hover:text-fg aria-[current=page]:bg-panel-3 aria-[current=page]:text-fg"
                >
                  <SkillIcon icon={s.icon} className="size-3.5" />
                  {s.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div aria-hidden className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-muted shadow-[inset_0_-1px_0_var(--color-line)]">
            <b className="font-medium text-fg">/onex:{DEMO.skill}</b> · {DEMO.project}
            <span className="ml-auto rounded-full bg-panel-3 px-2 py-0.5 font-mono text-[11px]">
              phase {running + 1} of {DEMO.phases.length}
            </span>
          </div>
          <ol className="flex flex-col gap-0.5 overflow-x-auto px-5 py-[18px] font-mono text-[13px] leading-[1.75]">
            {lines.map((line, i) => (
              <li
                key={line.key}
                className="animate-line-in motion-reduce:animate-none"
                style={{ animationDelay: `${FIRST_LINE_DELAY_S + i * LINE_DELAY_S}s` }}
              >
                {line.node}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
