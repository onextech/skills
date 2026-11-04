import path from "node:path";
import { SITE } from "@/config/site";

export const CODE_THEME = "github-dark-default";

const LEADING_H1 = /^\s*#\s[^\n]*\n*/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export const stripLeadingH1 = (source: string): string => source.replace(LEADING_H1, "");

/** Resolve a link written in a skill README for display on the site. */
export const resolveReadmeHref = (href: string, skillName: string): { href: string; external: boolean } => {
  if (!href || href.startsWith("#")) return { href, external: false };
  if (/^mailto:/i.test(href)) return { href, external: false };
  if (SCHEME.test(href)) return { href, external: true };
  const repoPath = path.posix.normalize(path.posix.join("skills", skillName, href));
  const escapesRepo = repoPath === "." || repoPath.startsWith("../") || repoPath === "..";
  return {
    href: escapesRepo ? SITE.repoUrl : `${SITE.repoUrl}/blob/${SITE.repoBranch}/${encodeURI(repoPath)}`,
    external: true,
  };
};
