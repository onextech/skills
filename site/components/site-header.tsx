import Link from "next/link";
import { NAV, SITE } from "@/config/site";
import { ExternalLink } from "./external-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 shadow-[inset_0_-1px_0_var(--color-line)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-7 px-4 sm:px-7">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold">
          <Logo className="size-[18px]" />
          {SITE.shortName}
        </Link>
        <nav aria-label="Main" className="hidden gap-6 text-[13.5px] text-muted sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-[13.5px]">
          <ExternalLink href={SITE.repoUrl} className="hidden text-muted transition-colors hover:text-fg sm:inline-flex">
            GitHub
          </ExternalLink>
          <Link
            href="/#install"
            className="inline-flex h-[30px] items-center rounded-sm bg-fg px-3.5 text-[13px] font-medium text-bg transition-colors hover:bg-white"
          >
            Install
          </Link>
        </div>
      </div>
    </header>
  );
}
