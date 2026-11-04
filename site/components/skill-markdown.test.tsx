import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { SITE } from "@/config/site";
import { SkillMarkdown } from "./skill-markdown";

const render = async (source: string, skillName = "add-pwa") =>
  renderToStaticMarkup(await SkillMarkdown({ source, skillName }));

/** Shiki loads grammars and its WASM engine once; pay that cost outside the per-test timeout. */
const SHIKI_WARMUP_MS = 30_000;

describe("SkillMarkdown", () => {
  beforeAll(() => render("```ts\nconst warm = 1;\n```"), SHIKI_WARMUP_MS);

  it("gives headings slug ids for deep links", async () => {
    expect(await render("intro\n\n## Install steps\n")).toContain('<h2 id="install-steps">Install steps</h2>');
  });

  it("highlights fenced code at build time", async () => {
    const html = await render("```ts\nconst answer: number = 42;\n```");
    expect(html).toMatch(/<pre class="shiki[^"]*"/);
    expect(html).toMatch(/<span style="color:#[0-9A-Fa-f]{6}">const<\/span>/);
  });

  it("renders GFM tables", async () => {
    expect(await render("| a | b |\n|---|---|\n| 1 | 2 |")).toContain("<table>");
  });

  it("escapes raw HTML instead of running it", async () => {
    const html = await render('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">');
    expect(html).not.toMatch(/<script|<img|onerror="/);
  });

  it("strips javascript: links", async () => {
    expect(await render("[click](javascript:alert(1))")).not.toContain("javascript:");
  });

  it("opens external links in a new tab with the external-link icon", async () => {
    const html = await render("[Docs](https://docs.claude.com)");
    expect(html).toMatch(
      /<a href="https:\/\/docs\.claude\.com" target="_blank" rel="noopener noreferrer"[^>]*>Docs<svg[^>]*lucide-external-link/,
    );
  });

  it("points relative README links at the file on GitHub", async () => {
    const html = await render("[skill file](./SKILL.md)", "add-pwa");
    expect(html).toContain(`href="${SITE.repoUrl}/blob/${SITE.repoBranch}/skills/add-pwa/SKILL.md"`);
  });

  it("keeps in-page anchors in the same tab, without an icon", async () => {
    const html = await render("[jump](#usage)");
    expect(html).toContain('<a href="#usage">jump</a>');
  });

  it("drops the README's first H1 because the page renders its own title", async () => {
    const html = await render("# /onex:add-pwa — PWA\n\nBody text.");
    expect(html).not.toContain("<h1");
    expect(html).toContain("<p>Body text.</p>");
  });
});
