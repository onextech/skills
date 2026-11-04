import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CachedReadme } from "@/components/cached-readme";
import { CopyButton } from "@/components/copy-button";
import { ExternalLink } from "@/components/external-link";
import { InstallBlock } from "@/components/install-block";
import { SkillIcon } from "@/components/skill-icon";
import { COPY, SITE } from "@/config/site";
import { CATEGORIES } from "@/config/skills";
import { fill } from "@/lib/format";
import { getCatalog, getSkill } from "@/lib/skills/data";

export async function generateStaticParams() {
  const skills = await getCatalog();
  return skills.map((s) => ({ name: s.name }));
}

export async function generateMetadata({ params }: PageProps<"/skills/[name]">): Promise<Metadata> {
  const { name } = await params;
  const skill = await getSkill(name);
  if (!skill) return { title: "Skill not found" };
  return {
    title: skill.invoke,
    description: skill.tagline,
    alternates: { canonical: `/skills/${skill.name}` },
    openGraph: { title: `${skill.invoke} · ${SITE.name}`, description: skill.tagline },
  };
}

export default async function SkillPage({ params }: PageProps<"/skills/[name]">) {
  const { name } = await params;
  const [skill, catalog] = await Promise.all([getSkill(name), getCatalog()]);
  if (!skill) notFound();

  const category = CATEGORIES.find((c) => c.id === skill.category)!;
  const related = catalog.filter((s) => s.category === skill.category && s.name !== skill.name);
  const index = catalog.findIndex((s) => s.name === skill.name);
  const [prev, next] = [catalog[index - 1], catalog[index + 1]];

  return (
    <article>
      <header className="hero-grid relative px-6 pt-14 pb-10 [&>*]:relative [&>*]:z-[1]">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-5">
          <nav aria-label="Breadcrumb" className="text-[13px] text-dim">
            <Link href="/#skills" className="transition-colors hover:text-fg">
              Skills
            </Link>{" "}
            / <span className="text-muted">{category.label}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid size-11 place-items-center rounded-[11px] bg-panel-3">
              <SkillIcon icon={skill.icon} className="size-5" />
            </span>
            <h1 className="min-w-0 font-mono text-[clamp(24px,4vw,36px)] font-medium tracking-tight break-all">{skill.invoke}</h1>
            {skill.isNew && (
              <span className="rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[11px] font-medium text-brand">New</span>
            )}
          </div>
          <p className="max-w-[60ch] text-lg text-muted">{skill.tagline}</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-md bg-panel py-1.5 pr-1.5 pl-3.5">
              <code className="font-mono text-[13.5px]">
                <span className="text-brand">/onex:</span>
                {skill.name}
              </code>
              <CopyButton text={skill.invoke} label={`Copy ${skill.invoke}`} />
            </div>
            <ExternalLink
              href={`${SITE.repoUrl}/tree/${SITE.repoBranch}/skills/${skill.name}`}
              className="text-[13.5px] text-muted transition-colors hover:text-fg"
            >
              {COPY.skillPage.source}
            </ExternalLink>
          </div>
        </div>
      </header>

      <div className="px-6">
      <div className="mx-auto grid max-w-[1040px] gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="readme max-w-[72ch]">
          {skill.readme ? (
            <CachedReadme source={skill.readme} skillName={skill.name} />
          ) : (
            <p>{skill.description}</p>
          )}
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
          <section aria-labelledby="install-heading" className="flex flex-col gap-3">
            <h2 id="install-heading" className="text-[13px] font-medium text-muted">
              {COPY.skillPage.install}
            </h2>
            <InstallBlock />
          </section>
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="flex flex-col gap-1">
              <h2 id="related-heading" className="mb-2 text-[13px] font-medium text-muted">
                {fill(COPY.skillPage.related, category.label.toLowerCase())}
              </h2>
              {related.map((s) => (
                <Link
                  key={s.name}
                  href={`/skills/${s.name}`}
                  className="-mx-2 flex items-center gap-2.5 rounded-sm px-2 py-1.5 font-mono text-[13px] text-muted transition-colors hover:bg-panel-2 hover:text-fg"
                >
                  <SkillIcon icon={s.icon} className="size-3.5" />
                  {s.name}
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>
      </div>

      <div className="px-6">
      <nav aria-label="Other skills" className="mx-auto grid max-w-[1040px] gap-3 pb-20 sm:grid-cols-2">
        {prev ? (
          <Link href={`/skills/${prev.name}`} className="flex flex-col gap-1 rounded-md bg-panel p-5 transition-colors hover:bg-panel-2">
            <span className="text-xs text-dim">← Previous</span>
            <code className="font-mono text-sm">{prev.invoke}</code>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/skills/${next.name}`} className="flex flex-col gap-1 rounded-md bg-panel p-5 text-right transition-colors hover:bg-panel-2">
            <span className="text-xs text-dim">Next →</span>
            <code className="font-mono text-sm">{next.invoke}</code>
          </Link>
        )}
      </nav>
      </div>
    </article>
  );
}
