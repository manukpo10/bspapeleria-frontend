import { Ban, CalendarX, CircleCheck, CircleSlash, type LucideIcon } from 'lucide-react';
import type { Coupon } from '../../types';
import { cn } from '../../lib/utils';

type CouponStatus = 'active' | 'inactive' | 'expired' | 'exhausted';

// Pastel fills with ink text; the label and the icon carry the meaning, never the colour alone
const STATUS: Record<CouponStatus, { label: string; icon: LucideIcon; tone: string }> = {
  active: { label: 'Activo', icon: CircleCheck, tone: 'bg-success/40' },
  inactive: { label: 'Inactivo', icon: Ban, tone: 'bg-sand/60' },
  expired: { label: 'Vencido', icon: CalendarX, tone: 'bg-error/40' },
  exhausted: { label: 'Agotado', icon: CircleSlash, tone: 'bg-warning/50' },
};

// An admin who switched the coupon off sees "Inactivo" first, so the toggle beside it says the same thing
function statusOf(coupon: Coupon): CouponStatus {
  if (!coupon.active) return 'inactive';
  if (coupon.validUntil && new Date(coupon.validUntil).getTime() < Date.now()) return 'expired';
  if (coupon.usedCount >= coupon.maxUses) return 'exhausted';
  return 'active';
}

export function CouponStatusChip({ coupon, className }: { coupon: Coupon; className?: string }) {
  const meta = STATUS[statusOf(coupon)];
  const Icon = meta.icon;

  return (
    <span className={cn('chip text-dark', meta.tone, className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
