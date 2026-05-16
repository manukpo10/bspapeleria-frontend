import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, Eye, EyeOff, Image as ImageIcon, Plus, Trash2, Package } from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'personalizados', label: 'Personalizados' },
  { value: 'sublimables', label: 'Sublimables' },
  { value: 'fiestas', label: 'Fiestas' },
  { value: 'carteleria', label: 'Cartelería' },
  { value: 'archivos_digitales', label: 'Archivos Digitales' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function ProductPreview({ product }: { product: Partial<Product> }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="aspect-square bg-sand/20 relative shrink-0">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-sand/40" />
          </div>
        )}
        {product.isDigital && (
          <span className="absolute top-3 left-3 text-xs bg-dark/80 text-white px-2 py-1 rounded-lg">Digital</span>
        )}
      </div>
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          {product.comparePrice ? (
            <span className="text-base text-dark/40 line-through">${product.comparePrice}</span>
          ) : null}
        </div>
        <h1 className="font-display text-xl font-bold text-dark mb-2">{product.name || 'Sin nombre'}</h1>
        <p className="text-sm text-dark/60 mb-4">{product.shortDescription || 'Sin descripción'}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg capitalize">
            {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
          </span>
          {product.stock !== undefined && (
            <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg">
              Stock: {product.stock}
            </span>
          )}
          {product.isDigital && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg">Descarga digital</span>
          )}
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-sand/30 text-dark/60 px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'nuevo';
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    comparePrice: undefined,
    images: [],
    category: 'personalizados',
    tags: [],
    stock: 0,
    isDigital: false,
    downloadUrl: '',
    featured: false,
    rating: 0,
    reviewsCount: 0,
  });

  useEffect(() => {
    if (isNew) return;
    api.getProductById(id!).then((p) => {
      if (p) setProduct(p);
    });
  }, [id, isNew]);

  const handleSave = async () => {
    if (!product.name) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const created = await api.createProduct(product as any);
        toast.success('Producto creado');
        navigate('/admin/productos');
      } else {
        await api.updateProduct(product.id!, product as any);
        toast.success('Producto actualizado');
        navigate('/admin/productos');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-dark">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-dark/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-semibold text-white">
            {isNew ? 'Nuevo producto' : 'Editar producto'}
          </h1>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${previewMode ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? 'Editar' : 'Preview'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/productos')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${previewMode ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
          <div className="max-w-2xl mx-auto p-6 space-y-8">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Información básica</h2>

              <Field label="Nombre">
                <input
                  value={product.name || ''}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Ej: Papel de sublimación A4"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              <Field label="Descripción corta">
                <input
                  value={product.shortDescription || ''}
                  onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                  placeholder="Breve descripción para listados"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              <Field label="Descripción completa">
                <textarea
                  value={product.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Descripción detallada del producto"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio">
                  <input
                    type="number"
                    min="0"
                    value={product.price || ''}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </Field>
                <Field label="Precio comparación">
                  <input
                    type="number"
                    min="0"
                    value={product.comparePrice || ''}
                    onChange={(e) => setProduct({ ...product, comparePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Opcional"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoría">
                  <select
                    value={product.category || 'personalizados'}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    min="0"
                    value={product.stock ?? 0}
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Multimedia</h2>

              <Field label="URLs de imagen (una por línea)">
                <textarea
                  value={(product.images || []).join('\n')}
                  onChange={(e) => setProduct({ ...product, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                  placeholder="https://...\nhttps://..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </Field>
              {product.images?.[0] && (
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setProduct({ ...product, images: product.images?.filter((_, idx) => idx !== i) })}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.isDigital || false}
                  onChange={(e) => setProduct({ ...product, isDigital: e.target.checked })}
                  className="rounded border-white/30 bg-white/5 text-primary"
                />
                <span className="text-sm text-white/60">Es un producto digital</span>
              </label>

              {product.isDigital && (
                <Field label="URL de descarga">
                  <input
                    value={product.downloadUrl || ''}
                    onChange={(e) => setProduct({ ...product, downloadUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </Field>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Opciones</h2>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.featured || false}
                  onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                  className="rounded border-white/30 bg-white/5 text-primary"
                />
                <span className="text-sm text-white/60">Producto destacado</span>
              </label>
            </section>

            <section className="space-y-4 pb-8">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Tags</h2>
              <input
                value={(product.tags || []).join(', ')}
                onChange={(e) => setProduct({ ...product, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                placeholder="regalo, sublimable, a4"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </section>
          </div>
        </div>

        {(previewMode || !previewMode) && (
          <div className={`${previewMode ? 'w-full lg:w-1/2' : 'hidden lg:block lg:w-[480px] xl:w-[560px]'} border-l border-white/10 overflow-hidden bg-sand/5`}>
            <div className="h-full overflow-y-auto p-4">
              <div className="sticky top-0 z-10 mb-3 flex items-center gap-2">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  Vista del cliente
                </span>
              </div>
              <ProductPreview product={product} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}