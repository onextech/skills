import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/skills/data";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const skills = await getCatalog();
  return [
    { url: new URL("/", base).href, changeFrequency: "weekly", priority: 1 },
    ...skills.map((s) => ({ url: new URL(`/skills/${s.name}`, base).href, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
