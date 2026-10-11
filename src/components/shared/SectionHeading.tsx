import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  /** Line under the title */
  description?: ReactNode;
  /** Button or link aligned to the right (wraps under the title on small screens) */
  action?: ReactNode;
}

/** h2 of a page inside the account area: the h1 lives in the greeting band of the layout */
export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold tracking-tight text-dark">{title}</h2>
        {description && <p className="mt-1 text-sm text-dark/65">{description}</p>}
      </div>
      {action}
    </div>
  );
}
