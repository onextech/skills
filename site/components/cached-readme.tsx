import { cacheLife } from "next/cache";
import { SkillMarkdown } from "./skill-markdown";

/** Shiki highlighting is async work; caching it keeps the route fully static. */
export async function CachedReadme({ source, skillName }: { source: string; skillName: string }) {
  "use cache";
  cacheLife("max");
  return <SkillMarkdown source={source} skillName={skillName} />;
}
