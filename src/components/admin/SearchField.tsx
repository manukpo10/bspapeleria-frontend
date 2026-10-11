import { useId } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchFieldProps {
  /** Accessible name. The field has no visible label: the icon and the placeholder say what it does */
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** `field` input with a leading magnifier, for the toolbar of a list */
export function SearchField({ label, value, onChange, placeholder, className }: SearchFieldProps) {
  const id = useId();

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-dark/55" aria-hidden="true" />
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field pl-11"
      />
    </div>
  );
}
