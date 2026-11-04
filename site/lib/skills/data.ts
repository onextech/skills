import path from "node:path";
import { cacheLife } from "next/cache";
import { SKILL_META } from "@/config/skills";
import type { Skill } from "./catalog";
import { loadCatalog, readPluginVersion } from "./load";
import { isValidSkillName } from "./parse";

/**
 * Next.js data layer: cached reads of the repo's skills. Logic lives in load.ts
 * (unit/integration tested); these wrappers only add caching and are covered by e2e.
 * `site/` is the project root, so the repo is its parent.
 */
const REPO_ROOT = path.resolve(process.cwd(), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

export async function getPluginVersion(): Promise<string> {
  "use cache";
  cacheLife("max");
  return readPluginVersion(REPO_ROOT);
}

export async function getCatalog(): Promise<Skill[]> {
  "use cache";
  cacheLife("max");
  return loadCatalog(SKILLS_ROOT, SKILL_META, await readPluginVersion(REPO_ROOT));
}

/** Validates the slug before touching the filesystem, so it cannot traverse paths. */
export async function getSkill(name: string): Promise<Skill | null> {
  if (!isValidSkillName(name)) return null;
  const catalog = await getCatalog();
  return catalog.find((s) => s.name === name) ?? null;
}
