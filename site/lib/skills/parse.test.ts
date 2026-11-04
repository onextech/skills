import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { isValidSkillName, parseSkillFile } from "./parse";
import { TAGLINE_MAX, deriveTagline } from "./tagline";

const ELLIPSIS = "…";
const collapse = (s: string) => s.replace(/\s+/g, " ").trim();
const skillFile = (frontmatter: string, body = "\n# Title\n\nBody.\n") =>
  `---\n${frontmatter}\n---\n${body}`;

/** Grapheme strings avoid lone surrogates, which are not valid YAML. */
const text = (opts: { minLength?: number; maxLength?: number } = {}) =>
  fc.string({ unit: "grapheme", ...opts });

describe("parseSkillFile", () => {
  it("round-trips any non-blank description through YAML frontmatter", () => {
    fc.assert(
      fc.property(
        text({ minLength: 1, maxLength: 400 }).filter((s) => s.trim() !== ""),
        text({ maxLength: 200 }),
        (description, body) => {
          const raw = skillFile(`description: ${JSON.stringify(description)}`, `\n${body}`);
          const result = parseSkillFile(raw);
          expect(result).toMatchObject({ ok: true, description: description.trim() });
        },
      ),
    );
  });

  it("never throws, whatever the input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), (raw) => {
        const result = parseSkillFile(raw);
        expect(typeof result.ok).toBe("boolean");
      }),
    );
  });

  it("never throws on input shaped like frontmatter with arbitrary YAML", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (yamlish) => {
        const result = parseSkillFile(skillFile(yamlish));
        if (!result.ok) {
          expect(["no-frontmatter", "invalid-yaml", "missing-description"]).toContain(result.reason);
        }
      }),
    );
  });

  it("reads a folded multi-line description and the markdown body", () => {
    const raw = skillFile(
      "description: >\n  Add Better Auth plus a Neon Postgres database:\n  raw SQL, no ORM.",
      "\n# /onex:add-auth-db\n\nSteps.\n",
    );
    expect(parseSkillFile(raw)).toEqual({
      ok: true,
      description: "Add Better Auth plus a Neon Postgres database: raw SQL, no ORM.",
      body: "\n# /onex:add-auth-db\n\nSteps.\n",
    });
  });

  it("keeps colons, quotes and em dashes inside a plain scalar", () => {
    const raw = skillFile(`description: 'Audit "AI-isms" — em dashes, hollow intensifiers: all of them.'`);
    expect(parseSkillFile(raw)).toMatchObject({
      ok: true,
      description: 'Audit "AI-isms" — em dashes, hollow intensifiers: all of them.',
    });
  });

  it.each([
    ["no frontmatter at all", "# Just markdown\n", "no-frontmatter"],
    ["empty string", "", "no-frontmatter"],
    ["broken YAML", skillFile("description: [unclosed"), "invalid-yaml"],
    ["no description key", skillFile("name: thing"), "missing-description"],
    ["blank description", skillFile('description: "   "'), "missing-description"],
    ["non-string description", skillFile("description: 42"), "missing-description"],
    ["list description", skillFile("description:\n  - a\n  - b"), "missing-description"],
    ["JS frontmatter (gray-matter would eval it)", "---js\n({ description: 'pwned' })\n---\n", "invalid-yaml"],
    ["scalar YAML document", skillFile("just a string"), "missing-description"],
  ])("rejects %s", (_label, raw, reason) => {
    expect(parseSkillFile(raw)).toEqual({ ok: false, reason });
  });
});

describe("isValidSkillName", () => {
  it("accepts every kebab-case name", () => {
    const segment = fc.stringMatching(/^[a-z0-9]{1,8}$/);
    fc.assert(
      fc.property(fc.array(segment, { minLength: 1, maxLength: 4 }), (parts) => {
        expect(isValidSkillName(parts.join("-"))).toBe(true);
      }),
    );
  });

  it("rejects names containing anything outside [a-z0-9-]", () => {
    const bad = fc.constantFrom("A", " ", "/", ".", "_", "\\", "%", "é", "\n");
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z0-9]{0,6}$/), bad, fc.stringMatching(/^[a-z0-9]{0,6}$/), (pre, ch, post) => {
        expect(isValidSkillName(`${pre}${ch}${post}`)).toBe(false);
      }),
    );
  });

  it.each(["", "-lead", "trail-", "dou--ble", "..", "../etc", "add-pwa/../x"])("rejects %j", (name) => {
    expect(isValidSkillName(name)).toBe(false);
  });

  it.each(["add-pwa", "style", "b2b-saas-marketing", "pdpa-audit"])("accepts %j", (name) => {
    expect(isValidSkillName(name)).toBe(true);
  });
});

