import { CircleCheck, CircleX, Clock, PackageCheck, Truck, type LucideIcon } from 'lucide-react';
import type { OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

// Pastel status fills with ink text; the label and the icon carry the meaning, never the colour alone
const STATUS: Record<OrderStatus, { label: string; icon: LucideIcon; tone: string }> = {
  pending: { label: 'Pendiente', icon: Clock, tone: 'bg-warning/50' },
  paid: { label: 'Pagado', icon: CircleCheck, tone: 'bg-success/40' },
  shipped: { label: 'Enviado', icon: Truck, tone: 'bg-cream/60' },
  delivered: { label: 'Entregado', icon: PackageCheck, tone: 'bg-success/40' },
  cancelled: { label: 'Cancelado', icon: CircleX, tone: 'bg-error/40' },
};

export function StatusChip({ status, className }: { status: OrderStatus; className?: string }) {
  // The backend can send a state this table does not know yet: show it as it comes
  const meta = STATUS[status] ?? { label: status, icon: Clock, tone: 'bg-sand/50' };
  const Icon = meta.icon;

  return (
    <span className={cn('chip text-dark', meta.tone, className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
