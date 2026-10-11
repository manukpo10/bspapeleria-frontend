import { Send } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-ribbon">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-stars opacity-40" />
      <p className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium text-dark sm:text-sm">
        <Send className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
        Envío gratis en compras superiores a $15.000
      </p>
    </div>
  );
}
