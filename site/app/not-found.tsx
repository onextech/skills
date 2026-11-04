import Link from "next/link";
import { COPY } from "@/config/site";

export default function NotFound() {
  return (
    <section className="hero-grid relative flex flex-col items-center gap-5 px-6 py-32 text-center [&>*]:relative [&>*]:z-[1]">
      <p className="font-mono text-sm text-dim">{COPY.notFound.eyebrow}</p>
      <h1 className="text-gradient font-display text-5xl font-semibold tracking-[-0.04em]">{COPY.notFound.title}</h1>
      <p className="max-w-[44ch] text-muted">{COPY.notFound.body}</p>
      <Link href="/#skills" className="inline-flex h-9 items-center rounded-sm bg-fg px-3.5 text-sm font-medium text-bg transition-colors hover:bg-white">
        {COPY.notFound.cta}
      </Link>
    </section>
  );
}
