import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Power, PowerOff, RefreshCw, SearchX, Tag, Trash2, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../services/api';
import { formatDate, formatPrice } from '../lib/utils';
import type { Coupon, CouponInput } from '../types';
import { Dialog } from '../components/shared/Dialog';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { IconButton } from '../components/admin/RowActions';
import { ListSkeleton } from '../components/admin/ListSkeleton';
import { CouponForm } from '../components/admin/CouponForm';
import { CouponStatusChip } from '../components/admin/CouponStatusChip';

const percentFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

const discountText = (c: Coupon) =>
  c.discountType === 'percentage' ? `${percentFormat.format(c.discountValue)}\u00a0%` : formatPrice(c.discountValue);
const usesText = (c: Coupon) => `${c.usedCount} / ${c.maxUses}`;
const expiryText = (c: Coupon) => (c.validUntil ? formatDate(c.validUntil) : 'Sin vencimiento');
const conditionsText = (c: Coupon) =>
  [
    c.minPurchase ? `Compra mínima ${formatPrice(c.minPurchase)}` : null,
    c.discountType === 'percentage' && c.maxDiscount !== null ? `Tope ${formatPrice(c.maxDiscount)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

// PUT replaces the whole coupon, so a quick toggle has to send every field back
const toInput = (c: Coupon): CouponInput => ({
  code: c.code,
  discountType: c.discountType,
  discountValue: c.discountValue,
  validUntil: c.validUntil,
  maxUses: c.maxUses,
  minPurchase: c.minPurchase,
  maxDiscount: c.maxDiscount,
  active: c.active,
});

type Busy = 'save' | 'toggle' | 'delete' | null;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  // `coupon: null` is the form for a new coupon
  const [editor, setEditor] = useState<{ coupon: Coupon | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Coupon | null>(null);
  // One request at a time: every control that writes is disabled while this is set
  const [busy, setBusy] = useState<Busy>(null);

  useEffect(() => {
    let cancelled = false;
    api.getAllCoupons()
      .then((data) => {
        if (cancelled) return;
        setCoupons(data);
        setStatus('ready');
      })
      .catch((e: Error) => {
        if (cancelled) return;
        // fetch rejects with a TypeError when the server cannot be reached
        setLoadError(e instanceof TypeError ? '' : e.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setStatus('loading');
    setReloadKey((key) => key + 1);
  };

  const run = async (kind: Exclude<Busy, null>, action: () => Promise<void>, fallback: string) => {
    setBusy(kind);
    try {
      await action();
    } catch (e) {
      toast.error((e as Error).message || fallback);
    } finally {
      setBusy(null);
    }
  };

  const handleSave = (input: CouponInput) =>
    run(
      'save',
      async () => {
        if (editor?.coupon) {
          const updated = await api.updateCoupon(editor.coupon.id, input);
          setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          toast.success('Cupón actualizado');
        } else {
          const created = await api.createCoupon(input);
          setCoupons((prev) => [created, ...prev]);
          toast.success('Cupón creado');
        }
        setEditor(null);
      },
      'No pudimos guardar el cupón',
    );

  const handleToggle = (coupon: Coupon) =>
    run(
      'toggle',
      async () => {
        const updated = await api.updateCoupon(coupon.id, { ...toInput(coupon), active: !coupon.active });
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success(updated.active ? 'Cupón activado' : 'Cupón desactivado');
      },
      'No pudimos cambiar el estado del cupón',
    );

  const handleDelete = () => {
    const target = pendingDelete;
    if (!target) return;
    run(
      'delete',
      async () => {
        await api.deleteCoupon(target.id);
        setCoupons((prev) => prev.filter((c) => c.id !== target.id));
        if (editor?.coupon?.id === target.id) setEditor(null);
        setPendingDelete(null);
        toast.success('Cupón eliminado');
      },
      'No pudimos eliminar el cupón',
    );
  };

  const query = search.trim().toLowerCase();
  const filtered = coupons.filter((c) => c.code.toLowerCase().includes(query));
  const isCreating = editor !== null && editor.coupon === null;
  const locked = busy !== null;
  // The open form holds its own copy of the coupon: a toggle or a delete now would be undone (or orphaned) by saving it
  const editingId = editor?.coupon?.id;

  const rowActions = (c: Coupon) => (
    <>
      <IconButton onClick={() => setEditor({ coupon: c })} icon={Pencil} label={`Editar cupón ${c.code}`} disabled={locked} />
      <IconButton
        onClick={() => handleToggle(c)}
        icon={c.active ? PowerOff : Power}
        label={`${c.active ? 'Desactivar' : 'Activar'} cupón ${c.code}`}
        disabled={locked || editingId === c.id}
      />
      <IconButton
        onClick={() => setPendingDelete(c)}
        icon={Trash2}
        tone="danger"
        label={`Eliminar cupón ${c.code}`}
        disabled={locked || editingId === c.id}
      />
    </>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          label="Buscar cupones"
          placeholder="Buscar cupones..."
          value={search}
          onChange={setSearch}
          className="sm:w-full sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => setEditor(isCreating ? null : { coupon: null })}
          disabled={status !== 'ready' || locked}
          aria-expanded={isCreating}
          aria-controls="coupon-form"
          className="btn btn-primary"
        >
          <Plus className="size-5" aria-hidden="true" /> Nuevo cupón
        </button>
      </div>

      {editor && (
        <CouponForm
          key={editor.coupon?.id ?? 'new'}
          coupon={editor.coupon}
          saving={busy === 'save'}
          disabled={locked}
          onSubmit={handleSave}
          onCancel={() => setEditor(null)}
        />
      )}

      {status === 'loading' ? (
        <ListSkeleton label="Cargando cupones..." />
      ) : status === 'error' ? (
        <EmptyState
          className="card"
          icon={TriangleAlert}
          title="No pudimos cargar los cupones."
          action={
            <button type="button" onClick={retry} className="btn btn-secondary">
              <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
            </button>
          }
        >
          {loadError || 'Revisá tu conexión e intentá de nuevo.'}
        </EmptyState>
      ) : coupons.length === 0 ? (
        <EmptyState
          className="card"
          icon={Tag}
          title="Todavía no hay cupones."
          action={
            <button type="button" onClick={() => setEditor({ coupon: null })} className="btn btn-secondary">
              Crear el primero
            </button>
          }
        >
          Cuando crees cupones, los vas a ver acá para editarlos o desactivarlos.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={SearchX}
          title="No encontramos cupones."
          action={
            <button type="button" onClick={() => setSearch('')} className="btn btn-secondary">
              Limpiar búsqueda
            </button>
          }
        >
          Probá con otro código.
        </EmptyState>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-dark/65">
            {query ? `${filtered.length} de ${coupons.length} cupones` : `${coupons.length} ${coupons.length === 1 ? 'cupón' : 'cupones'}`}
          </p>

          {/* Six columns do not fit next to the sidebar below xl, so the table waits for xl and cards cover the rest */}
          <AdminTable caption="Cupones de descuento" className="md:hidden xl:block">
            <THead>
              <Th>Código</Th>
              <Th>Descuento</Th>
              <Th align="right">Usos</Th>
              <Th>Vence</Th>
              <Th>Estado</Th>
              <Th align="right">Acciones</Th>
            </THead>
            <tbody>
              {filtered.map((c) => (
                <TRow key={c.id}>
                  <Td>
                    <p className="break-words font-display font-semibold text-dark">{c.code}</p>
                    {conditionsText(c) && <p className="mt-0.5 text-xs text-dark/65">{conditionsText(c)}</p>}
                  </Td>
                  <Td className="whitespace-nowrap font-display font-semibold text-dark">{discountText(c)}</Td>
                  <Td align="right" className="whitespace-nowrap font-display text-dark">{usesText(c)}</Td>
                  <Td className="text-xs text-dark/75">{expiryText(c)}</Td>
                  <Td>
                    <CouponStatusChip coupon={c} />
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">{rowActions(c)}</div>
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Cupones de descuento" className="grid gap-3 md:grid-cols-2 xl:hidden">
            {filtered.map((c) => (
              <li key={c.id}>
                <article className="card h-full p-4">
                  <header className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words font-display font-semibold text-dark">{c.code}</p>
                    <CouponStatusChip coupon={c} className="shrink-0" />
                  </header>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-sand/60 pt-4">
                    <div>
                      <dt className="text-xs text-dark/65">Descuento</dt>
                      <dd className="font-display font-semibold text-dark">{discountText(c)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-dark/65">Usos</dt>
                      <dd className="font-display font-semibold text-dark">{usesText(c)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs text-dark/65">Vence</dt>
                      <dd className="text-sm text-dark">{expiryText(c)}</dd>
                    </div>
                    {conditionsText(c) && (
                      <div className="col-span-2">
                        <dt className="text-xs text-dark/65">Condiciones</dt>
                        <dd className="text-sm text-dark">{conditionsText(c)}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-sand/60 pt-3">
                    <button type="button" onClick={() => setEditor({ coupon: c })} disabled={locked} className="btn btn-soft btn-sm min-h-11">
                      <Pencil className="size-4" aria-hidden="true" /> Editar
                      <span className="sr-only"> cupón {c.code}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(c)}
                      disabled={locked || editingId === c.id}
                      className="btn btn-secondary btn-sm min-h-11"
                    >
                      {c.active ? <PowerOff className="size-4" aria-hidden="true" /> : <Power className="size-4" aria-hidden="true" />}
                      {c.active ? 'Desactivar' : 'Activar'}
                      <span className="sr-only"> cupón {c.code}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(c)}
                      disabled={locked || editingId === c.id}
                      className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                      <span className="sr-only"> cupón {c.code}</span>
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog
        open={pendingDelete !== null}
        onClose={() => {
          if (busy !== 'delete') setPendingDelete(null);
        }}
        labelledBy="coupon-delete-title"
      >
        <div className="card p-6 sm:p-8">
          <h2 id="coupon-delete-title" className="font-display text-xl font-semibold text-dark">
            Eliminar cupón
          </h2>
          <p className="mt-3 text-dark/75">
            ¿Querés eliminar el cupón <strong className="break-all font-semibold text-dark">{pendingDelete?.code}</strong>? No se puede deshacer.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              data-autofocus
              onClick={() => setPendingDelete(null)}
              disabled={busy === 'delete'}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={locked}
              aria-busy={busy === 'delete'}
              className="btn flex-1 bg-rose-700 text-white hover:bg-rose-800"
            >
              {busy === 'delete' ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
