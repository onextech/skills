import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { CATEGORIES, NEW_SKILL_WINDOW, SKILL_META, type CategoryId, type SkillMeta } from "@/config/skills";
import {
  FALLBACK_CATEGORY,
  FALLBACK_ICON,
  buildCatalog,
  countByCategory,
  filterSkills,
  isNewSince,
  newSkillCount,
  padCount,
  parseVersion,
  sortSkills,
  type ParsedSkill,
  type Skill,
} from "./catalog";
import { TAGLINE_MAX } from "./tagline";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
const categoryRank = (id: CategoryId) => CATEGORY_IDS.indexOf(id);

const skillName = fc
  .array(fc.stringMatching(/^[a-z0-9]{1,6}$/), { minLength: 1, maxLength: 3 })
  .map((parts) => parts.join("-"));

const skillArb: fc.Arbitrary<Skill> = fc.record({
  name: skillName,
  description: fc.string({ minLength: 1, maxLength: 80 }),
  category: fc.constantFrom(...CATEGORY_IDS),
}).map(({ name, description, category }) => ({
  name,
  invoke: `/onex:${name}`,
  description,
  tagline: description,
  category,
  icon: FALLBACK_ICON,
  addedIn: null,
  isNew: false,
  readme: null,
}));

const skillsArb = fc.uniqueArray(skillArb, { selector: (s) => s.name, maxLength: 30 });

const shuffle = <T,>(items: readonly T[], seed: number): T[] =>
  items
    .map((item, i) => ({ item, key: Math.sin(seed * 9973 + i * 7919) }))
    .toSorted((a, b) => a.key - b.key)
    .map(({ item }) => item);

describe("sortSkills", () => {
  it("is idempotent", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        const once = sortSkills(skills);
        expect(sortSkills(once)).toEqual(once);
      }),
    );
  });

  it("gives the same order for any permutation of the input", () => {
    fc.assert(
      fc.property(skillsArb, fc.integer(), (skills, seed) => {
        expect(sortSkills(shuffle(skills, seed))).toEqual(sortSkills(skills));
      }),
    );
  });

  it("orders by category rank, then by name", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        const sorted = sortSkills(skills);
        sorted.slice(1).forEach((curr, i) => {
          const prev = sorted[i];
          const rankDiff = categoryRank(curr.category) - categoryRank(prev.category);
          expect(rankDiff).toBeGreaterThanOrEqual(0);
          if (rankDiff === 0) expect(curr.name.localeCompare(prev.name)).toBeGreaterThan(0);
        });
      }),
    );
  });

  it("does not mutate its input", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        const before = skills.map((s) => s.name);
        sortSkills(skills);
        expect(skills.map((s) => s.name)).toEqual(before);
      }),
    );
  });
});

describe("filterSkills", () => {
  it("returns everything for 'all'", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        expect(filterSkills(skills, "all")).toEqual(skills);
      }),
    );
  });

  it("returns only matching skills, as a subset of the input", () => {
    fc.assert(
      fc.property(skillsArb, fc.constantFrom(...CATEGORY_IDS), (skills, category) => {
        const result = filterSkills(skills, category);
        result.forEach((s) => {
          expect(s.category).toBe(category);
          expect(skills).toContain(s);
        });
      }),
    );
  });

  it("partitions the input: the union over categories is the whole list", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        const union = CATEGORY_IDS.flatMap((c) => filterSkills(skills, c)).map((s) => s.name);
        expect(union.toSorted()).toEqual(skills.map((s) => s.name).toSorted());
      }),
    );
  });

  it("agrees with countByCategory", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        const counts = countByCategory(skills);
        CATEGORY_IDS.forEach((c) => expect(counts[c]).toBe(filterSkills(skills, c).length));
        expect(counts.all).toBe(skills.length);
      }),
    );
  });
});

describe("padCount", () => {
  it("fills the last row exactly, adding fewer cells than a row", () => {
    fc.assert(
      fc.property(fc.nat(500), fc.integer({ min: 1, max: 6 }), (n, cols) => {
        const pad = padCount(n, cols);
        expect(pad).toBeGreaterThanOrEqual(0);
        expect(pad).toBeLessThan(cols);
        expect((n + pad) % cols).toBe(0);
      }),
    );
  });
});

