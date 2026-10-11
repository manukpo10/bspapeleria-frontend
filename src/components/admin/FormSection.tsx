import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface FormSectionProps {
  title: string;
  /** One line under the title */
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A card of a builder or settings form: h2, optional line of help and the fields spaced evenly */
export function FormSection({ title, description, className, children }: FormSectionProps) {
  const id = useId();

  return (
    <section aria-labelledby={id} className={cn('card p-6 sm:p-8', className)}>
      <h2 id={id} className="font-display text-xl font-semibold text-dark">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-dark/65">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}
