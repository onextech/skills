import { existsSync, readdirSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SKILL_META } from "@/config/skills";
import { listParsedSkills, loadCatalog, readPluginVersion, staleMetaKeys } from "./load";
import { parseVersion } from "./catalog";

type AddSkill = (name: string, files: Record<string, string>) => Promise<void>;

const REPO_ROOT = path.resolve(__dirname, "../../..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

/** Independent oracle: folders that contain a SKILL.md. */
const skillDirsOnDisk = () =>
  readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(path.join(SKILLS_ROOT, d.name, "SKILL.md")))
    .map((d) => d.name)
    .toSorted();

describe("against the real repo", () => {
  it("loads every skill folder that has a SKILL.md, with no issues", async () => {
    const { skills, issues } = await listParsedSkills(SKILLS_ROOT);
    expect(issues).toEqual([]);
    expect(skills.map((s) => s.name).toSorted()).toEqual(skillDirsOnDisk());
  });

  it("gives every real skill a description and a README", async () => {
    const { skills } = await listParsedSkills(SKILLS_ROOT);
    skills.forEach((s) => {
      expect(s.description.length, s.name).toBeGreaterThan(20);
      expect(s.readme, s.name).toMatch(/\S/);
    });
  });

  it("has no config entries for skills that no longer exist", () => {
    expect(staleMetaKeys(Object.keys(SKILL_META), skillDirsOnDisk())).toEqual([]);
  });

  it("reads a semver plugin version", async () => {
    const version = await readPluginVersion(REPO_ROOT);
    expect(parseVersion(version)).not.toBeNull();
  });

  it("builds a sorted catalog whose new count follows the plugin version", async () => {
    const version = await readPluginVersion(REPO_ROOT);
    const catalog = await loadCatalog(SKILLS_ROOT, SKILL_META, version);
    expect(catalog).toHaveLength(skillDirsOnDisk().length);
    expect(catalog.every((s) => s.invoke === `/onex:${s.name}`)).toBe(true);
    expect(catalog.some((s) => s.isNew)).toBe(true);
  });
});

describe("against fixtures", () => {
  /** Runs `fn` against a fresh temp skills folder and always cleans it up. */
  const withRoot = async (fn: (root: string, addSkill: AddSkill) => Promise<void>) => {
    const root = await mkdtemp(path.join(tmpdir(), "onex-skills-"));
    const addSkill: AddSkill = async (name, files) => {
      await mkdir(path.join(root, name), { recursive: true });
      await Promise.all(Object.entries(files).map(([file, body]) => writeFile(path.join(root, name, file), body)));
    };
    try {
      await fn(root, addSkill);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  };

  it("handles every malformed case without throwing, reporting each issue", () =>
    withRoot(async (root, addSkill) => {
      await addSkill("good", { "SKILL.md": "---\ndescription: Does good things.\n---\n# Good", "README.md": "# Good readme" });
      await addSkill("no-readme", { "SKILL.md": "---\ndescription: Lacks a README.\n---\n" });
      await addSkill("bad-yaml", { "SKILL.md": "---\ndescription: [oops\n---\n" });
      await addSkill("empty-desc", { "SKILL.md": '---\ndescription: ""\n---\n' });
      await addSkill("no-skill-file", { "README.md": "# Only a readme" });
      await addSkill("Bad_Name", { "SKILL.md": "---\ndescription: Bad folder name.\n---\n" });
      await writeFile(path.join(root, "stray.md"), "not a folder");

      const { skills, issues } = await listParsedSkills(root);

      expect(skills).toEqual([
        { name: "good", description: "Does good things.", readme: "# Good readme" },
        { name: "no-readme", description: "Lacks a README.", readme: null },
      ]);
      expect(issues.toSorted((a, b) => a.name.localeCompare(b.name))).toEqual([
        { name: "Bad_Name", reason: "invalid-name" },
        { name: "bad-yaml", reason: "invalid-yaml" },
        { name: "empty-desc", reason: "missing-description" },
      ]);
    }));

  it("surfaces filesystem errors other than a missing file", () =>
    withRoot(async (root, addSkill) => {
      await addSkill("odd", { "SKILL.md": "---\ndescription: Has a README folder.\n---\n" });
      await mkdir(path.join(root, "odd", "README.md"));
      await expect(listParsedSkills(root)).rejects.toThrow(/EISDIR/);
    }));

  it("returns an empty list for an empty skills folder", () =>
    withRoot(async (root) => {
      expect(await listParsedSkills(root)).toEqual({ skills: [], issues: [] });
    }));

  it("throws a clear error when the skills folder is missing", () =>
    withRoot(async (root) => {
      await expect(listParsedSkills(path.join(root, "nope"))).rejects.toThrow(/Skills folder not found/);
    }));

  it("throws a clear error for a missing or invalid plugin manifest", () =>
    withRoot(async (root) => {
      await expect(readPluginVersion(root)).rejects.toThrow(/plugin\.json/);
      await mkdir(path.join(root, ".claude-plugin"));
      await writeFile(path.join(root, ".claude-plugin", "plugin.json"), JSON.stringify({ version: "latest" }));
      await expect(readPluginVersion(root)).rejects.toThrow(/semver/);
      await writeFile(path.join(root, ".claude-plugin", "plugin.json"), "null");
      await expect(readPluginVersion(root)).rejects.toThrow(/semver/);
      await writeFile(path.join(root, ".claude-plugin", "plugin.json"), "{ not json");
      await expect(readPluginVersion(root)).rejects.toThrow(/plugin\.json/);
    }));
});

describe("staleMetaKeys", () => {
  it("lists config keys with no matching skill folder", () => {
    expect(staleMetaKeys(["a", "b", "c"], ["a", "c", "d"])).toEqual(["b"]);
    expect(staleMetaKeys([], ["a"])).toEqual([]);
  });
});
