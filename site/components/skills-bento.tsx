"use client";

import Link from "next/link";
import { useState } from "react";
import { BENTO_COLUMNS, COPY } from "@/config/site";
import { CATEGORIES } from "@/config/skills";
import { countByCategory, filterSkills, padCount, type BentoSkill, type CategoryFilter } from "@/lib/skills/catalog";
import { SkillIcon } from "./skill-icon";

const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

/**
 * House-style exception: cells are split by 1px hairlines (the container's background
 * showing through `gap-px`). They are dividers inside one filled panel, not card borders.
 */
export function SkillsBento({ skills }: { skills: readonly BentoSkill[] }) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const counts = countByCategory(skills);
  const filters: CategoryFilter[] = ["all", ...CATEGORIES.map((c) => c.id).filter((id) => counts[id] > 0)];
  const visible = filterSkills(skills, filter);

  if (skills.length === 0) {
    return <p className="rounded-lg bg-panel p-8 text-muted">{COPY.skills.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Filter skills" className="flex w-fit max-w-full flex-wrap gap-0.5 rounded-[9px] bg-panel p-[3px]">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            data-filter={f}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
            className="cursor-pointer rounded-[7px] px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-fg aria-pressed:bg-panel-3 aria-pressed:text-fg"
          >
            {f === "all" ? "All" : LABEL[f]}
            <small className="ml-1.5 font-mono text-[11px] text-dim">{counts[f]}</small>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <Link
            key={s.name}
            href={`/skills/${s.name}`}
            data-category={s.category}
            className="group flex min-h-[168px] flex-col gap-3 bg-panel p-[22px] transition-colors hover:bg-panel-2"
          >
            <span className="flex items-center justify-between gap-2.5">
              <span className="grid size-[30px] place-items-center rounded-sm bg-panel-3 text-muted transition-colors group-hover:text-fg">
                <SkillIcon icon={s.icon} className="size-[15px]" />
              </span>
              {s.isNew ? (
                <span className="rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[11px] font-medium text-brand">New</span>
              ) : (
                <span className="font-mono text-[11px] text-dim">{LABEL[s.category].toLowerCase()}</span>
              )}
            </span>
            <code className="font-mono text-sm font-medium">{s.invoke}</code>
            <p className="text-sm text-muted">{s.tagline}</p>
            <span className="mt-auto text-[13px] text-dim transition-colors group-hover:text-fg">{COPY.skills.readMore}</span>
          </Link>
        ))}
        {Array.from({ length: padCount(visible.length, BENTO_COLUMNS.sm) }, (_, i) => (
          <div key={`sm-${i}`} data-filler="sm" aria-hidden className="hidden bg-panel sm:block lg:hidden" />
        ))}
        {Array.from({ length: padCount(visible.length, BENTO_COLUMNS.lg) }, (_, i) => (
          <div key={`lg-${i}`} data-filler="lg" aria-hidden className="hidden bg-panel lg:block" />
        ))}
      </div>
    </div>
  );
}
