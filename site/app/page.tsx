import Link from "next/link";
import { InstallBlock } from "@/components/install-block";
import { ProductShot } from "@/components/product-shot";
import { ReleasePill } from "@/components/release-pill";
import { SkillsBento } from "@/components/skills-bento";
import { StackRow } from "@/components/stack-row";
import { COPY } from "@/config/site";
import { countWord, fill } from "@/lib/format";
import { newSkillCount, toBentoSkill } from "@/lib/skills/catalog";
import { getCatalog, getPluginVersion } from "@/lib/skills/data";

export default async function HomePage() {
  const [skills, version] = await Promise.all([getCatalog(), getPluginVersion()]);

  return (
    <>
      <section className="hero-grid relative flex flex-col items-center gap-[22px] px-6 pt-[76px] text-center [&>*]:relative [&>*]:z-[1]">
        <ReleasePill version={version} newCount={newSkillCount(skills)} />
        <h1 className="text-gradient max-w-[15ch] font-display text-[clamp(40px,6.4vw,76px)] leading-none font-semibold tracking-[-0.04em] text-balance">
          {COPY.hero.headline}
        </h1>
        <p className="max-w-[54ch] text-lg text-muted">
          {fill(COPY.hero.lede, countWord(skills.length))}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Link href="#install" className="inline-flex h-9 items-center rounded-sm bg-fg px-3.5 text-sm font-medium text-bg transition-colors hover:bg-white">
            {COPY.hero.primaryCta}
          </Link>
          <Link href="#skills" className="inline-flex h-9 items-center rounded-sm bg-panel-3 px-3.5 text-sm font-medium transition-colors hover:bg-[#25262b]">
            {COPY.hero.secondaryCta}
          </Link>
        </div>
        <InstallBlock />
      </section>

      <ProductShot skills={skills} />
      <StackRow />

      <section id="skills" aria-labelledby="skills-heading" className="mx-auto max-w-[1040px] scroll-mt-20 px-6 pt-10 pb-[72px]">
        <div className="mb-5">
          <h2 id="skills-heading" className="font-display text-[32px] font-semibold tracking-[-0.035em]">
            {COPY.skills.heading}
          </h2>
          <p className="mt-1 text-[15px] text-muted">{fill(COPY.skills.subtitle, skills.length)}</p>
        </div>
        <SkillsBento skills={skills.map(toBentoSkill)} />
      </section>
    </>
  );
}
