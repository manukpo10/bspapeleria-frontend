import { useState, useEffect } from 'react';
import { ShoppingBag, SearchX } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../lib/utils';
import type { Order } from '../types';
import { Dialog } from '../components/shared/Dialog';
import { EmptyState } from '../components/shared/EmptyState';
import { StatusChip } from '../components/shared/StatusChip';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { ListSkeleton } from '../components/admin/ListSkeleton';

const STATUS_OPTIONS: { value: Order['status']; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingChange, setPendingChange] = useState<{ orderId: string; newStatus: Order['status'] } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    api.getAllOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const confirmStatusChange = async () => {
    if (!pendingChange) return;
    const { orderId, newStatus } = pendingChange;
    const backendStatus = newStatus === 'pending' ? 'PENDIENTE'
      : newStatus === 'paid' ? 'CONFIRMADA'
      : newStatus === 'shipped' ? 'ENVIADA'
      : newStatus === 'delivered' ? 'ENTREGADA'
      : newStatus === 'cancelled' ? 'CANCELADA'
      : newStatus;
    await api.updateOrderStatus(orderId, backendStatus);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    setPendingChange(null);
  };

  const query = search.trim().toLowerCase();
  const filtered = orders.filter(
    (o) =>
      (statusFilter === 'all' || o.status === statusFilter) &&
      (!query || (o.orderNumber ?? '').toLowerCase().includes(query) || (o.userId ?? '').toLowerCase().includes(query)),
  );
  const isFiltering = query !== '' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  // The select is the control the admin uses; the chip beside it is the state at a glance
  const statusSelect = (order: Order) => (
    <select
      value={order.status}
      onChange={(e) => setPendingChange({ orderId: order.id, newStatus: e.target.value as Order['status'] })}
      aria-label={`Cambiar el estado del pedido ${order.orderNumber}`}
      className="field w-full py-2 md:w-auto"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          label="Buscar pedidos por número"
          placeholder="Buscar por número de pedido..."
          value={search}
          onChange={setSearch}
          className="sm:w-full sm:max-w-sm"
        />
        <div className="sm:ml-auto">
          <label htmlFor="orders-status-filter" className="sr-only">
            Filtrar por estado
          </label>
          <select
            id="orders-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | Order['status'])}
            className="field w-full sm:w-auto sm:min-w-48"
          >
            <option value="all">Todos los estados</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <ListSkeleton label="Cargando pedidos..." />
      ) : orders.length === 0 ? (
        <EmptyState className="card" icon={ShoppingBag} title="Todavía no hay pedidos.">
          Cuando alguien compre en la tienda, el pedido va a aparecer acá.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={SearchX}
          title="No encontramos pedidos."
          action={
            <button type="button" onClick={clearFilters} className="btn btn-secondary">
              Limpiar filtros
            </button>
          }
        >
          Probá con otro número o con otro estado.
        </EmptyState>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-dark/65">
            {isFiltering ? `${filtered.length} de ${orders.length} pedidos` : `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'}`}
          </p>

          <AdminTable caption="Pedidos de la tienda">
            <THead>
              <Th>Pedido</Th>
              <Th>Cliente</Th>
              <Th>Fecha</Th>
              <Th align="right">Total</Th>
              <Th>Estado</Th>
            </THead>
            <tbody>
              {filtered.map((order) => (
                <TRow key={order.id}>
                  <Td className="whitespace-nowrap font-display font-semibold text-dark">#{order.orderNumber}</Td>
                  <Td className="text-xs text-dark/75">{order.userId || '—'}</Td>
                  <Td className="text-xs text-dark/75">
                    <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                  </Td>
                  <Td align="right" className="whitespace-nowrap font-display font-semibold text-dark">{formatPrice(order.total)}</Td>
                  <Td>
                    {/* Stacked until xl: chip and select side by side would not fit next to the sidebar */}
                    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:gap-3">
                      <StatusChip status={order.status} />
                      {statusSelect(order)}
                    </div>
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Pedidos de la tienda" className="space-y-3 md:hidden">
            {filtered.map((order) => (
              <li key={order.id}>
                <article className="card p-4">
                  <header className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-dark">Pedido #{order.orderNumber}</p>
                      <p className="mt-0.5 text-xs text-dark/65">
                        <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                      </p>
                    </div>
                    <StatusChip status={order.status} className="shrink-0" />
                  </header>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-sand/60 pt-4">
                    <div>
                      <dt className="text-xs text-dark/65">Total</dt>
                      <dd className="font-display font-semibold text-dark">{formatPrice(order.total)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-dark/65">Cliente</dt>
                      <dd className="truncate text-sm text-dark">{order.userId || '—'}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 border-t border-sand/60 pt-3">{statusSelect(order)}</div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog open={pendingChange !== null} onClose={() => setPendingChange(null)} labelledBy="order-status-title">
        <div className="card p-6 sm:p-8">
          <h2 id="order-status-title" className="font-display text-xl font-semibold text-dark">
            Confirmar cambio de estado
          </h2>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-dark/75">
            ¿Cambiar el estado del pedido a {pendingChange && <StatusChip status={pendingChange.newStatus} />}?
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={() => setPendingChange(null)} className="btn btn-secondary flex-1">
              Cancelar
            </button>
            <button type="button" onClick={confirmStatusChange} className="btn btn-primary flex-1">
              Confirmar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
