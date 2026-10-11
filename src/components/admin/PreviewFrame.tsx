import { useId, type ReactNode } from 'react';

interface PreviewFrameProps {
  /** One line under the title saying what the preview is */
  note: string;
  children: ReactNode;
}

/*
 * Shows a storefront card with the data of the draft. The card is the real one, so it is made `inert`: nothing in it
 * can be focused or pressed, which keeps "Agregar al carrito" and the product links from acting on an unsaved draft.
 */
export function PreviewFrame({ note, children }: PreviewFrameProps) {
  const id = useId();

  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-lg font-semibold text-dark">
        Vista previa
      </h2>
      <p className="mt-1 text-xs text-dark/65">{note}</p>
      <div inert className="mt-4 select-none">
        {children}
      </div>
    </section>
  );
}
