import { useId, type ReactNode } from 'react';

interface Control {
  id: string;
  'aria-describedby'?: string;
  'aria-required'?: true;
}

interface FormFieldProps {
  label: string;
  /** Persistent help under the control */
  hint?: ReactNode;
  /** Shows the asterisk and aria-required. It does not add the native `required`: the page keeps its own validation */
  required?: boolean;
  className?: string;
  /** Receives the id and aria attributes to spread on the input, select or textarea, so the label is really attached to it */
  children: (control: Control) => ReactNode;
}

/** Visible label + hint around a `field` control. The control stays in the page, so its value and handlers do not change */
export function FormField({ label, hint, required = false, className, children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

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
      {children({ id, 'aria-describedby': hintId, 'aria-required': required ? true : undefined })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-dark/65">
          {hint}
        </p>
      )}
    </div>
  );
}