describe("deriveTagline", () => {
  it("is never longer than the limit and never contains 'Use when'", () => {
    fc.assert(
      fc.property(text({ maxLength: 600 }), fc.integer({ min: 20, max: 300 }), (description, max) => {
        const tagline = deriveTagline(description, max);
        expect(tagline.length).toBeLessThanOrEqual(max);
        expect(tagline).not.toMatch(/use when/i);
      }),
    );
  });

  it("always comes from the start of the description", () => {
    fc.assert(
      fc.property(text({ maxLength: 600 }), (description) => {
        const tagline = deriveTagline(description);
        const stem = tagline.endsWith(ELLIPSIS) ? tagline.slice(0, -1) : tagline;
        const stripped = stem.replace(/\.$/, "");
        expect(collapse(description).startsWith(stripped)).toBe(true);
      }),
    );
  });

  it("is idempotent once it fits", () => {
    fc.assert(
      fc.property(text({ maxLength: 600 }), (description) => {
        const once = deriveTagline(description);
        if (!once.endsWith(ELLIPSIS)) expect(deriveTagline(once)).toBe(once);
      }),
    );
  });

  it("stops at the first sentence", () => {
    expect(deriveTagline("Brainstorm gaps in a module. Always confirms scope first.")).toBe(
      "Brainstorm gaps in a module.",
    );
  });

  it("stops at an em dash clause", () => {
    expect(
      deriveTagline("Turn an app into an installable PWA — manifest, icons, service worker. Use when asked."),
    ).toBe("Turn an app into an installable PWA.");
  });

  it("drops a trailing 'Use when' clause", () => {
    expect(deriveTagline("Style hover states Use when the user says hover")).toBe("Style hover states.");
  });

  it("cuts long text at a word boundary with an ellipsis", () => {
    const long = `Add ${"very ".repeat(60)}long things`;
    const tagline = deriveTagline(long);
    expect(tagline.length).toBeLessThanOrEqual(TAGLINE_MAX);
    expect(tagline.endsWith(ELLIPSIS)).toBe(true);
    expect(tagline).toMatch(/very…$/);
  });

  it("respects the limit exactly at the boundary, including the added full stop", () => {
    fc.assert(
      fc.property(fc.integer({ min: 20, max: 200 }), fc.integer({ min: -3, max: 3 }), (max, delta) => {
        const words = "word ".repeat(80).slice(0, Math.max(1, max + delta)).trim();
        const tagline = deriveTagline(words, max);
        expect(tagline.length).toBeLessThanOrEqual(max);
        expect(tagline.length).toBeGreaterThan(max / 2);
      }),
    );
  });

  it("hard-cuts a single word longer than the limit", () => {
    const word = "x".repeat(300);
    expect(deriveTagline(word, 50)).toBe(`${"x".repeat(49)}${ELLIPSIS}`);
  });

  it("returns an empty string when a long description is only punctuation", () => {
    expect(deriveTagline("-".repeat(300))).toBe("");
  });

  it("handles a real skill description from the repo", () => {
    const real =
      "Audit and rewrite content to remove AI writing patterns (\"AI-isms\") that make text sound machine-generated. Flags em dashes.";
    expect(deriveTagline(real)).toBe(
      'Audit and rewrite content to remove AI writing patterns ("AI-isms") that make text sound machine-generated.',
    );
  });

  it("returns an empty string when nothing precedes 'Use when'", () => {
    expect(deriveTagline("Use when the user says go.")).toBe("");
    expect(deriveTagline("   ")).toBe("");
  });
});
