import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import type { Order } from '../types';

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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-dark">Mis Productos</h1>

      <div className="space-y-6">
        <div>
          <h3 className="font-display font-medium text-dark mb-3">Descargables</h3>
          {digitals.length === 0 ? (
            <p className="text-sm text-dark/60">No tenés productos digitales.</p>
          ) : (
            <div className="space-y-2">
              {digitals.map((p, i) => (
                <div key={`${p.id}-d-${i}`} className="flex items-center gap-3 rounded-2xl bg-white border border-sand/50 p-4">
                  <img src={p.image || 'https://picsum.photos/seed/product/100/100'} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{p.name}</p>
                    <p className="text-xs text-dark/50">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={() => toast.info('Descarga iniciada')}
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-medium text-dark mb-3">Físicos</h3>
          {physicals.length === 0 ? (
            <p className="text-sm text-dark/60">No tenés productos físicos.</p>
          ) : (
            <div className="space-y-2">
              {physicals.map((p, i) => (
                <div key={`${p.id}-p-${i}`} className="flex items-center gap-3 rounded-2xl bg-white border border-sand/50 p-4">
                  <img src={p.image || 'https://picsum.photos/seed/product/100/100'} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{p.name}</p>
                    <p className="text-xs text-dark/50">{formatPrice(p.price)}</p>
                  </div>
                  <Link to="/mi-cuenta/pedidos" className="text-xs text-primary hover:underline">Ver pedido</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
