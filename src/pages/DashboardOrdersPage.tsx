import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { EmptyState } from '../components/shared/EmptyState';
import { SectionHeading } from '../components/shared/SectionHeading';
import { StatusChip } from '../components/shared/StatusChip';
import { formatPrice, formatDate } from '../lib/utils';
import { courses } from '../data/mocks';
import type { Order } from '../types';

export default function DashboardOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    api.getMyOrders().then(setOrders);
  }, [user]);

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading title="Mis pedidos" />

      {orders.length === 0 ? (
        <EmptyState
          className="card"
          icon={ShoppingBag}
          title="No tenés pedidos aún."
          action={<Link to="/productos" className="btn btn-secondary">Ver productos</Link>}
        >
          Cuando compres algo, vas a ver acá el estado de tu pedido.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <article aria-labelledby={`order-${order.id}`} className="card p-5 sm:p-6">
                <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <h3 id={`order-${order.id}`} className="font-display text-lg font-semibold text-dark">
                      Pedido #{order.orderNumber}
                    </h3>
                    <p className="mt-0.5 text-sm text-dark/65">
                      <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                    </p>
                  </div>
                  <StatusChip status={order.status} />
                </header>

                <ul className="mt-5 divide-y divide-sand/60 border-t border-sand/60">
                  {order.items.map((item) => {
                    const courseSlug = item.type === 'course'
                      ? courses.find((c) => c.id === item.itemId)?.slug
                      : undefined;
                    return (
                      <li key={item.id} className="flex items-center gap-4 py-3">
                        <img
                          src={item.image}
                          alt=""
                          width={56}
                          height={56}
                          loading="lazy"
                          decoding="async"
                          className="size-14 shrink-0 rounded-xl bg-sand/40 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-dark">{item.name}</p>
                          <p className="mt-0.5 text-sm text-dark/65">
                            <span className="sr-only">Cantidad: </span>x{item.quantity}
                          </p>
                          {courseSlug && (
                            <Link to={`/cursos/${courseSlug}/aprender`} className="btn btn-soft btn-sm mt-2 min-h-11">
                              <BookOpen className="size-4" aria-hidden="true" /> Ir al curso
                              <span className="sr-only">: {item.name}</span>
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex items-baseline justify-between gap-4 border-t border-sand/60 pt-4">
                  <span className="text-sm text-dark/65">Total</span>
                  <span className="font-display text-xl font-bold text-dark">{formatPrice(order.total)}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