describe("versions and 'new'", () => {
  const semver = fc.tuple(fc.nat(9), fc.nat(40), fc.nat(9)).map(([a, b, c]) => `${a}.${b}.${c}`);

  it("parses any x.y.z it produced", () => {
    fc.assert(
      fc.property(fc.nat(99), fc.nat(99), fc.nat(99), (a, b, c) => {
        expect(parseVersion(`${a}.${b}.${c}`)).toEqual({ major: a, minor: b, patch: c });
      }),
    );
  });

  it.each(["", "1.2", "v1.2.3", "1.2.x", "01.2.3"])("rejects malformed version %j", (v) => {
    expect(parseVersion(v)).toBeNull();
  });

  it("marks exactly the last `window` minor releases of the current major as new", () => {
    fc.assert(
      fc.property(fc.nat(5), fc.integer({ min: 0, max: 30 }), fc.integer({ min: 1, max: 5 }), (major, minor, window) => {
        const current = `${major}.${minor}.0`;
        const newMinors = Array.from({ length: minor + 1 }, (_, m) => m).filter((m) =>
          isNewSince(`${major}.${m}.0`, current, window),
        );
        expect(newMinors).toEqual(
          Array.from({ length: Math.min(window, minor + 1) }, (_, i) => minor - Math.min(window, minor + 1) + 1 + i),
        );
      }),
    );
  });

  it("never marks future, other-major, missing or malformed versions as new", () => {
    fc.assert(
      fc.property(semver, (current) => {
        const v = parseVersion(current)!;
        expect(isNewSince(`${v.major}.${v.minor + 1}.0`, current, 99)).toBe(false);
        expect(isNewSince(`${v.major + 1}.0.0`, current, 99)).toBe(false);
        expect(isNewSince(null, current, 99)).toBe(false);
        expect(isNewSince("nope", current, 99)).toBe(false);
        expect(isNewSince("0.1.0", "garbage", 99)).toBe(false);
      }),
    );
  });
});

describe("buildCatalog", () => {
  const parsed = (name: string, description: string, readme: string | null = null): ParsedSkill => ({
    name,
    description,
    readme,
  });

  it("uses config metadata when present", () => {
    const meta: Record<string, SkillMeta> = {
      "add-pwa": { category: "build", icon: "smartphone", tagline: "Make it installable.", addedIn: "0.10.0" },
    };
    const [skill] = buildCatalog([parsed("add-pwa", "Long description. Use when asked.", "# PWA")], meta, "0.11.0");
    expect(skill).toEqual({
      name: "add-pwa",
      invoke: "/onex:add-pwa",
      description: "Long description. Use when asked.",
      tagline: "Make it installable.",
      category: "build",
      icon: "smartphone",
      addedIn: "0.10.0",
      isNew: true,
      readme: "# PWA",
    });
  });

  it("falls back for a skill with no metadata, so new skills still render", () => {
    fc.assert(
      fc.property(skillName, fc.string({ minLength: 1, maxLength: 300 }), (name, description) => {
        const [skill] = buildCatalog([parsed(name, description)], {}, "1.0.0");
        expect(skill.category).toBe(FALLBACK_CATEGORY);
        expect(skill.icon).toBe(FALLBACK_ICON);
        expect(skill.isNew).toBe(false);
        expect(skill.tagline.length).toBeGreaterThan(0);
        expect(skill.tagline.length).toBeLessThanOrEqual(TAGLINE_MAX);
      }),
    );
  });

  it("uses the skill name when no tagline can be derived", () => {
    const [skill] = buildCatalog([parsed("go", "Use when the user says go.")], {}, "1.0.0");
    expect(skill.tagline).toBe("go");
  });

  it("returns skills sorted and counts new ones", () => {
    const meta: Record<string, SkillMeta> = {
      zeta: { category: "build", icon: "lock", addedIn: "0.3.0" },
      alpha: { category: "think", icon: "lightbulb", addedIn: "0.1.0" },
      beta: { category: "build", icon: "lock", addedIn: "0.2.0" },
    };
    const skills = buildCatalog(["zeta", "alpha", "beta"].map((n) => parsed(n, `${n} does things.`)), meta, "0.3.0");
    expect(skills.map((s) => s.name)).toEqual(["beta", "zeta", "alpha"]);
    expect(newSkillCount(skills)).toBe(Math.min(NEW_SKILL_WINDOW, 3));
  });
});

describe("config/skills", () => {
  it("gives every configured skill a known category and a short tagline", () => {
    Object.entries(SKILL_META).forEach(([name, meta]) => {
      expect(CATEGORY_IDS, name).toContain(meta.category);
      expect(meta.tagline?.length ?? 0, name).toBeLessThanOrEqual(TAGLINE_MAX);
      if (meta.addedIn) expect(parseVersion(meta.addedIn), name).not.toBeNull();
    });
  });

  it("lists the fallback category last so unclassified skills sort to the end", () => {
    expect(CATEGORY_IDS.at(-1)).toBe(FALLBACK_CATEGORY);
  });
});
