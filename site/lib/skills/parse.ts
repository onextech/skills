import matter from "gray-matter";

const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type SkillFileParse =
  | { ok: true; description: string; body: string }
  | { ok: false; reason: "no-frontmatter" | "invalid-yaml" | "missing-description" };

const refuseEngine = () => {
  throw new Error("Only YAML frontmatter is supported");
};

/** gray-matter evaluates `---js` frontmatter with eval; only YAML is allowed here. */
const MATTER_OPTIONS = {
  language: "yaml",
  engines: { js: refuseEngine, javascript: refuseEngine, coffee: refuseEngine },
} as const;

export const isValidSkillName = (name: string): boolean => SKILL_NAME.test(name);

export const parseSkillFile = (raw: string): SkillFileParse => {
  if (!matter.test(raw)) return { ok: false, reason: "no-frontmatter" };
  try {
    const { data, content } = matter(raw, MATTER_OPTIONS);
    const description =
      typeof data === "object" && data !== null && typeof data.description === "string"
        ? data.description.trim()
        : "";
    return description
      ? { ok: true, description, body: content }
      : { ok: false, reason: "missing-description" };
  } catch {
    return { ok: false, reason: "invalid-yaml" };
  }
};
