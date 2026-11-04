// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import fc from "fast-check";
import { afterEach, describe, expect, it } from "vitest";
import { BENTO_COLUMNS } from "@/config/site";
import { CATEGORIES, SKILL_ICONS } from "@/config/skills";
import { countByCategory, filterSkills, padCount, toBentoSkill, type Skill } from "@/lib/skills/catalog";
import { SkillsBento } from "./skills-bento";

afterEach(cleanup);

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

const skillArb = fc
  .record({
    name: fc.stringMatching(/^[a-z]{2,8}(-[a-z]{2,6})?$/),
    category: fc.constantFrom(...CATEGORY_IDS),
    icon: fc.constantFrom(...SKILL_ICONS),
    isNew: fc.boolean(),
  })
  .map(
    ({ name, category, icon, isNew }): Skill => ({
      name,
      invoke: `/onex:${name}`,
      description: `${name} description`,
      tagline: `${name} tagline.`,
      category,
      icon,
      addedIn: null,
      isNew,
      readme: null,
    }),
  );
const skillsArb = fc.uniqueArray(skillArb, { selector: (s) => s.name, minLength: 1, maxLength: 20 });

const cards = () => screen.queryAllByRole("link");
const fillers = (bp: keyof typeof BENTO_COLUMNS) => document.querySelectorAll(`[data-filler="${bp}"]`);
const expectFillers = (n: number) =>
  (Object.keys(BENTO_COLUMNS) as (keyof typeof BENTO_COLUMNS)[]).forEach((bp) =>
    expect(fillers(bp)).toHaveLength(padCount(n, BENTO_COLUMNS[bp])),
  );

describe("SkillsBento", () => {
  it("shows one card per skill and pads the last row, for any catalog", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        cleanup();
        render(<SkillsBento skills={skills.map(toBentoSkill)} />);
        expect(cards()).toHaveLength(skills.length);
        expectFillers(skills.length);
      }),
      { numRuns: 40 },
    );
  });

  it("offers a filter only for categories that have skills, with correct counts", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        cleanup();
        render(<SkillsBento skills={skills.map(toBentoSkill)} />);
        const counts = countByCategory(skills);
        const expected = ["all", ...CATEGORY_IDS.filter((c) => counts[c] > 0)];
        const buttons = screen.getAllByRole("button");
        expect(buttons.map((b) => b.dataset.filter)).toEqual(expected);
        buttons.forEach((b) => expect(b).toHaveTextContent(String(counts[b.dataset.filter as keyof typeof counts])));
      }),
      { numRuns: 40 },
    );
  });

  it("filtering shows exactly that category's skills, and All restores them", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        cleanup();
        render(<SkillsBento skills={skills.map(toBentoSkill)} />);
        const target = skills[0].category;
        fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${CATEGORIES.find((c) => c.id === target)!.label}`) }));
        const expectedNames = filterSkills(skills, target).map((s) => s.invoke);
        expect(cards().map((c) => c.querySelector("code")?.textContent)).toEqual(expectedNames);
        expectFillers(expectedNames.length);
        fireEvent.click(screen.getByRole("button", { name: /^All/ }));
        expect(cards()).toHaveLength(skills.length);
      }),
      { numRuns: 30 },
    );
  });

  it("links each card to its skill page and badges new skills", () => {
    const skills = fc.sample(skillsArb, 1)[0].map((s, i) => ({ ...s, isNew: i === 0 }));
    render(<SkillsBento skills={skills.map(toBentoSkill)} />);
    cards().forEach((card, i) => expect(card).toHaveAttribute("href", `/skills/${skills[i].name}`));
    expect(screen.getAllByText("New")).toHaveLength(1);
  });

  it("shows an empty state when there are no skills", () => {
    render(<SkillsBento skills={[]} />);
    expect(screen.getByText(/No skills yet/)).toBeInTheDocument();
    expect(cards()).toHaveLength(0);
  });

  it("sends only display fields to the client", () => {
    const [skill] = fc.sample(skillArb, 1);
    expect(Object.keys(toBentoSkill({ ...skill, readme: "# big readme" })).toSorted()).toEqual(
      ["category", "icon", "invoke", "isNew", "name", "tagline"],
    );
  });
});
