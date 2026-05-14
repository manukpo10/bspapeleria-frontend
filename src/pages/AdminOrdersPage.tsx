import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../lib/utils';
import type { Order } from '../types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-white">Pedidos</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-left p-4 font-medium">Orden</th>
                <th className="text-left p-4 font-medium">Cliente</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Estado</th>
                <th className="text-left p-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-white/80">{order.orderNumber}</td>
                  <td className="p-4 text-white/60">{order.userId}</td>
                  <td className="p-4 text-white/80">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="bg-transparent text-white/80 text-xs border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="pending" className="bg-dark">Pendiente</option>
                      <option value="paid" className="bg-dark">Pagado</option>
                      <option value="shipped" className="bg-dark">Enviado</option>
                      <option value="delivered" className="bg-dark">Entregado</option>
                      <option value="cancelled" className="bg-dark">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4 text-white/40 text-xs">{formatDate(order.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
