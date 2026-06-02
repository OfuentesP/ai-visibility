export function FaqAccordionServer({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-800/60">
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="w-full flex items-start gap-5 py-5 cursor-pointer list-none">
            <span className="text-xs sm:text-[11px] font-mono text-slate-400 pt-0.5 w-5 shrink-0 select-none">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex-1 text-sm font-medium text-slate-300 group-open:text-slate-100 leading-snug">
              {item.q}
            </span>
            <span className="text-slate-400 text-xs font-mono shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45 group-open:text-indigo-400">
              +
            </span>
          </summary>
          <div className="flex gap-5 pb-5">
            <span className="w-5 shrink-0" />
            <p className="text-slate-400 text-[13px] leading-relaxed border-l-2 border-indigo-900/60 pl-4">
              {item.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  )
}
