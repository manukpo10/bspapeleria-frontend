import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { products } from '../data/mocks';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function DashboardProductsPage() {
  const { user } = useAuthStore();
  const purchasedProducts = Array.from(
    new Map(
      (user?.orders?.flatMap((_orderId) => products.slice(0, 2)) ?? [])
        .map((p) => [p.id, p])
    ).values()
  );

  const digitals = purchasedProducts.filter((p) => p.isDigital);
  const physicals = purchasedProducts.filter((p) => !p.isDigital);

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
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
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
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
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
