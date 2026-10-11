/** Placeholder rows while a list loads. The status text is what a screen reader hears; the grey shapes are decoration */
export function ListSkeleton({ rows = 5, label = 'Cargando...' }: { rows?: number; label?: string }) {
  return (
    <div role="status" className="card divide-y divide-sand/60 overflow-hidden">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} aria-hidden="true" className="flex animate-pulse items-center gap-4 p-4 sm:px-5">
          <div className="size-12 shrink-0 rounded-xl bg-sand/50" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded-full bg-sand/50" />
            <div className="h-3 w-1/4 rounded-full bg-sand/40" />
          </div>
          <div className="hidden h-4 w-20 rounded-full bg-sand/50 sm:block" />
        </div>
      ))}
    </div>
  );
}
