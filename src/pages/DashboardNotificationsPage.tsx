import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';
import type { Notification } from '../types';
import { toast } from 'sonner';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-dark">Notificaciones</h1>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 rounded-xl bg-sand/50 px-4 py-2 text-sm font-medium text-dark hover:bg-sand transition-colors"
        >
          <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-sand/20 border border-sand/50">
          <Bell className="w-12 h-12 text-dark/20 mx-auto mb-3" />
          <p className="text-dark/60">No tenés notificaciones.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-2xl border p-4 flex items-start gap-3 ${n.read ? 'bg-white border-sand/30' : 'bg-primary/5 border-primary/20'}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${n.read ? 'bg-dark/20' : 'bg-primary'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-dark">{n.title}</p>
                <p className="text-sm text-dark/60">{n.message}</p>
                <p className="text-xs text-dark/40 mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="p-2 rounded-full hover:bg-sand/50 transition-colors"
                >
                  <Check className="w-4 h-4 text-dark/40" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
