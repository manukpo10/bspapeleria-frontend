import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, GraduationCap, Info, Megaphone, Package, type LucideIcon } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { EmptyState } from '../components/shared/EmptyState';
import { SectionHeading } from '../components/shared/SectionHeading';
import { cn, formatDate } from '../lib/utils';
import type { Notification } from '../types';
import { toast } from 'sonner';

const typeIcon: Record<Notification['type'], LucideIcon> = {
  order: Package,
  course: GraduationCap,
  announcement: Megaphone,
  system: Info,
};

export default function DashboardNotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    api.getNotifications(user.id).then(setNotifications);
  }, [user]);

  const markRead = async (id: string) => {
    await api.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user) return;
    await api.markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('Todas las notificaciones fueron marcadas como leídas');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading
        title="Notificaciones"
        action={
          <button type="button" onClick={markAllRead} className="btn btn-ghost btn-sm min-h-11">
            <CheckCheck className="size-4" aria-hidden="true" /> Marcar todas como leídas
          </button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState className="card" icon={Bell} title="No tenés notificaciones.">
          Te avisamos acá cuando haya novedades de tus pedidos o tus cursos.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const Icon = typeIcon[n.type] ?? Bell;
            return (
              <li key={n.id}>
                <article className="card flex items-start gap-4 p-4 sm:p-5">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
                    <Icon className="size-5" aria-hidden="true" />
                    {!n.read && (
                      <span aria-hidden="true" className="absolute -right-1 -top-1 size-3 rounded-full bg-iris ring-2 ring-white" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className={cn('text-dark', n.read ? 'font-medium' : 'font-bold')}>
                      {n.title}
                      {!n.read && <span className="sr-only"> (sin leer)</span>}
                    </h3>
                    <p className="mt-0.5 text-sm text-dark/75">{n.message}</p>
                    <p className="mt-1.5 text-xs text-dark/65">
                      <time dateTime={n.createdAt}>{formatDate(n.createdAt)}</time>
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      aria-label={`Marcar como leída: ${n.title}`}
                      className="btn btn-ghost btn-sm min-h-11 shrink-0 max-sm:size-11 max-sm:p-0"
                    >
                      <Check className="size-4" aria-hidden="true" />
                      <span className="max-sm:sr-only">Marcar como leída</span>
                    </button>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
