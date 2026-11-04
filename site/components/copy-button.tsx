"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const RESET_MS = 1500;
const COPIED = "Copied";
const FAILED = "Copy failed. Select the text to copy it.";

/** Old browsers and locked-down webviews refuse the async clipboard; fall back to a selection copy. */
const selectionCopy = (text: string): boolean => {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
};

const clipboardCopy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), RESET_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    const ok = (await clipboardCopy(text)) || selectionCopy(text);
    setStatus(ok ? COPIED : FAILED);
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={copy}
        className={cn(
          "grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-sm text-dim transition-colors hover:bg-panel-3 hover:text-fg",
          className,
        )}
      >
        {status === COPIED ? <Check aria-hidden className="size-[15px] text-ok" /> : <Copy aria-hidden className="size-[15px]" />}
      </button>
      <span role="status" className="sr-only">
        {status}
      </span>
    </>
  );
}
