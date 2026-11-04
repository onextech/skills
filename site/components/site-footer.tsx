import { SITE } from "@/config/site";
import { ExternalLink } from "./external-link";
import { Logo } from "./logo";

export function SiteFooter({ version }: { version: string }) {
  return (
    <footer className="shadow-[inset_0_1px_0_var(--color-line)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-[13px] text-dim sm:px-7">
        <span className="flex items-center gap-2">
          <Logo className="size-4" />
          {SITE.name} · v{version} · MIT
        </span>
        <span className="flex gap-5">
          <ExternalLink href={SITE.repoUrl} className="transition-colors hover:text-fg">
            Source
          </ExternalLink>
          <ExternalLink href={`${SITE.repoUrl}/commits/${SITE.repoBranch}`} className="transition-colors hover:text-fg">
            Changelog
          </ExternalLink>
        </span>
      </div>
    </footer>
  );
}
