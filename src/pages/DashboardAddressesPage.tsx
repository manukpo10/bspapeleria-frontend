import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Trash2, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import { toast } from 'sonner';

export default function DashboardAddressesPage() {
  const { user, updateAddresses } = useAuthStore();
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<Partial<Address>>({});

  const handleSave = async () => {
    if (!user || !form.fullName || !form.street || !form.city) return;
    const newAddress: Address = {
      id: editing?.id ?? `addr-${Date.now()}`,
      fullName: form.fullName,
      street: form.street,
      city: form.city,
      province: form.province ?? '',
      zipCode: form.zipCode ?? '',
      phone: form.phone ?? '',
      isDefault: form.isDefault ?? false,
    };

    let updated;
    if (editing) {
      updated = user.addresses.map((a) => (a.id === editing.id ? newAddress : a));
    } else {
      updated = [...user.addresses, newAddress];
    }

    if (newAddress.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: a.id === newAddress.id }));
    }

    updateAddresses(updated);
    toast.success(editing ? 'Dirección actualizada' : 'Dirección agregada');
    setEditing(null);
    setForm({});
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    updateAddresses(user.addresses.filter((a) => a.id !== id));
    toast.success('Dirección eliminada');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-dark">Direcciones</h1>
        <button
          onClick={() => { setEditing(null); setForm({}); }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva dirección
        </button>
      </div>

      {editing !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-sand/50 p-6"
        >
          <h3 className="font-display font-medium text-dark mb-4">{editing ? 'Editar dirección' : 'Nueva dirección'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="Nombre completo" value={form.fullName ?? ''} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Calle y número" value={form.street ?? ''} onChange={(e) => setForm({ ...form, street: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Ciudad" value={form.city ?? ''} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Provincia" value={form.province ?? ''} onChange={(e) => setForm({ ...form, province: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Código postal" value={form.zipCode ?? ''} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Teléfono" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <label className="flex items-center gap-2 text-sm text-dark/70 mb-4">
            <input type="checkbox" checked={form.isDefault ?? false} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-sand text-primary focus:ring-primary" />
            Dirección predeterminada
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors">Guardar</button>
            <button onClick={() => setEditing(null)} className="rounded-xl border border-sand px-5 py-2 text-sm font-medium text-dark hover:bg-sand/30 transition-colors">Cancelar</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {user?.addresses.map((addr) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white border border-sand/50 p-5 flex items-start justify-between"
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-dark text-sm">{addr.fullName}</p>
                <p className="text-sm text-dark/60">{addr.street}, {addr.city}, {addr.province}</p>
                <p className="text-xs text-dark/40">{addr.zipCode} · {addr.phone}</p>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary">
                    <Star className="w-3 h-3 fill-primary" /> Predeterminada
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(addr); setForm(addr); }} className="p-2 rounded-full hover:bg-sand/50 transition-colors text-dark/40 hover:text-dark">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-full hover:bg-error/10 transition-colors text-dark/40 hover:text-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {(!user?.addresses || user.addresses.length === 0) && (
          <p className="text-sm text-dark/60">No tenés direcciones guardadas.</p>
        )}
      </div>
    </div>
  );
}
