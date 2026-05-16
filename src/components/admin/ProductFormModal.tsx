import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';
import type { Product } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const CATEGORIES = [
  { value: 'personalizados', label: 'Personalizados' },
  { value: 'sublimables', label: 'Sublimables' },
  { value: 'fiestas', label: 'Fiestas' },
  { value: 'carteleria', label: 'Cartelería' },
  { value: 'archivos_digitales', label: 'Archivos Digitales' },
];

export default function ProductFormModal({ open, onClose, onSuccess, product }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    images: '',
    price: 0,
    comparePrice: 0,
    category: 'personalizados',
    stock: 0,
    isDigital: false,
    downloadUrl: '',
    featured: false,
    tags: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        images: product.images.join('\n'),
        price: product.price,
        comparePrice: product.comparePrice || 0,
        category: product.category,
        stock: product.stock,
        isDigital: product.isDigital,
        downloadUrl: product.downloadUrl || '',
        featured: product.featured,
        tags: product.tags.join(', '),
      });
    } else {
      setForm({
        name: '',
        description: '',
        shortDescription: '',
        images: '',
        price: 0,
        comparePrice: 0,
        category: 'personalizados',
        stock: 0,
        isDigital: false,
        downloadUrl: '',
        featured: false,
        tags: '',
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
        price: form.price,
        comparePrice: form.comparePrice || undefined,
        category: form.category,
        stock: form.stock,
        isDigital: form.isDigital,
        downloadUrl: form.downloadUrl || undefined,
        featured: form.featured,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      } as any;

      if (product) {
        await api.updateProduct(product.id, payload);
        toast.success('Producto actualizado');
      } else {
        await api.createProduct(payload);
        toast.success('Producto creado');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el producto');
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
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Nombre</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ej: Papel de sublimación A4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Descripción corta</label>
            <input
              required
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Breve descripción"
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
              placeholder="Descripción detallada"
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
              <label className="block text-sm font-medium text-white/70 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Stock</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">URLs de imágenes (una por línea)</label>
            <textarea
              required
              rows={3}
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Tags (separados por coma)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="papel, sublimación, A4"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isDigital"
              type="checkbox"
              checked={form.isDigital}
              onChange={(e) => setForm({ ...form, isDigital: e.target.checked })}
              className="rounded border-white/30 bg-white/5 text-primary focus:ring-primary"
            />
            <label htmlFor="isDigital" className="text-sm text-white/70">Producto digital</label>
          </div>

          {form.isDigital && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">URL de descarga</label>
              <input
                value={form.downloadUrl}
                onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-white/30 bg-white/5 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm text-white/70">Destacado</label>
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
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
