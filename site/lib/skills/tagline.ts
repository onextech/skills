/** Pure string logic, safe to bundle for the client (no gray-matter). */
export const TAGLINE_MAX = 140;

const SENTENCE_END = /[.!?](?=\s|$)/;
const CLAUSE_BREAK = /\s[—–]\s/;
const TRIGGER_CLAUSE = /use when/i;
const TRAILING_JUNK = /[\s,;:—–-]+$/;
const TERMINAL = /[.!?…]$/;
const ELLIPSIS = "…";

const indexOrEnd = (text: string, pattern: RegExp, offset = 0): number => {
  const match = pattern.exec(text);
  return match ? match.index + offset : text.length;
};

const finish = (segment: string): string => {
  const trimmed = segment.replace(TRAILING_JUNK, "");
  if (!trimmed) return "";
  return TERMINAL.test(trimmed) ? trimmed : `${trimmed}.`;
};

const truncate = (segment: string, max: number): string => {
  const cut = segment.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const atWord = lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut;
  const trimmed = atWord.replace(TRAILING_JUNK, "");
  return trimmed ? `${trimmed}${ELLIPSIS}` : "";
};

/**
 * A short card tagline from a SKILL.md description: the first sentence or clause,
 * before any "Use when…" trigger text, capped at `max` characters.
 */
export const deriveTagline = (description: string, max: number = TAGLINE_MAX): string => {
  const text = description.replace(/\s+/g, " ").trim();
  const end = Math.min(
    indexOrEnd(text, SENTENCE_END, 1),
    indexOrEnd(text, CLAUSE_BREAK),
    indexOrEnd(text, TRIGGER_CLAUSE),
  );
  const segment = text.slice(0, end);
  const finished = finish(segment);
  return finished.length <= max ? finished : truncate(segment, max);
};
