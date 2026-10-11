import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Package } from 'lucide-react';
import { api } from '../services/api';
import { EmptyState } from '../components/shared/EmptyState';
import { SectionHeading } from '../components/shared/SectionHeading';
import { StatusChip } from '../components/shared/StatusChip';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import type { Order } from '../types';

const listHeading = 'font-display text-xl font-semibold text-dark';

function Thumb({ src }: { src?: string }) {
  return src ? (
    <img src={src} alt="" width={56} height={56} loading="lazy" decoding="async" className="size-14 shrink-0 rounded-xl bg-sand/40 object-cover" />
  ) : (
    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ribbon text-dark/60">
      <Package className="size-6" aria-hidden="true" />
    </span>
  );
}

export default function DashboardProductsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const purchasedProducts = orders.flatMap((order) =>
    order.items
      .filter((item) => item.type === 'product')
      .map((item) => ({
        id: item.itemId,
        name: item.name,
        image: item.image,
        price: item.price,
        orderId: order.id,
        orderStatus: order.status,
      }))
  );

  const digitals = purchasedProducts.filter((p) => {
    const order = orders.find((o) => o.id === p.orderId);
    return order?.paymentStatus === 'approved' || order?.status === 'paid' || order?.status === 'delivered';
  });
  const physicals = purchasedProducts.filter((p) => {
    const order = orders.find((o) => o.id === p.orderId);
    return order?.status === 'delivered';
  });

  if (loading) {
    return (
      <div role="status" className="space-y-6">
        <span className="sr-only">Cargando tus productos…</span>
        <SectionHeading title="Mis productos" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-sand/40" />
          ))}
        </div>
      </div>
    );
  }

  const storeLink = <Link to="/productos" className="btn btn-secondary btn-sm min-h-11">Ver productos</Link>;

  return (
    <div className="animate-fade-in space-y-8">
      <SectionHeading title="Mis productos" />

      <section aria-labelledby="downloads-title" className="space-y-4">
        <h3 id="downloads-title" className={listHeading}>Descargables</h3>
        {digitals.length === 0 ? (
          <EmptyState compact as="h4" className="card" icon={Download} title="No tenés productos digitales." action={storeLink} />
        ) : (
          <ul className="card divide-y divide-sand/60 overflow-hidden">
            {digitals.map((p, i) => (
              <li key={`${p.id}-d-${i}`} className="flex items-center gap-4 p-4 sm:p-5">
                <Thumb src={p.image} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-dark">{p.name}</p>
                  <p className="mt-0.5 font-display text-sm font-bold text-dark">{formatPrice(p.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('Descarga iniciada')}
                  aria-label={`Descargar ${p.name}`}
                  className="btn btn-soft btn-sm min-h-11 shrink-0"
                >
                  <Download className="size-4" aria-hidden="true" /> Descargar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="physical-title" className="space-y-4">
        <h3 id="physical-title" className={listHeading}>Físicos</h3>
        {physicals.length === 0 ? (
          <EmptyState compact as="h4" className="card" icon={Package} title="No tenés productos físicos." action={storeLink} />
        ) : (
          <ul className="card divide-y divide-sand/60 overflow-hidden">
            {physicals.map((p, i) => (
              <li key={`${p.id}-p-${i}`} className="flex items-center gap-4 p-4 sm:p-5">
                <Thumb src={p.image} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-dark">{p.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-sm font-bold text-dark">{formatPrice(p.price)}</span>
                    <StatusChip status={p.orderStatus} />
                  </div>
                </div>
                <Link to="/mi-cuenta/pedidos" className="btn btn-ghost btn-sm min-h-11 shrink-0">
                  Ver pedido
                  <span className="sr-only">: {p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
