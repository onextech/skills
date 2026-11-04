import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { SITE } from "@/config/site";
import { resolveReadmeHref, stripLeadingH1 } from "./markdown";

describe("stripLeadingH1", () => {
  it("only removes an H1 that opens the document", () => {
    expect(stripLeadingH1("\n\n# Title\n\ntext")).toBe("text");
    expect(stripLeadingH1("text\n\n# Later heading")).toBe("text\n\n# Later heading");
    expect(stripLeadingH1("## Subtitle\n\ntext")).toBe("## Subtitle\n\ntext");
    expect(stripLeadingH1("")).toBe("");
  });
});

describe("resolveReadmeHref", () => {
  const repoBlob = `${SITE.repoUrl}/blob/${SITE.repoBranch}/`;

  it("never produces a link outside the repo for any relative path", () => {
    const segment = fc.constantFrom("..", ".", "docs", "SKILL.md", "a b", "x%2F", "README.md");
    fc.assert(
      fc.property(fc.array(segment, { minLength: 1, maxLength: 6 }), fc.stringMatching(/^[a-z]{1,8}$/), (parts, name) => {
        const { href, external } = resolveReadmeHref(parts.join("/"), name);
        expect(external).toBe(true);
        expect(href === SITE.repoUrl || href.startsWith(repoBlob)).toBe(true);
        expect(href.slice(repoBlob.length)).not.toMatch(/(^|\/)\.\.?(\/|$)/);
      }),
    );
  });

  it.each([
    ["https://example.com/x", { href: "https://example.com/x", external: true }],
    ["http://example.com", { href: "http://example.com", external: true }],
    ["#section", { href: "#section", external: false }],
    ["mailto:joel@example.com", { href: "mailto:joel@example.com", external: false }],
    ["", { href: "", external: false }],
    ["../style/README.md", { href: `${SITE.repoUrl}/blob/${SITE.repoBranch}/skills/style/README.md`, external: true }],
    ["../../../etc/passwd", { href: SITE.repoUrl, external: true }],
  ])("resolves %j", (input, expected) => {
    expect(resolveReadmeHref(input, "add-pwa")).toEqual(expected);
  });
});
