import {
  CATEGORIES,
  NEW_SKILL_WINDOW,
  type CategoryId,
  type SkillIcon,
  type SkillMeta,
} from "@/config/skills";
import { deriveTagline } from "./tagline";

export const FALLBACK_CATEGORY: CategoryId = "other";
export const FALLBACK_ICON: SkillIcon = "sparkles";

export type ParsedSkill = {
  name: string;
  description: string;
  readme: string | null;
};

export type Skill = {
  name: string;
  invoke: `/onex:${string}`;
  description: string;
  tagline: string;
  category: CategoryId;
  icon: SkillIcon;
  addedIn: string | null;
  isNew: boolean;
  readme: string | null;
};

export type CategoryFilter = CategoryId | "all";

type Version = { major: number; minor: number; patch: number };

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const CATEGORY_RANK = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i])) as Record<CategoryId, number>;

export const parseVersion = (value: string): Version | null => {
  const match = SEMVER.exec(value);
  return match ? { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) } : null;
};

/** True when `addedIn` is one of the last `window` minor releases of the current major. */
export const isNewSince = (addedIn: string | null, current: string, window: number): boolean => {
  const added = addedIn ? parseVersion(addedIn) : null;
  const now = parseVersion(current);
  if (!added || !now || added.major !== now.major) return false;
  const age = now.minor - added.minor;
  return age >= 0 && age < window;
};

export const sortSkills = (skills: readonly Skill[]): Skill[] =>
  skills.toSorted(
    (a, b) =>
      CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] || a.name.localeCompare(b.name),
  );

type Categorised = Pick<Skill, "category">;

export const filterSkills = <T extends Categorised>(skills: readonly T[], filter: CategoryFilter): readonly T[] =>
  filter === "all" ? skills : skills.filter((s) => s.category === filter);

export const countByCategory = (skills: readonly Categorised[]): Record<CategoryFilter, number> =>
  skills.reduce(
    (acc, s) => ({ ...acc, [s.category]: acc[s.category] + 1 }),
    Object.fromEntries([["all", skills.length], ...CATEGORIES.map((c) => [c.id, 0])]) as Record<CategoryFilter, number>,
  );

/** Empty cells needed so a grid of `n` items fills its last row of `cols`. */
export const padCount = (n: number, cols: number): number => (cols - (n % cols)) % cols;

/** The fields the client-side bento needs; keeps READMEs out of the client payload. */
export type BentoSkill = Pick<Skill, "name" | "invoke" | "tagline" | "category" | "icon" | "isNew">;

export const toBentoSkill = ({ name, invoke, tagline, category, icon, isNew }: Skill): BentoSkill => ({
  name,
  invoke,
  tagline,
  category,
  icon,
  isNew,
});

export const newSkillCount = (skills: readonly Skill[]): number => skills.filter((s) => s.isNew).length;

export const buildCatalog = (
  parsed: readonly ParsedSkill[],
  meta: Readonly<Record<string, SkillMeta>>,
  pluginVersion: string,
): Skill[] =>
  sortSkills(
    parsed.map(({ name, description, readme }) => {
      const m: SkillMeta | undefined = meta[name];
      const addedIn = m?.addedIn ?? null;
      return {
        name,
        invoke: `/onex:${name}`,
        description,
        tagline: m?.tagline ?? (deriveTagline(description) || name),
        category: m?.category ?? FALLBACK_CATEGORY,
        icon: m?.icon ?? FALLBACK_ICON,
        addedIn,
        isNew: isNewSince(addedIn, pluginVersion, NEW_SKILL_WINDOW),
        readme,
      };
    }),
  );
