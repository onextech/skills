import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Every new-tab link carries a trailing external-link icon (house rule). */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1", className)}>
      {children}
      <ExternalLinkIcon aria-hidden className="size-3.5 shrink-0" />
    </a>
  );
}
