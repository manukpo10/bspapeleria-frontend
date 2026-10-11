import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  /** Decorative icon inside the field, on the left */
  icon?: LucideIcon;
  /** Shows the asterisk and aria-required. It does not add the native `required`, so the form keeps its own validation */
  required?: boolean;
  /** Persistent help under the field */
  hint?: string;
  /** Error under the field; also marks the field as invalid */
  error?: string;
  /** Renders a textarea instead of an input */
  multiline?: boolean;
  rows?: number;
  className?: string;
}

/** Labelled `field` input (or textarea) with hint and error text wired through aria-describedby */
export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  icon: Icon,
  required = false,
  hint,
  error,
  multiline = false,
  rows = 4,
  className,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    'aria-required': required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  } as const;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
        {label}
        {required && (
          <span aria-hidden="true" className="text-rose-700">
            {' '}*
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="field min-h-28 resize-y aria-invalid:border-rose-600"
        />
      ) : (
        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-dark/55" aria-hidden="true" />
          )}
          <input
            {...shared}
            type={type}
            inputMode={type === 'tel' ? 'tel' : undefined}
            onChange={(e) => onChange(e.target.value)}
            className={cn('field aria-invalid:border-rose-600', Icon && 'pl-11')}
          />
        </div>
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-dark/65">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
