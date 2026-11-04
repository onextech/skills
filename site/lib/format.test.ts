import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { countWord, fill } from "./format";

describe("countWord", () => {
  it("spells out zero to twenty and uses digits above", () => {
    expect(countWord(0)).toBe("Zero");
    expect(countWord(16)).toBe("Sixteen");
    expect(countWord(20)).toBe("Twenty");
    fc.assert(fc.property(fc.integer({ min: 21, max: 10_000 }), (n) => {
      expect(countWord(n)).toBe(String(n));
    }));
  });

  it("starts with a capital for every spelled-out number", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 20 }), (n) => {
      expect(countWord(n)).toMatch(/^[A-Z][a-z]+$/);
    }));
  });
});

describe("fill", () => {
  it("replaces every {count} and nothing else", () => {
    fc.assert(
      fc.property(fc.array(fc.stringMatching(/^[a-z ]{0,8}$/), { maxLength: 5 }), fc.nat(), (parts, n) => {
        const template = parts.join("{count}");
        expect(fill(template, n)).toBe(parts.join(String(n)));
      }),
    );
  });
});
