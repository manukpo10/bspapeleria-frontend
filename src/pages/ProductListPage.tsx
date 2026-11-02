import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ShoppingCart, ChevronLeft, ChevronRight,
  ChevronDown, LayoutGrid, List as ListIcon, SearchX
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { ProductCard } from '../components/shared/ProductCard';
import { StarRating } from '../components/shared/StarRating';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { cn, formatPrice } from '../lib/utils';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import { isDigitalResource } from '../lib/storefront';
import type { Product } from '../types';
import { toast } from 'sonner';

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

const PAGE_DESCRIPTION = 'Archivos y diseños listos para usar en tus proyectos de papelería. Ahorrá tiempo y dedicate a crear.';

const iconButton =
  'grid size-11 shrink-0 place-items-center rounded-full text-dark/75 transition-colors hover:bg-sand/40 hover:text-dark';
const pageButton = 'grid size-11 place-items-center rounded-full text-sm font-semibold transition-colors';
const skeletonBlock = 'animate-pulse rounded-full bg-sand/40';

/* Closes an overlay with the Escape key while it is open */
function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, onEscape]);
}

/* ─── Quick View Modal ─── */
function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCartStore();
  const handleAdd = () => {
    addItem({
      id: `cart-${product.id}`, type: 'product', itemId: product.id,
      name: product.name, image: product.images[0], price: product.price, quantity: 1, isDigital: product.isDigital,
    });
    toast.success('Producto agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  useEscapeKey(true, onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2">
          <div className="aspect-square bg-sand/40 sm:aspect-auto">
            <img src={product.images[0]} alt={product.name} className="size-full object-cover" />
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <span className="chip bg-mist text-iris">
                {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name ?? product.category}
              </span>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                aria-label="Cerrar vista rápida"
                className={cn(iconButton, '-mr-2 -mt-2')}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <h2 id="quick-view-title" className="mt-3 font-display text-2xl font-bold leading-snug text-dark">
              {product.name}
            </h2>
            {product.reviewsCount > 0 && (
              <StarRating className="mt-2" rating={product.rating} count={product.reviewsCount} size={18} />
            )}
            <p className="mt-4 line-clamp-3 text-sm text-dark/75">{product.shortDescription}</p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-2xl font-bold text-dark">{formatPrice(product.price)}</span>
              {product.comparePrice != null && product.comparePrice > product.price ? (
                <del className="text-dark/65">
                  <span className="sr-only">Precio anterior: </span>
                  {formatPrice(product.comparePrice)}
                </del>
              ) : null}
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <button type="button" onClick={handleAdd} className="btn btn-primary w-full">
                <ShoppingCart className="size-4" aria-hidden="true" /> Agregar al carrito
              </button>
              <Link to={`/productos/${product.slug}`} onClick={onClose} className="btn btn-secondary w-full">
                Ver más
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="card flex flex-col overflow-hidden sm:flex-row" aria-hidden="true">
        <div className="aspect-square animate-pulse bg-sand/40 sm:aspect-auto sm:min-h-56 sm:w-56 sm:shrink-0" />
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className={cn(skeletonBlock, 'h-3 w-24')} />
          <div className={cn(skeletonBlock, 'h-5 w-3/4')} />
          <div className={cn(skeletonBlock, 'h-3 w-32')} />
          <div className={cn(skeletonBlock, 'h-3 w-full')} />
          <div className="mt-auto flex items-center justify-between gap-4 pt-2">
            <div className={cn(skeletonBlock, 'h-6 w-24')} />
            <div className={cn(skeletonBlock, 'h-11 w-44')} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-square animate-pulse bg-sand/40" />
      <div className="space-y-3 p-3 sm:p-5">
        <div className={cn(skeletonBlock, 'h-3 w-24')} />
        <div className={cn(skeletonBlock, 'h-4 w-4/5')} />
        <div className={cn(skeletonBlock, 'h-3 w-32')} />
        <div className={cn(skeletonBlock, 'h-6 w-2/5')} />
        <div className={cn(skeletonBlock, 'h-11 w-full')} />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
      <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
        <SearchX className="size-9" aria-hidden="true" />
      </span>
      <h3 className="mt-6 font-display text-xl font-semibold text-dark">No encontramos recursos con esa búsqueda</h3>
      <p className="mt-2 max-w-sm text-dark/75">Probá buscando con otros términos.</p>
      <button type="button" onClick={onClear} className="btn btn-secondary mt-6">
        <X className="size-4" aria-hidden="true" /> Limpiar búsqueda
      </button>
    </div>
  );
}

