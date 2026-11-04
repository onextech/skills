import Link from "next/link";

export function ReleasePill({ version, newCount }: { version: string; newCount: number }) {
  const short = `v${version.split(".").slice(0, 2).join(".")}`;
  const text = newCount === 0 ? "All skills" : `${newCount} new skill${newCount === 1 ? "" : "s"}`;
  return (
    <Link
      href="/#skills"
      className="inline-flex items-center gap-2 rounded-full bg-panel-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-fg"
    >
      <b className="font-medium text-fg">{short}</b>
      {text} →
    </Link>
  );
}
