import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatPrice, formatDate } from '../lib/utils';
import { courses } from '../data/mocks';
import type { Order } from '../types';

export default function DashboardOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    api.getMyOrders(user.id).then(setOrders);
  }, [user]);

  const statusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'paid': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'shipped': return <Truck className="w-4 h-4 text-primary" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'cancelled': return <Clock className="w-4 h-4 text-error" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-dark">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-sand/20 border border-sand/50">
          <Package className="w-12 h-12 text-dark/20 mx-auto mb-3" />
          <p className="text-dark/60">No tenés pedidos aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-sand/50 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-dark/40" />
                  <span className="font-medium text-dark text-sm">{order.orderNumber}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {statusIcon(order.status)}
                  <span className="capitalize text-dark/60">{order.status}</span>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                {order.items.map((item) => {
                  const courseSlug = item.type === 'course'
                    ? courses.find((c) => c.id === item.itemId)?.slug
                    : undefined;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark truncate">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {courseSlug && (
                          <Link
                            to={`/cursos/${courseSlug}/aprender`}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" /> Ir al curso
                          </Link>
                        )}
                        <span className="text-sm text-dark/60">x{item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-sand/30">
                <span className="text-xs text-dark/50">{formatDate(order.createdAt)}</span>
                <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
