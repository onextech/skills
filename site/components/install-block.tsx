"use client";

import { useState } from "react";
import { INSTALL, INSTALL_MODES, type InstallMode } from "@/config/site";
import { cn } from "@/lib/cn";
import { CopyButton } from "./copy-button";

export function InstallBlock({ className }: { className?: string }) {
  const [mode, setMode] = useState<InstallMode>("claude");

  return (
    <div id="install" className={cn("w-full max-w-[560px] scroll-mt-24 overflow-hidden rounded-md bg-panel text-left", className)}>
      <div role="group" aria-label="Install method" className="flex gap-0.5 bg-panel-2 p-1.5">
        {INSTALL_MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={m === mode}
            onClick={() => setMode(m)}
            className="cursor-pointer rounded-[6px] px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg aria-pressed:bg-panel-3 aria-pressed:text-fg"
          >
            {INSTALL[m].label}
          </button>
        ))}
      </div>
      <ol>
        {INSTALL[mode].commands.map((command, i) => (
          <li
            key={command}
            data-testid="install-line"
            className="flex min-w-0 items-center gap-3 py-2 pr-2 pl-3.5 [&+&]:shadow-[inset_0_1px_0_var(--color-line)]"
          >
            <span className="shrink-0 font-mono text-xs text-dim">{i + 1}</span>
            <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">{command}</code>
            <CopyButton text={command} label={`Copy step ${i + 1}`} />
          </li>
        ))}
      </ol>
    </div>
  );
}
