import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl, siteUrl } from "./site-url";

afterEach(() => vi.unstubAllEnvs());

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and drops a trailing slash", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://skills.example.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }).href).toBe(
      "https://skills.example.com/",
    );
  });

  it("falls back to the Vercel production host over https", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "onex-skills.vercel.app" }).href).toBe("https://onex-skills.vercel.app/");
  });

  it("falls back to localhost in development", () => {
    expect(resolveSiteUrl({}).href).toBe("http://localhost:3000/");
  });

  it("siteUrl() reads the real environment variables", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://skills.onex.test");
    expect(siteUrl().href).toBe("https://skills.onex.test/");
  });

  it("ignores an invalid NEXT_PUBLIC_SITE_URL instead of crashing the build", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url" }).href).toBe("http://localhost:3000/");
  });
});
