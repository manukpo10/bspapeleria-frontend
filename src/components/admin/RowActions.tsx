import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type Tone = 'default' | 'danger';

// Round icon-only control with a 44px hit area. Edit is ink, delete is rose, never the colour alone: the label says it
const base =
  'inline-grid size-11 shrink-0 place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50';
const tones: Record<Tone, string> = {
  default: 'text-dark hover:bg-sand/40',
  danger: 'text-rose-700 hover:bg-rose-50',
};

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** What the button does, for example "Eliminar producto Taza". Also shown as the tooltip */
  label: string;
  icon: LucideIcon;
  tone?: Tone;
}

export function IconButton({ label, icon: Icon, tone = 'default', className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cn(base, tones[tone], className)} {...props}>
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

interface IconLinkProps {
  label: string;
  icon: LucideIcon;
  to: string;
  tone?: Tone;
  className?: string;
}

export function IconLink({ label, icon: Icon, to, tone = 'default', className }: IconLinkProps) {
  return (
    <Link to={to} aria-label={label} title={label} className={cn(base, tones[tone], className)}>
      <Icon className="size-5" aria-hidden="true" />
    </Link>
  );
}
