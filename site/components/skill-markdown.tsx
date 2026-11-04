import rehypeShiki from "@shikijs/rehype";
import type { ComponentProps } from "react";
import { MarkdownAsync } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CODE_THEME, resolveReadmeHref, stripLeadingH1 } from "@/lib/markdown";
import { ExternalLink } from "./external-link";

const readmeLink = (skillName: string) =>
  function ReadmeLink({ href = "", children }: ComponentProps<"a">) {
    const resolved = resolveReadmeHref(href, skillName);
    return resolved.external ? (
      <ExternalLink href={resolved.href}>{children}</ExternalLink>
    ) : (
      <a href={resolved.href}>{children}</a>
    );
  };

/** Renders a skill README on the server. Raw HTML is never rendered. */
export async function SkillMarkdown({ source, skillName }: { source: string; skillName: string }) {
  return MarkdownAsync({
    children: stripLeadingH1(source),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: CODE_THEME }]],
    components: { a: readmeLink(skillName) },
  });
}
