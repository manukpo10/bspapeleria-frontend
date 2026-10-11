import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/shared/ProductCard';
import { BuilderActions } from '../components/admin/BuilderActions';
import { FormField } from '../components/admin/FormField';
import { FormSection } from '../components/admin/FormSection';
import { IconButton } from '../components/admin/RowActions';
import { PreviewFrame } from '../components/admin/PreviewFrame';
import { SwitchField } from '../components/admin/SwitchField';

const CATEGORIES = [
  { value: 'personalizados', label: 'Personalizados' },
  { value: 'sublimables', label: 'Sublimables' },
  { value: 'fiestas', label: 'Fiestas' },
  { value: 'carteleria', label: 'Cartelería' },
  { value: 'archivos_digitales', label: 'Archivos Digitales' },
];

// Quiet lilac square for a draft without photos yet
const PREVIEW_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f1eafe'/%3E%3C/svg%3E";

// The storefront card needs a whole Product: the draft is completed with neutral values, only for the preview
function toPreviewProduct(p: Partial<Product>): Product {
  return {
    id: p.id ?? 'preview',
    slug: p.slug ?? 'vista-previa',
    name: p.name || 'Nombre del producto',
    description: p.description ?? '',
    shortDescription: p.shortDescription ?? '',
    price: p.price ?? 0,
    comparePrice: p.comparePrice,
    images: p.images?.length ? p.images : [PREVIEW_IMAGE],
    // The select below uses underscores (archivos_digitales), the storefront ids use hyphens
    category: (p.category ?? 'personalizados').replace(/_/g, '-') as Product['category'],
    tags: p.tags ?? [],
    stock: p.stock ?? 0,
    isDigital: p.isDigital ?? false,
    downloadUrl: p.downloadUrl,
    featured: p.featured ?? false,
    rating: p.rating ?? 0,
    reviewsCount: p.reviewsCount ?? 0,
    createdAt: p.createdAt ?? '',
  };
}

