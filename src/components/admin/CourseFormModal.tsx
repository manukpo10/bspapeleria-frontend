import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';
import type { Course } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: Course | null;
}

export default function CourseFormModal({ open, onClose, onSuccess, course }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    coverImage: '',
    videoPreviewUrl: '',
    price: 0,
    comparePrice: 0,
    level: 'principiante' as Course['level'],
    modality: 'online' as Course['modality'],
    duration: '',
    instructorName: '',
    tags: '',
  });

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        coverImage: course.coverImage,
        videoPreviewUrl: course.videoPreviewUrl || '',
        price: course.price,
        comparePrice: course.comparePrice || 0,
        level: course.level,
        modality: course.modality,
        duration: course.duration,
        instructorName: typeof course.instructor === 'object' ? course.instructor.name : '',
        tags: course.tags.join(', '),
      });
    } else {
      setForm({
        title: '',
        description: '',
        shortDescription: '',
        coverImage: '',
        videoPreviewUrl: '',
        price: 0,
        comparePrice: 0,
        level: 'principiante',
        modality: 'online',
        duration: '',
        instructorName: '',
        tags: '',
      });
    }
  }, [course, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        coverImage: form.coverImage,
        videoPreviewUrl: form.videoPreviewUrl || undefined,
        price: form.price,
        comparePrice: form.comparePrice || undefined,
        level: form.level,
        modality: form.modality,
        duration: form.duration,
        instructor: { name: form.instructorName },
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      } as any;

      if (course) {
        await api.updateCourse(course.id, payload);
        toast.success('Curso actualizado');
      } else {
        await api.createCourse(payload);
        toast.success('Curso creado');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el curso');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-display text-lg font-semibold text-white">
            {course ? 'Editar curso' : 'Nuevo curso'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Título</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ej: Sublimación Avanzada"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Descripción corta</label>
            <input
              required
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Breve resumen del curso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Descripción completa</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Descripción detallada del curso"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Precio</label>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Precio comparación</label>
              <input
                type="number"
                min="0"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Nivel</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as Course['level'] })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Modalidad</label>
              <select
                value={form.modality}
                onChange={(e) => setForm({ ...form, modality: e.target.value as Course['modality'] })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Duración (horas)</label>
            <input
              required
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ej: 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Instructor</label>
            <input
              required
              value={form.instructorName}
              onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Nombre del instructor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">URL de imagen de portada</label>
            <input
              required
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">URL video intro (opcional)</label>
            <input
              value={form.videoPreviewUrl}
              onChange={(e) => setForm({ ...form, videoPreviewUrl: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Tags (separados por coma)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="sublimación, poliéster, técnica"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : course ? 'Actualizar' : 'Crear curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
