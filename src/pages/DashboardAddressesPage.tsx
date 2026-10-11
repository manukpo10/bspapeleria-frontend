import { useState } from 'react';
import { Plus, MapPin, Trash2, Star, Pencil } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { EmptyState } from '../components/shared/EmptyState';
import { SectionHeading } from '../components/shared/SectionHeading';
import { TextField } from '../components/shared/TextField';
import type { Address } from '../types';
import { toast } from 'sonner';

const FIRST_FIELD_ID = 'addr-fullName';

export default function DashboardAddressesPage() {
  const { user, updateAddresses } = useAuthStore();
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<Partial<Address>>({});
  // Set when the user tries to save with a required field empty, so the errors show up only then
  const [attempted, setAttempted] = useState(false);

  const focusForm = () => document.getElementById(FIRST_FIELD_ID)?.focus();

  const handleSave = async () => {
    if (!user) return;
    if (!form.fullName || !form.street || !form.city) {
      setAttempted(true);
      document.getElementById(!form.fullName ? FIRST_FIELD_ID : !form.street ? 'addr-street' : 'addr-city')?.focus();
      return;
    }
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
    setAttempted(false);
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    updateAddresses(user.addresses.filter((a) => a.id !== id));
    toast.success('Dirección eliminada');
  };

  const requiredError = (value: string | undefined, message: string) => (attempted && !value ? message : undefined);

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading
        title="Direcciones"
        action={
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({}); setAttempted(false); focusForm(); }}
            className="btn btn-primary btn-sm min-h-11"
          >
            <Plus className="size-4" aria-hidden="true" /> Nueva dirección
          </button>
        }
      />

      {user?.addresses && user.addresses.length > 0 ? (
        <ul className="space-y-4">
          {user.addresses.map((addr) => (
            <li key={addr.id}>
              <article className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h3 className="font-display font-semibold text-dark">{addr.fullName}</h3>
                      {addr.isDefault && (
                        <span className="chip bg-mist text-iris">
                          <Star className="size-3.5 fill-current" aria-hidden="true" /> Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-dark/75">{addr.street}, {addr.city}, {addr.province}</p>
                    <p className="mt-0.5 text-sm text-dark/65">{addr.zipCode} · {addr.phone}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditing(addr); setForm(addr); setAttempted(false); focusForm(); }}
                    className="btn btn-ghost btn-sm min-h-11"
                  >
                    <Pencil className="size-4" aria-hidden="true" /> Editar
                    <span className="sr-only"> dirección de {addr.fullName}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                    <span className="sr-only"> dirección de {addr.fullName}</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState className="card" icon={MapPin} title="No tenés direcciones guardadas.">
          Completá el formulario de abajo para agregar la primera.
        </EmptyState>
      )}

      {editing !== undefined && (
        <section aria-labelledby="address-form-title" className="card animate-fade-in p-6 sm:p-8">
          <h3 id="address-form-title" className="font-display text-xl font-semibold text-dark">
            {editing ? 'Editar dirección' : 'Nueva dirección'}
          </h3>
          <p className="mt-1 text-sm text-dark/65">Los campos con asterisco son obligatorios.</p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              id={FIRST_FIELD_ID}
              label="Nombre completo"
              required
              autoComplete="name"
              value={form.fullName ?? ''}
              error={requiredError(form.fullName, 'Ingresá el nombre completo.')}
              onChange={(v) => setForm({ ...form, fullName: v })}
            />
            <TextField
              id="addr-street"
              label="Calle y número"
              required
              autoComplete="street-address"
              value={form.street ?? ''}
              error={requiredError(form.street, 'Ingresá la calle y el número.')}
              onChange={(v) => setForm({ ...form, street: v })}
            />
            <TextField
              id="addr-city"
              label="Ciudad"
              required
              autoComplete="address-level2"
              value={form.city ?? ''}
              error={requiredError(form.city, 'Ingresá la ciudad.')}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            <TextField
              id="addr-province"
              label="Provincia"
              autoComplete="address-level1"
              value={form.province ?? ''}
              onChange={(v) => setForm({ ...form, province: v })}
            />
            <TextField
              id="addr-zip"
              label="Código postal"
              autoComplete="postal-code"
              value={form.zipCode ?? ''}
              onChange={(v) => setForm({ ...form, zipCode: v })}
            />
            <TextField
              id="addr-phone"
              label="Teléfono"
              type="tel"
              autoComplete="tel"
              value={form.phone ?? ''}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
          </div>

          <label htmlFor="addr-default" className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-dark">
            <input
              id="addr-default"
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="size-5 shrink-0 rounded accent-iris"
            />
            Dirección predeterminada
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleSave} className="btn btn-primary">
              Guardar
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
