import { renderToStaticMarkup } from "react-dom/server";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { DEMO, SITE, STACK } from "@/config/site";
import { CATEGORIES, SKILL_ICONS, SKILL_META } from "@/config/skills";
import type { Skill } from "@/lib/skills/catalog";
import { ProductShot } from "./product-shot";
import { ReleasePill } from "./release-pill";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SkillIcon } from "./skill-icon";
import { StackRow } from "./stack-row";

const skill = (name: string, category: Skill["category"]): Skill => ({
  name,
  invoke: `/onex:${name}`,
  description: "d",
  tagline: "t",
  category,
  icon: "sparkles",
  addedIn: null,
  isNew: false,
  readme: null,
});

const externalAnchors = (html: string) => html.match(/<a [^>]*target="_blank"[^>]*>.*?<\/a>/g) ?? [];

describe("SkillIcon", () => {
  it.each(SKILL_ICONS)("renders an svg for %s", (icon) => {
    expect(renderToStaticMarkup(<SkillIcon icon={icon} />)).toMatch(/^<svg[^>]*aria-hidden="true"/);
  });
});

describe("ReleasePill", () => {
  it("states the version and pluralises the new-skill count", () => {
    fc.assert(
      fc.property(fc.nat(30), fc.integer({ min: 1, max: 30 }), (minor, count) => {
        const html = renderToStaticMarkup(<ReleasePill version={`0.${minor}.0`} newCount={count} />);
        expect(html).toContain(`v0.${minor}`);
        expect(html).toContain(count === 1 ? "1 new skill" : `${count} new skills`);
      }),
    );
  });

  it("renders nothing about new skills when there are none", () => {
    expect(renderToStaticMarkup(<ReleasePill version="0.14.0" newCount={0} />)).toContain("All skills");
  });
});

describe("ProductShot", () => {
  const catalog = CATEGORIES.flatMap((c, i) => [skill(`${c.id}-one`, c.id), skill(`${c.id}-two${i}`, c.id)]).concat(
    skill(DEMO.skill, "build"),
  );
  const html = renderToStaticMarkup(<ProductShot skills={catalog} />);

  it("lists every catalog skill in the sidebar and highlights the demo skill", () => {
    catalog.forEach((s) => expect(html).toContain(`>${s.name}<`));
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`aria-current="page"[^>]*>.*?${DEMO.skill}`));
  });

  it("shows every scripted phase with its status", () => {
    DEMO.phases.forEach((p) => expect(html).toContain(p.text.replace(/&/g, "&amp;")));
    expect(html).toContain(`phase ${DEMO.phases.findIndex((p) => p.status === "running") + 1} of ${DEMO.phases.length}`);
  });

  it("demos a skill that really exists in the config", () => {
    expect(Object.keys(SKILL_META)).toContain(DEMO.skill);
  });
});

describe("StackRow", () => {
  it("lists every stack entry once, in order", () => {
    const items = [...renderToStaticMarkup(<StackRow />).matchAll(/<li>(.*?)<\/li>/g)].map((m) => m[1]);
    expect(items).toEqual([...STACK]);
  });
});

describe("header and footer", () => {
  it.each([
    ["header", renderToStaticMarkup(<SiteHeader />)],
    ["footer", renderToStaticMarkup(<SiteFooter version="0.14.0" />)],
  ])("%s: every new-tab link carries the external-link icon", (_name, html) => {
    const anchors = externalAnchors(html);
    expect(anchors.length).toBeGreaterThan(0);
    anchors.forEach((a) => {
      expect(a).toContain('rel="noopener noreferrer"');
      expect(a).toContain("lucide-external-link");
    });
    expect(html).toContain(SITE.repoUrl);
  });
});
