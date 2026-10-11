import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  /** One sentence under the title */
  children?: ReactNode;
  /** Usually a `btn btn-secondary` link to the store or the courses */
  action?: ReactNode;
  /** Tighter version for the inside of a card */
  compact?: boolean;
  /** Heading level of the title: one below the heading of the block it sits in */
  as?: 'h3' | 'h4';
  className?: string;
}

/** Icon tile, a title, one sentence and an optional action. The title is an h3 by default: the page owns the h2 above it */
export function EmptyState({ icon: Icon, title, children, action, compact = false, as: Heading = 'h3', className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', compact ? 'px-2 py-6' : 'px-4 py-12 sm:py-16', className)}>
      <span className={cn('grid place-items-center rounded-full bg-mist text-iris', compact ? 'size-14' : 'size-20')}>
        <Icon className={compact ? 'size-6' : 'size-9'} aria-hidden="true" />
      </span>
      <Heading className={cn('font-display font-semibold text-dark', compact ? 'mt-4 text-base' : 'mt-6 text-xl')}>{title}</Heading>
      {children && <p className="mt-2 max-w-sm text-dark/75">{children}</p>}
      {action && <div className={compact ? 'mt-4' : 'mt-6'}>{action}</div>}
    </div>
  );
}