const modeButton = (active: boolean) =>
  cn(
    'min-h-11 rounded-full px-4 text-sm font-semibold transition-all',
    active ? 'bg-white text-dark shadow-soft' : 'text-dark/65 hover:text-dark',
  );

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
        await api.createProduct(product as Omit<Product, 'id' | 'slug' | 'createdAt'>);
        toast.success('Producto creado');
        navigate('/admin/productos');
      } else {
        await api.updateProduct(product.id!, product);
        toast.success('Producto actualizado');
        navigate('/admin/productos');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const saveLabel = saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios';
  const handleCancel = () => navigate('/admin/productos');

  return (
    <div className="animate-fade-in">
      <Link to="/admin/productos" className="btn btn-ghost btn-sm -ml-3 mb-4 min-h-11">
        <ArrowLeft className="size-4" aria-hidden="true" /> Volver a productos
      </Link>

      {/* Below lg the form and the preview take turns; from lg they sit side by side */}
      <div role="group" aria-label="Qué querés ver" className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-sand/40 p-1 lg:hidden">
        <button type="button" aria-pressed={!previewMode} onClick={() => setPreviewMode(false)} className={modeButton(!previewMode)}>
          Formulario
        </button>
        <button type="button" aria-pressed={previewMode} onClick={() => setPreviewMode(true)} className={modeButton(previewMode)}>
          Vista previa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className={cn('space-y-6', previewMode && 'max-lg:hidden')}>
          <FormSection title="Información básica">
            <FormField label="Nombre" required>
              {(control) => (
                <input
                  {...control}
                  value={product.name || ''}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Ej: Papel de sublimación A4"
                  className="field"
                />
              )}
            </FormField>

            <FormField label="Descripción corta" hint="Aparece en los listados de la tienda.">
              {(control) => (
                <input
                  {...control}
                  value={product.shortDescription || ''}
                  onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                  placeholder="Breve descripción para listados"
                  className="field"
                />
              )}
            </FormField>

            <FormField label="Descripción completa">
              {(control) => (
                <textarea
                  {...control}
                  value={product.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Descripción detallada del producto"
                  rows={4}
                  className="field min-h-28 resize-y"
                />
              )}
            </FormField>

            <FormField label="Tags" hint="Separalos con comas.">
              {(control) => (
                <input
                  {...control}
                  value={(product.tags || []).join(', ')}
                  onChange={(e) => setProduct({ ...product, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="regalo, sublimable, a4"
                  className="field"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title="Precio e inventario">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Precio">
                {(control) => (
                  <input
                    {...control}
                    type="number"
                    min="0"
                    value={product.price || ''}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="field"
                  />
                )}
              </FormField>
              <FormField label="Precio comparación" hint="El precio anterior, tachado. Es opcional.">
                {(control) => (
                  <input
                    {...control}
                    type="number"
                    min="0"
                    value={product.comparePrice || ''}
                    onChange={(e) => setProduct({ ...product, comparePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="field"
                    placeholder="Opcional"
                  />
                )}
              </FormField>
              <FormField label="Categoría">
                {(control) => (
                  <select
                    {...control}
                    value={product.category || 'personalizados'}
                    onChange={(e) => setProduct({ ...product, category: e.target.value as Product['category'] })}
                    className="field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                )}
              </FormField>
              <FormField label="Stock">
                {(control) => (
                  <input
                    {...control}
                    type="number"
                    min="0"
                    value={product.stock ?? 0}
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                    className="field"
                  />
                )}
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Multimedia">
            <FormField label="URLs de imagen" hint="Una por línea. La primera es la principal.">
              {(control) => (
                <textarea
                  {...control}
                  value={(product.images || []).join('\n')}
                  onChange={(e) => setProduct({ ...product, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                  placeholder={'https://ejemplo.com/foto-1.jpg\nhttps://ejemplo.com/foto-2.jpg'}
                  rows={3}
                  className="field min-h-24 resize-y"
                />
              )}
            </FormField>

            {product.images?.[0] && (
              <ul aria-label="Imágenes cargadas" className="flex flex-wrap gap-3">
                {product.images.map((img, i) => (
                  <li key={i} className="relative">
                    <img src={img} alt={`Imagen ${i + 1}`} className="size-24 rounded-xl bg-sand/40 object-cover" />
                    <IconButton
                      icon={Trash2}
                      tone="danger"
                      label={`Quitar la imagen ${i + 1}`}
                      onClick={() => setProduct({ ...product, images: product.images?.filter((_, idx) => idx !== i) })}
                      className="absolute right-1 top-1 bg-white/90 shadow-soft hover:bg-white"
                    />
                  </li>
                ))}
              </ul>
            )}
          </FormSection>

          <FormSection title="Opciones">
            <div className="divide-y divide-sand/60">
              <SwitchField
                className="pb-3"
                label="Es un producto digital"
                description="Se descarga después de la compra y no lleva envío."
                checked={product.isDigital || false}
                onChange={(checked) => setProduct({ ...product, isDigital: checked })}
              />
              <SwitchField
                className="pt-3"
                label="Producto destacado"
                description="Se muestra primero en la tienda."
                checked={product.featured || false}
                onChange={(checked) => setProduct({ ...product, featured: checked })}
              />
            </div>

            {product.isDigital && (
              <FormField label="URL de descarga">
                {(control) => (
                  <input
                    {...control}
                    value={product.downloadUrl || ''}
                    onChange={(e) => setProduct({ ...product, downloadUrl: e.target.value })}
                    placeholder="https://..."
                    className="field"
                  />
                )}
              </FormField>
            )}
          </FormSection>
        </div>

        <aside aria-label="Acciones y vista previa" className={cn('space-y-6 lg:sticky lg:top-24', !previewMode && 'max-lg:hidden')}>
          <div className="card hidden p-5 lg:block">
            <BuilderActions layout="stack" saving={saving} saveLabel={saveLabel} onSave={handleSave} onCancel={handleCancel} />
          </div>

          <PreviewFrame note="Así se ve en la tienda. Se actualiza mientras escribís.">
            <ProductCard product={toPreviewProduct(product)} detailed />
          </PreviewFrame>
        </aside>
      </div>

      {/* Below lg the actions stay at the bottom of the screen, whichever of the two views is open */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-sand/60 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <BuilderActions layout="row" saving={saving} saveLabel={saveLabel} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
