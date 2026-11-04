const WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
] as const;

/** Spelled-out count for prose ("Sixteen skills"); digits above twenty. */
export const countWord = (n: number): string => WORDS[n] ?? String(n);

/** Fills `{count}` in a COPY template. */
export const fill = (template: string, count: number | string): string => template.replaceAll("{count}", String(count));
