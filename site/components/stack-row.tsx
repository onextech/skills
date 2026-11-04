import { COPY, STACK } from "@/config/site";

export function StackRow() {
  return (
    <section aria-label="Supported stack" className="mx-auto flex max-w-[1040px] flex-col items-center gap-3.5 px-6 pt-9 pb-2">
      <p className="text-[13px] text-dim">{COPY.stack}</p>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2.5 font-display text-base font-semibold tracking-tight text-muted">
        {STACK.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
