import { useState, useEffect, useRef, type KeyboardEvent, type Ref } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, Minus, Plus, Star, Truck, ShieldCheck, RotateCcw, PackageCheck, PackageX,
  Package, MessageSquareText
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { Breadcrumbs } from '../components/shared/PageHeader';
import { MobileBuyBar, mobileBuyBarClearance } from '../components/shared/MobileBuyBar';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { cn, formatPrice } from '../lib/utils';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import type { Product } from '../types';
import { toast } from 'sonner';

const tabs = [
  { id: 'description', label: 'Descripción' },
  { id: 'specs', label: 'Especificaciones' },
  { id: 'reviews', label: 'Reseñas' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const skeletonBlock = 'animate-pulse rounded-full bg-sand/40';

// The description is stored as HTML, so its elements are styled from the wrapper
const richText =
  'text-base text-dark/75 [&>:first-child]:mt-0 [&_a]:text-iris [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-dark [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-dark [&_li]:mt-1.5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-dark [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6';

const stepperButton =
  'grid size-11 place-items-center rounded-full text-dark transition-colors hover:bg-mist disabled:opacity-40 disabled:hover:bg-transparent';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  // The page's own "Agregar al carrito" button: the phone buy bar watches it
  const [ctaEl, setCtaEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getProductBySlug(slug)
      .then((p) => {
        setProduct(p ?? null);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div role="status">
        <span className="sr-only">Cargando producto…</span>
        <div className="bg-ribbon-soft">
          <div className="mx-auto flex min-h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className={cn(skeletonBlock, 'h-4 w-56')} />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="aspect-square animate-pulse rounded-3xl bg-sand/40" />
            <div className="space-y-4">
              <div className={cn(skeletonBlock, 'h-10 w-3/4')} />
              <div className={cn(skeletonBlock, 'h-5 w-1/3')} />
              <div className={cn(skeletonBlock, 'h-9 w-2/5')} />
              <div className={cn(skeletonBlock, 'h-4 w-full')} />
              <div className={cn(skeletonBlock, 'h-4 w-5/6')} />
              <div className={cn(skeletonBlock, 'h-14 w-full')} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
          <Package className="size-9" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-dark">Producto no encontrado</h1>
        <p className="mt-3 max-w-md text-dark/75">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
        <Link to="/productos" className="btn btn-primary mt-8">Ver todos los productos</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}`,
      type: 'product',
      itemId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      isDigital: product.isDigital,
    });
    toast.success('Producto agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // The main action is defined once and rendered twice: in the page and in the phone buy bar
  const renderAddToCart = (className: string, ref?: Ref<HTMLButtonElement>) => (
    <button ref={ref} type="button" onClick={handleAddToCart} className={className}>
      <ShoppingCart className="size-5" aria-hidden="true" /> Agregar al carrito
    </button>
  );

  // Arrow keys, Home and End move between tabs, as in the ARIA tabs pattern
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, current: TabId) => {
    const index = tabs.findIndex((t) => t.id === current);
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const nextId = tabs[next].id;
    setActiveTab(nextId);
    tabRefs.current[nextId]?.focus();
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;
  // Only a compare price above the price is shown (page and buy bar)
  const comparePrice =
    product.comparePrice != null && product.comparePrice > product.price ? product.comparePrice : null;
  const categoryName = PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.name ?? product.category;
  const inStock = product.stock > 0;

  const reassurances = [
    { icon: Truck, text: 'Envío a todo el país' },
    { icon: ShieldCheck, text: 'Pago seguro' },
    { icon: RotateCcw, text: '10 días de devolución' },
    { icon: inStock ? PackageCheck : PackageX, text: inStock ? 'En stock' : 'Sin stock' },
  ];

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} image={product.images[0]} />

      <div className="bg-ribbon-soft">
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-2 sm:px-6 lg:px-8">
          <Breadcrumbs
            crumbs={[
              { label: 'Inicio', to: '/' },
              { label: 'Productos', to: '/productos' },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className={cn('mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12', mobileBuyBarClearance)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-mist shadow-soft ring-1 ring-sand/70">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                width={800}
                height={800}
                fetchPriority="high"
                className="size-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <ul className="mt-4 flex flex-wrap gap-3">
                {product.images.map((img, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`Ver imagen ${i + 1} de ${product.images.length}`}
                      aria-pressed={activeImage === i}
                      className={cn(
                        'block size-20 overflow-hidden rounded-2xl bg-mist transition-shadow',
                        activeImage === i
                          ? 'ring-2 ring-iris ring-offset-2'
                          : 'ring-1 ring-sand hover:ring-2 hover:ring-secondary',
                      )}
                    >
                      <img src={img} alt="" width={80} height={80} className="size-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              {product.name}
            </h1>

            {product.reviewsCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn('size-5', i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-sand')}
                    />
                  ))}
                </div>
                <span className="text-sm text-dark/65">
                  <span className="sr-only">Calificación {product.rating.toFixed(1)} de 5. </span>
                  ({product.reviewsCount} reseñas)
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-display text-3xl font-bold text-dark">{formatPrice(product.price)}</p>
              {comparePrice !== null ? (
                <del className="font-display text-xl text-dark/65">
                  <span className="sr-only">Precio anterior: </span>
                  {formatPrice(comparePrice)}
                </del>
              ) : null}
              {discount > 0 && <span className="chip bg-dark text-white">-{discount}%</span>}
            </div>

            <p className="mt-5 text-base text-dark/75">{product.shortDescription}</p>

            {/* Quantity */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span id="quantity-label" className="text-sm font-medium text-dark">Cantidad</span>
              <div role="group" aria-labelledby="quantity-label" className="inline-flex items-center rounded-full bg-white p-1 ring-1 ring-sand">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Quitar una unidad"
                  className={stepperButton}
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span aria-live="polite" className="w-12 text-center font-display font-semibold tabular-nums text-dark">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Agregar una unidad"
                  className={stepperButton}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <span className="text-sm font-medium text-rose-700">¡Solo quedan {product.stock}!</span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 grid max-w-xl grid-cols-[1fr_auto] gap-3">
              {renderAddToCart('btn btn-primary btn-lg col-span-2', setCtaEl)}
              <button type="button" onClick={handleBuyNow} className="btn btn-secondary btn-lg">
                Comprar ahora
              </button>
              <button
                type="button"
                onClick={() => toast.info('Agregado a wishlist')}
                className="btn btn-secondary btn-lg size-14 p-0"
                aria-label="Agregar a la wishlist"
              >
                <Heart className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Reassurance */}
            <ul className="mt-8 grid gap-4 border-t border-sand/60 pt-8 sm:grid-cols-2">
              {reassurances.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-dark/75">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14 lg:mt-20">
          <div
            role="tablist"
            aria-label="Información del producto"
            className="flex gap-1 overflow-x-auto border-b border-sand/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el; }}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={cn(
                  'min-h-12 shrink-0 border-b-[3px] px-4 font-display text-sm font-semibold transition-colors sm:px-6',
                  activeTab === tab.id
                    ? 'border-iris text-dark'
                    : 'border-transparent text-dark/65 hover:text-dark',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            key={activeTab}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="animate-fade-in pt-8"
          >
            {activeTab === 'description' && (
              <div className={cn('max-w-3xl', richText)} dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === 'specs' && (
              <dl className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: 'Categoría', value: categoryName },
                  { label: 'Stock', value: `${product.stock} unidades` },
                  { label: 'Tipo', value: product.isDigital ? 'Digital' : 'Físico' },
                  { label: 'Tags', value: product.tags.join(', ') || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-mist p-5">
                    <dt className="text-xs uppercase tracking-wider text-dark/65">{label}</dt>
                    <dd className="mt-1 font-display font-semibold text-dark">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {activeTab === 'reviews' && (
              <div className="flex max-w-3xl items-center gap-4 rounded-2xl bg-mist p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-iris">
                  <MessageSquareText className="size-6" aria-hidden="true" />
                </span>
                <p className="text-dark/75">Las reseñas se cargarán desde el backend próximamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileBuyBar
        watch={ctaEl}
        price={
          <>
            <p className="font-display text-xl font-bold leading-tight text-dark">
              {formatPrice(product.price)}
              {/* The button adds the quantity chosen above, so the bar says how many */}
              {quantity > 1 && <span className="ml-1.5 text-xs font-medium text-dark/65">× {quantity}</span>}
            </p>
            {comparePrice !== null && (
              <del className="text-xs text-dark/65">
                <span className="sr-only">Precio anterior: </span>
                {formatPrice(comparePrice)}
              </del>
            )}
          </>
        }
        action={renderAddToCart('btn btn-primary w-full whitespace-normal px-4 text-center')}
      />
    </>
  );
}
