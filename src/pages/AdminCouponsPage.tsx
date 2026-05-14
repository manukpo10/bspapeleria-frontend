import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import type { Coupon } from '../types';
import { coupons as mockCoupons } from '../data/mocks';
import { toast } from 'sonner';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-white">Cupones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo cupón
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <h3 className="font-display font-medium text-white mb-4">Nuevo cupón</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input placeholder="Código" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="percentage" className="bg-dark">Porcentaje</option>
              <option value="fixed" className="bg-dark">Fijo</option>
            </select>
            <input type="number" placeholder="Valor" value={form.discountValue ?? ''} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="rounded-xl bg-success px-5 py-2 text-sm font-medium text-white hover:bg-success/90 transition-colors">Crear</button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors">Cancelar</button>
          </div>
        </motion.div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cupones..." className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="text-left p-4 font-medium">Código</th>
              <th className="text-left p-4 font-medium">Descuento</th>
              <th className="text-left p-4 font-medium">Usos</th>
              <th className="text-left p-4 font-medium">Estado</th>
              <th className="text-right p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-white/80 font-medium">{c.code}</td>
                <td className="p-4 text-white/60">{c.discountType === 'percentage' ? `${c.discountValue}%` : formatPrice(c.discountValue)}</td>
                <td className="p-4 text-white/60">{c.usedCount} / {c.maxUses}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {c.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-full hover:bg-error/10 text-white/40 hover:text-error transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
