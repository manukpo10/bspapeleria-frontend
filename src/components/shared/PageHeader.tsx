import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Crumb {
  label: string;
  /** Leave out on the last crumb: it is the current page */
  to?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      {/* One line always: the earlier crumbs keep their size and the last one (the current page) is the one that truncates */}
      <ol className="flex items-center text-sm text-dark/65">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className={cn('flex items-center', i === crumbs.length - 1 ? 'min-w-0' : 'shrink-0')}>
            {i > 0 && <ChevronRight className="mx-0.5 size-4 shrink-0 text-dark/40" aria-hidden="true" />}
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="inline-flex min-h-11 items-center rounded-lg px-1.5 transition-colors hover:text-iris lg:min-h-9"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                title={crumb.label}
                className="block min-w-0 truncate px-1.5 font-medium text-dark sm:max-w-md"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  crumbs: Crumb[];
  /** Line under the title, for example the result count */
  description?: ReactNode;
}

/** Slim header band shared by the store pages: breadcrumb, h1 and a short line under it */
export function PageHeader({ title, crumbs, description }: PageHeaderProps) {
  return (
    <div className="bg-ribbon-soft">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-2 sm:px-6 sm:pb-10 lg:px-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">{title}</h1>
        {description && (
          <p aria-live="polite" className="mt-2 text-sm text-dark/65">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
