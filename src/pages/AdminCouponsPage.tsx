import { useState } from 'react';
import { Ban, CircleCheck, Info, Plus, Tag, Trash2, SearchX } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import type { Coupon } from '../types';
import { coupons as mockCoupons } from '../data/mocks';
import { toast } from 'sonner';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchField } from '../components/admin/SearchField';
import { AdminTable, THead, Th, TRow, Td } from '../components/admin/AdminTable';
import { IconButton } from '../components/admin/RowActions';
import { FormField } from '../components/admin/FormField';

function ActiveChip({ active }: { active: boolean }) {
  const Icon = active ? CircleCheck : Ban;
  return (
    <span className={active ? 'chip bg-success/40 text-dark' : 'chip bg-sand/60 text-dark'}>
      <Icon className="size-3.5" aria-hidden="true" />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

const discountText = (c: Coupon) => (c.discountType === 'percentage' ? `${c.discountValue}%` : formatPrice(c.discountValue));

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Coupon>>({ discountType: 'percentage', active: true });
  const [showForm, setShowForm] = useState(false);

  const filtered = coupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!form.code || !form.discountValue) return;
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: form.code.toUpperCase(),
      discountType: form.discountType as 'percentage' | 'fixed',
      discountValue: Number(form.discountValue),
      validUntil: form.validUntil ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      maxUses: Number(form.maxUses) || 100,
      usedCount: 0,
      minPurchase: form.minPurchase ? Number(form.minPurchase) : undefined,
      active: form.active ?? true,
    };
    setCoupons([...coupons, newCoupon]);
    setShowForm(false);
    setForm({ discountType: 'percentage', active: true });
    toast.success('Cupón creado');
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast.success('Cupón eliminado');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <p className="flex items-start gap-2 text-sm text-dark/65">
        <Info className="mt-0.5 size-4 shrink-0 text-iris" aria-hidden="true" />
        Por ahora los cupones son de prueba: los cambios no se guardan en el servidor.
      </p>

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
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="coupon-form"
          className="btn btn-primary"
        >
          <Plus className="size-5" aria-hidden="true" /> Nuevo cupón
        </button>
      </div>

      {showForm && (
        <section id="coupon-form" aria-labelledby="coupon-form-title" className="card animate-fade-in p-6 sm:p-8">
          <h2 id="coupon-form-title" className="font-display text-xl font-semibold text-dark">Nuevo cupón</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Código">
              {(control) => (
                <input
                  {...control}
                  placeholder="Ej: BIENVENIDA10"
                  value={form.code ?? ''}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="field"
                />
              )}
            </FormField>
            <FormField label="Tipo de descuento">
              {(control) => (
                <select
                  {...control}
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="field"
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Fijo</option>
                </select>
              )}
            </FormField>
            <FormField label="Valor" hint={form.discountType === 'fixed' ? 'Monto a descontar, en pesos.' : 'Porcentaje a descontar.'}>
              {(control) => (
                <input
                  {...control}
                  type="number"
                  placeholder="Valor"
                  value={form.discountValue ?? ''}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className="field"
                />
              )}
            </FormField>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleCreate} className="btn btn-primary">Crear</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
          </div>
        </section>
      )}

      {coupons.length === 0 ? (
        <EmptyState className="card" icon={Tag} title="Todavía no hay cupones.">
          Creá el primero con el botón &ldquo;Nuevo cupón&rdquo;.
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
          <AdminTable caption="Cupones de descuento">
            <THead>
              <Th>Código</Th>
              <Th>Descuento</Th>
              <Th align="right">Usos</Th>
              <Th>Estado</Th>
              <Th align="right">Acciones</Th>
            </THead>
            <tbody>
              {filtered.map((c) => (
                <TRow key={c.id}>
                  <Td className="font-display font-semibold text-dark">{c.code}</Td>
                  <Td className="text-dark">{discountText(c)}</Td>
                  <Td align="right" className="whitespace-nowrap font-display text-dark">{c.usedCount} / {c.maxUses}</Td>
                  <Td>
                    <ActiveChip active={c.active} />
                  </Td>
                  <Td align="right">
                    <IconButton onClick={() => handleDelete(c.id)} icon={Trash2} tone="danger" label={`Eliminar cupón ${c.code}`} />
                  </Td>
                </TRow>
              ))}
            </tbody>
          </AdminTable>

          <ul aria-label="Cupones de descuento" className="space-y-3 md:hidden">
            {filtered.map((c) => (
              <li key={c.id}>
                <article className="card p-4">
                  <header className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words font-display font-semibold text-dark">{c.code}</p>
                    <ActiveChip active={c.active} />
                  </header>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-sand/60 pt-4">
                    <div>
                      <dt className="text-xs text-dark/65">Descuento</dt>
                      <dd className="font-display font-semibold text-dark">{discountText(c)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-dark/65">Usos</dt>
                      <dd className="font-display font-semibold text-dark">{c.usedCount} / {c.maxUses}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 border-t border-sand/60 pt-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
