import { useState, type FormEvent } from 'react';
import { Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { APP_NAME, CONTACT_EMAIL } from '../lib/constants';
import { FormField } from '../components/admin/FormField';
import { FormSection } from '../components/admin/FormSection';
import { SwitchField } from '../components/admin/SwitchField';

// Fills of the logo ribbon and the paper plane, as the storefront uses them
const PALETTE = [
  { name: 'Azul lavanda', swatch: 'bg-primary' },
  { name: 'Violeta', swatch: 'bg-secondary' },
  { name: 'Lila', swatch: 'bg-accent' },
  { name: 'Celeste', swatch: 'bg-cream' },
  { name: 'Lavanda claro', swatch: 'bg-sand' },
  { name: 'Iris', swatch: 'bg-iris' },
  { name: 'Tinta', swatch: 'bg-dark' },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: APP_NAME,
    contactEmail: CONTACT_EMAIL,
    orderAlerts: true,
    enrollmentAlerts: true,
    weeklySummary: false,
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    toast.info('Estos ajustes todavía no se guardan');
  };

  return (
    <form onSubmit={handleSave} className="animate-fade-in max-w-3xl space-y-6">
      <p className="flex items-start gap-2 text-sm text-dark/65">
        <Info className="mt-0.5 size-4 shrink-0 text-iris" aria-hidden="true" />
        Por ahora estos ajustes son de prueba: los cambios no se guardan en el servidor.
      </p>

      <FormSection title="General" description="Nombre de la tienda, contacto y más.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Nombre de la tienda">
            {(control) => (
              <input
                {...control}
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="field"
              />
            )}
          </FormField>
          <FormField label="Email de contacto" hint="Es el que ven tus clientes.">
            {(control) => (
              <input
                {...control}
                type="email"
                autoComplete="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="field"
              />
            )}
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Apariencia" description="Configuración de marca y colores.">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {PALETTE.map((color) => (
            <li key={color.name} className="flex flex-col items-center gap-2 text-center">
              <span aria-hidden="true" className={`size-12 rounded-full ring-1 ring-sand ${color.swatch}`} />
              <span className="text-xs text-dark/75">{color.name}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-dark/65">Estos colores son los del logo y se aplican en toda la tienda.</p>
      </FormSection>

      <FormSection title="Notificaciones" description="Configuración de emails y alertas.">
        <div className="divide-y divide-sand/60">
          <SwitchField
            className="py-3 first:pt-0"
            label="Avisarme de cada pedido nuevo"
            description="Te mandamos un email cuando alguien compra."
            checked={form.orderAlerts}
            onChange={(checked) => setForm({ ...form, orderAlerts: checked })}
          />
          <SwitchField
            className="py-3"
            label="Avisarme de nuevas inscripciones"
            description="Un email cada vez que alguien se anota a un curso."
            checked={form.enrollmentAlerts}
            onChange={(checked) => setForm({ ...form, enrollmentAlerts: checked })}
          />
          <SwitchField
            className="py-3 last:pb-0"
            label="Resumen semanal"
            description="Un email por semana con las ventas y las inscripciones."
            checked={form.weeklySummary}
            onChange={(checked) => setForm({ ...form, weeklySummary: checked })}
          />
        </div>
      </FormSection>

      <div>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          <Save className="size-5" aria-hidden="true" /> Guardar cambios
        </button>
      </div>
    </form>
  );
}