/* ════════════════════════════════════════ */
/* ═══════ MAIN PAGE ══════════════════════ */
/* ════════════════════════════════════════ */

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── State from URL ── */
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [urlSearch, setUrlSearch] = useState(searchParams.get('search') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('orden') ?? 'relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(Number(searchParams.get('pagina') ?? 1));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // Where focus was before the quick view opened, so closing it puts the keyboard user back
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // The header search navigates here with ?search= while this page may already be open. Only a value this page
  // did not write itself is adopted, so the debounced field below is not overwritten as it syncs to the URL
  const searchFromUrl = searchParams.get('search') ?? '';
  const [lastSearchFromUrl, setLastSearchFromUrl] = useState(searchFromUrl);
  if (searchFromUrl !== lastSearchFromUrl) {
    setLastSearchFromUrl(searchFromUrl);
    if (searchFromUrl !== urlSearch) {
      setSearch(searchFromUrl);
      setUrlSearch(searchFromUrl);
      setPage(1);
    }
  }

  const perPage = 12;

  /* ── Fetch the catalog: the storefront lists digital resources only (the admin panel lists everything) ── */
  useEffect(() => {
    let cancelled = false;
    api.getProducts().then(data => {
      if (!cancelled) {
        setAllProducts(data.filter(isDigitalResource));
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /* ── Filtering ── */
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (urlSearch) {
      const q = urlSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [allProducts, urlSearch, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const paginated = filteredProducts.slice((page - 1) * perPage, page * perPage);

  /* ── URL sync ── */
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (urlSearch) params.set('search', urlSearch);
    if (sortBy !== 'relevance') params.set('orden', sortBy);
    if (page > 1) params.set('pagina', String(page));
    return params;
  }, [urlSearch, sortBy, page]);

  useEffect(() => {
    setSearchParams(buildParams());
  }, [buildParams, setSearchParams]);

  /* ── Debounced search ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setUrlSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  /* ── Quick view: remember and restore focus ── */
  const openQuickView = (product: Product) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setQuickViewProduct(product);
  };
  const closeQuickView = () => {
    setQuickViewProduct(null);
    lastFocusRef.current?.focus();
  };

  // The grid has the full width now (no sidebar), so it gains a fourth column on wide screens
  const gridClass = viewMode === 'grid'
    ? 'grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'
    : 'flex flex-col gap-6';

  return (
    <>
      <SEO title="Recursos digitales" description={PAGE_DESCRIPTION} />
      <PageHeader
        title="Recursos digitales"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Recursos digitales' }]}
        description={PAGE_DESCRIPTION}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Toolbar: the search on the left, view and sort on the right (under the search on phones) */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="product-search" className="sr-only">Buscar recursos</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55" aria-hidden="true" />
            <input
              id="product-search"
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Buscá recursos y plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field pl-12"
            />
          </div>

          <div className="flex min-w-0 items-center gap-3">
            {/* View toggle */}
            <div role="group" aria-label="Vista" className="hidden items-center gap-1 rounded-full bg-sand/30 p-1 sm:flex">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                aria-label="Vista en cuadrícula"
                className={cn(
                  'grid size-11 place-items-center rounded-full transition-all',
                  viewMode === 'grid' ? 'bg-white text-dark shadow-soft' : 'text-dark/65 hover:text-dark',
                )}
              >
                <LayoutGrid className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                aria-label="Vista en lista"
                className={cn(
                  'grid size-11 place-items-center rounded-full transition-all',
                  viewMode === 'list' ? 'bg-white text-dark shadow-soft' : 'text-dark/65 hover:text-dark',
                )}
              >
                <ListIcon className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Sort */}
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <label htmlFor="product-sort" className="sr-only">Ordenar por</label>
              <select
                id="product-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="field cursor-pointer appearance-none pr-11 hover:border-secondary"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-dark/65" aria-hidden="true" />
            </div>
          </div>
        </div>

        <h2 className="sr-only">Listado de recursos</h2>
        {loading ? (
          <div role="status">
            <span className="sr-only">Cargando recursos…</span>
            <div className={gridClass}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} viewMode={viewMode} />)}
            </div>
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState onClear={clearSearch} />
        ) : (
          <>
            <div className={gridClass}>
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={viewMode}
                  detailed
                  onQuickView={viewMode === 'grid' ? openQuickView : undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Paginación" className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="order-2 text-sm text-dark/65 sm:order-1">
                  Página {page} de {totalPages} — {filteredProducts.length} resultados
                </p>
                <div className="order-1 flex items-center gap-1.5 sm:order-2">
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Página anterior"
                    className="btn btn-secondary size-11 p-0"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const showEllipsis = (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2);
                    if (showEllipsis) {
                      return (
                        <span key={p} aria-hidden="true" className="grid size-11 place-items-center text-sm text-dark/65 max-sm:hidden">
                          ...
                        </span>
                      );
                    }
                    if (!show) return null;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        aria-label={`Ir a la página ${p}`}
                        aria-current={page === p ? 'page' : undefined}
                        className={cn(
                          pageButton,
                          page === p ? 'bg-dark text-white shadow-soft' : 'text-dark/75 hover:bg-sand/40 hover:text-dark max-sm:hidden',
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Página siguiente"
                    className="btn btn-secondary size-11 p-0"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Quick view modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
        )}
      </AnimatePresence>
    </>
  );
}
