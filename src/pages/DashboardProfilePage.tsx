import { useState } from 'react';
import { User, Mail, Phone, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
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
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-dark">Perfil</h1>

      <div className="rounded-2xl bg-white border border-sand/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}`}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white hover:bg-secondary transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h3 className="font-display font-medium text-dark">{user?.name}</h3>
            <p className="text-sm text-dark/60">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark/60 mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-dark/60 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-dark/60 mb-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-dark/60 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
