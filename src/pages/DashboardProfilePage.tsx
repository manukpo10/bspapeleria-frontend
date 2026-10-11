import { useState } from 'react';
import { User, Mail, Phone, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SectionHeading } from '../components/shared/SectionHeading';
import { TextField } from '../components/shared/TextField';
import { api } from '../services/api';
import { toast } from 'sonner';

export default function DashboardProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    bio: user?.bio ?? '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const updated = await api.updateProfile(user.id, form);
      updateUser(updated);
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error((err as { message?: string }).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading title="Perfil" />

      <section aria-label="Tu foto de perfil" className="card flex items-center gap-4 p-6 sm:gap-5 sm:p-8">
        <div className="relative shrink-0">
          <img
            src={user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}`}
            alt=""
            width={80}
            height={80}
            decoding="async"
            className="size-20 rounded-full object-cover ring-4 ring-mist"
          />
          <button
            type="button"
            aria-label="Cambiar foto de perfil"
            className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-dark text-white shadow-soft ring-2 ring-white transition-colors hover:bg-dark/85 after:absolute after:-inset-1"
          >
            <Camera className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold text-dark">{user?.name}</p>
          <p className="truncate text-sm text-dark/65">{user?.email}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} aria-labelledby="profile-data-title" className="card p-6 sm:p-8">
        <h3 id="profile-data-title" className="font-display text-xl font-semibold text-dark">Tus datos</h3>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            id="profile-name"
            label="Nombre"
            icon={User}
            autoComplete="name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <TextField
            id="profile-email"
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <TextField
            id="profile-phone"
            label="Teléfono"
            type="tel"
            icon={Phone}
            autoComplete="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <TextField
            id="profile-bio"
            label="Bio"
            multiline
            rows={3}
            hint="Contanos algo sobre vos. Es opcional."
            className="sm:col-start-1 sm:col-end-3"
            value={form.bio}
            onChange={(v) => setForm({ ...form, bio: v })}
          />
        </div>

        <div className="mt-8">
          <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
