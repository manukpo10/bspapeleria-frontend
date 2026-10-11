import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  script?: string;
  centered?: boolean;
  /** A centred header that left-aligns from the lg breakpoint up, for when it sits beside an image */
  startFromLg?: boolean;
  /** Optional slot on the right of a left-aligned header (e.g. slider arrows) */
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, script, centered = true, startFromLg = false, action }: SectionHeaderProps) {
  const leftOnLg = centered && startFromLg;

  return (
    <div
      className={cn(
        'mb-10 sm:mb-12',
        centered ? 'text-center' : 'flex items-end justify-between gap-6',
        leftOnLg && 'lg:text-left',
      )}
    >
      <div className={cn(!centered && 'min-w-0')}>
        {script && <p className="mb-1 font-script text-2xl text-iris">{script}</p>}
        <h2 className="font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">{title}</h2>
        {subtitle && (
          <p className={cn('mt-3 max-w-2xl text-dark/65', centered && 'mx-auto', leftOnLg && 'lg:mx-0')}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
