import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
 * Table of an admin list. It only exists from md: below that every page renders the same rows as stacked cards,
 * so the page never scrolls sideways. The caption names the table for screen readers.
 */
export function AdminTable({ caption, children, className }: { caption: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('card hidden overflow-hidden md:block', className)}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

/** Header row on the tinted background. Put `Th` cells inside */
export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-mist">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, align = 'left', className }: { children: ReactNode; align?: 'left' | 'right'; className?: string }) {
  return (
    <th scope="col" className={cn('px-4 py-3 text-xs font-semibold text-dark/75', align === 'right' && 'text-right', className)}>
      {children}
    </th>
  );
}

export function TRow({ children }: { children: ReactNode }) {
  return <tr className="border-t border-sand/60 transition-colors hover:bg-mist/60">{children}</tr>;
}

export function Td({ children, align = 'left', className }: { children?: ReactNode; align?: 'left' | 'right'; className?: string }) {
  return <td className={cn('px-4 py-3 align-middle', align === 'right' && 'text-right', className)}>{children}</td>;
}
