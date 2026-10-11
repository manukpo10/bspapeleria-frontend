import { cn } from '../../lib/utils';

interface ProgressBarProps {
  /** Progress from 0 to 100 */
  value: number;
  /** Accessible name, for example "Progreso en Sublimación desde cero". Show the percentage as text next to it */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({ value, label, size = 'md', className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cn('w-full overflow-hidden rounded-full bg-sand/60', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
    >
      <div className="h-full rounded-full bg-iris transition-[width] duration-500" style={{ width: `${percent}%` }} />
    </div>
  );
}
