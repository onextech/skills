import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { SkillMeta } from "@/config/skills";
import { buildCatalog, parseVersion, type ParsedSkill, type Skill } from "./catalog";
import { isValidSkillName, parseSkillFile } from "./parse";

export type SkillIssue = {
  name: string;
  reason: "invalid-name" | "no-frontmatter" | "invalid-yaml" | "missing-description";
};

type DirResult = { skill: ParsedSkill } | { issue: SkillIssue } | null;

const readOptional = (file: string): Promise<string | null> =>
  readFile(file, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });

const readSkillDir = async (root: string, name: string): Promise<DirResult> => {
  const [skillFile, readme] = await Promise.all([
    readOptional(path.join(root, name, "SKILL.md")),
    readOptional(path.join(root, name, "README.md")),
  ]);
  if (skillFile === null) return null;
  if (!isValidSkillName(name)) return { issue: { name, reason: "invalid-name" } };
  const parsed = parseSkillFile(skillFile);
  return parsed.ok
    ? { skill: { name, description: parsed.description, readme } }
    : { issue: { name, reason: parsed.reason } };
};

/** Reads `root/<name>/SKILL.md` (+ optional README.md) for every folder in `root`. */
export const listParsedSkills = async (
  root: string,
): Promise<{ skills: ParsedSkill[]; issues: SkillIssue[] }> => {
  const entries = await readdir(root, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    throw new Error(`Skills folder not found at ${root}`, { cause: error });
  });
  const results = await Promise.all(
    entries.filter((e) => e.isDirectory()).map((e) => readSkillDir(root, e.name)),
  );
  return {
    skills: results
      .flatMap((r) => (r && "skill" in r ? [r.skill] : []))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
    issues: results.flatMap((r) => (r && "issue" in r ? [r.issue] : [])),
  };
};

export const readPluginVersion = async (repoRoot: string): Promise<string> => {
  const file = path.join(repoRoot, ".claude-plugin", "plugin.json");
  const manifest = await readFile(file, "utf8")
    .then((raw) => JSON.parse(raw) as { version?: unknown } | null)
    .catch((error: unknown) => {
      throw new Error(`Could not read ${file}`, { cause: error });
    });
  const version = manifest?.version;
  if (typeof version !== "string" || !parseVersion(version)) {
    throw new Error(`plugin.json version must be semver x.y.z, got ${JSON.stringify(version)}`);
  }
  return version;
};

export const loadCatalog = async (
  root: string,
  meta: Readonly<Record<string, SkillMeta>>,
  pluginVersion: string,
): Promise<Skill[]> => {
  const { skills, issues } = await listParsedSkills(root);
  issues.forEach((i) => console.warn(`[skills] skipped "${i.name}": ${i.reason}`));
  return buildCatalog(skills, meta, pluginVersion);
};

export const staleMetaKeys = (metaKeys: readonly string[], skillNames: readonly string[]): string[] => {
  const existing = new Set(skillNames);
  return metaKeys.filter((k) => !existing.has(k));
};
