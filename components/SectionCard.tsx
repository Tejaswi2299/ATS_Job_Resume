import { PropsWithChildren } from "react";

export function SectionCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  );
}
