type UrlEnv = { NEXT_PUBLIC_SITE_URL?: string; VERCEL_PROJECT_PRODUCTION_URL?: string };

const DEV_URL = "http://localhost:3000";

const tryUrl = (value: string | undefined): URL | null => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

/** Canonical site URL for metadata, sitemap and OG links. */
export const resolveSiteUrl = (env: UrlEnv): URL =>
  tryUrl(env.NEXT_PUBLIC_SITE_URL) ??
  tryUrl(env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  new URL(DEV_URL);

export const siteUrl = (): URL =>
  resolveSiteUrl({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  });
