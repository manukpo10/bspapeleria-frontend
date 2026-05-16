import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Users, Star } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import type { Course } from '../types';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses().then((data) => { setCourses(data); setLoading(false); });
  }, []);

  const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este curso?')) return;
    await api.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success('Curso eliminado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-white">Cursos</h1>
        <Link
          to="/admin/cursos/nuevo"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" /> Crear curso
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cursos..."
          className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-left p-4 font-medium">Curso</th>
                <th className="text-left p-4 font-medium">Nivel</th>
                <th className="text-left p-4 font-medium">Precio</th>
                <th className="text-left p-4 font-medium">Estudiantes</th>
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
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={c.coverImage} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="text-white/80">{c.title}</span>
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <Star className="w-3 h-3 text-warning fill-warning" /> {c.rating}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 capitalize">{c.level}</td>
                  <td className="p-4 text-white/80">{formatPrice(c.price)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-white/60">
                      <Users className="w-3 h-3" /> {c.enrolledCount}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/cursos/${c.id}/builder`}
                        className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-full hover:bg-error/10 text-white/40 hover:text-error transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
