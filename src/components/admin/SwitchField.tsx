import { cn } from '../../lib/utils';

interface SwitchFieldProps {
  label: string;
  /** Persistent help under the label */
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

/** Native checkbox exposed as a switch: the input stays in the tab order, the track is only the picture of it */
export function SwitchField({ label, description, checked, onChange, className }: SwitchFieldProps) {
  return (
    <label className={cn('flex min-h-11 cursor-pointer items-center justify-between gap-4', className)}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-dark">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-dark/65">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-sand ring-1 ring-inset ring-secondary/40 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-6 after:rounded-full after:bg-white after:shadow-soft after:transition-transform peer-checked:bg-dark peer-checked:ring-dark peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris"
      />
    </label>
  );
}
