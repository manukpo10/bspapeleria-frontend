import { Send } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-ribbon">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-40" />
      <p className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium text-dark sm:text-sm">
        <Send className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
        {/* Wrapped so the balancing applies to the text itself: on phones it breaks into two even lines */}
        <span className="text-balance">Cursos online con acceso de por vida y acompañamiento personalizado</span>
      </p>
    </div>
  );
}
