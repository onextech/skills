import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { COPY, INSTALL } from "../../config/site";

const SKILLS_ROOT = path.resolve(__dirname, "../../../skills");
const SKILL_NAMES = readdirSync(SKILLS_ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(path.join(SKILLS_ROOT, d.name, "SKILL.md")))
  .map((d) => d.name);

const bentoCards = (page: Page) => page.locator('#skills a[href^="/skills/"]');
const heroInstall = (page: Page) => page.locator("#install");

test.describe("Hero install", () => {
  test("switching to Shell shows the shell commands and copies a single line", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await heroInstall(page).getByRole("button", { name: INSTALL.shell.label }).click();
    await expect(heroInstall(page).getByText(INSTALL.shell.commands[0], { exact: true })).toBeVisible();

    await heroInstall(page).getByRole("button", { name: "Copy step 1" }).click();
    await expect(heroInstall(page).getByRole("status").first()).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(INSTALL.shell.commands[0]);
  });
});

test.describe("Catalog", () => {
  test("mirrors every skill folder in the repo", async ({ page }) => {
    await page.goto("/");
    await expect(bentoCards(page)).toHaveCount(SKILL_NAMES.length);
    await expect(page.getByRole("button", { name: /^All/ })).toContainText(String(SKILL_NAMES.length));
    const hrefs = await bentoCards(page).evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.toSorted()).toEqual(SKILL_NAMES.map((n) => `/skills/${n}`).toSorted());
  });

  test("filtering by Style shows only Style skills, matching the badge count", async ({ page }) => {
    await page.goto("/");
    const style = page.getByRole("button", { name: /^Style/ });
    const badge = Number(await style.locator("small").textContent());
    await style.click();

    await expect(style).toHaveAttribute("aria-pressed", "true");
    await expect(bentoCards(page)).toHaveCount(badge);
    const categories = await bentoCards(page).evaluateAll((els) => els.map((e) => e.getAttribute("data-category")));
    expect(new Set(categories)).toEqual(new Set(["style"]));
  });

  test("lists every skill in the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    SKILL_NAMES.forEach((name) => expect(xml).toContain(`/skills/${name}</loc>`));
  });
});

test.describe("Skill page", () => {
  test("opens from its card with the README rendered and a copyable command", async ({ page }) => {
    await page.goto("/");
    await bentoCards(page).filter({ hasText: "/onex:add-pwa" }).click();

    await expect(page).toHaveURL(/\/skills\/add-pwa$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("/onex:add-pwa");
    await expect(page.locator(".readme h2").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy /onex:add-pwa" })).toBeVisible();
    await expect(page).toHaveTitle(/\/onex:add-pwa/);
  });

  ["does-not-exist", "Bad_Name", "..%2F..%2Fetc%2Fpasswd"].forEach((slug) => {
    test(`returns 404 for /skills/${slug}`, async ({ page }) => {
      const response = await page.goto(`/skills/${slug}`);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { name: COPY.notFound.title })).toBeVisible();
    });
  });
});

test.describe("House rules", () => {
  ["/", "/skills/add-pwa", "/skills/rewrite"].forEach((route) => {
    test(`every new-tab link on ${route} carries the external-link icon`, async ({ page }) => {
      await page.goto(route);
      const links = page.locator('a[target="_blank"]');
      expect(await links.count()).toBeGreaterThan(0);
      const missing = await links.evaluateAll((els) =>
        els.filter((a) => !a.querySelector("svg.lucide-external-link")).map((a) => a.outerHTML.slice(0, 120)),
      );
      expect(missing).toEqual([]);
    });
  });

  test("respects reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`${test.info().project.use.baseURL}/`);
    const animation = await page.locator(".animate-tilt").evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
    await context.close();
  });
});

test.describe("Mobile", () => {
  test("has no horizontal scroll and stacks the bento in one column", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");
    const overflowOf = async (route: string) => {
      await page.goto(route);
      return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    };
    expect(await overflowOf("/"), "/").toBeLessThanOrEqual(0);
    expect(await overflowOf("/skills/setup-agent"), "/skills/setup-agent").toBeLessThanOrEqual(0);
    await page.goto("/");
    const lefts = await bentoCards(page).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
    expect(new Set(lefts).size).toBe(1);
  });
});
