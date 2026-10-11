import { useState, useEffect, useCallback, useRef, useMemo, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ShoppingCart, ChevronLeft, ChevronRight,
  ChevronDown, LayoutGrid, List as ListIcon, SearchX, BadgePercent, Check
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
import type { Product, ProductCategory } from '../types';
import { toast } from 'sonner';

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

const sectionTitle = 'font-display text-sm font-semibold text-dark';
const sectionDivider = 'mt-5 border-t border-sand/60 pt-5';
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

/* ─── Dual Range Slider ─── */
function DualRangeSlider({
  min, max, value, onChange,
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const valueRef = useRef(value);

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawVal = Math.round(min + pct * (max - min));
      const current = valueRef.current;
      if (dragging === 'min') {
        onChange([Math.min(rawVal, current[1] - 1), current[1]]);
      } else {
        onChange([current[0], Math.max(rawVal, current[0] + 1)]);
      }
    };
    const handleUp = () => setDragging(null);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [dragging, min, max, onChange]);

  // Arrow keys move a focused thumb, keeping the same one-unit gap the drag enforces
  const handleKeyDown = (thumb: 'min' | 'max') => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = Math.max(1, Math.round((max - min) / 100));
    let delta: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'PageUp':
        delta = step * 10;
        break;
      case 'PageDown':
        delta = -step * 10;
        break;
      case 'Home':
        delta = -Infinity;
        break;
      case 'End':
        delta = Infinity;
        break;
      default:
        return;
    }
    e.preventDefault();
    const [lo, hi] = value;
    if (thumb === 'min') {
      onChange([Math.max(min, Math.min(lo + delta, hi - 1)), hi]);
    } else {
      onChange([lo, Math.min(max, Math.max(hi + delta, lo + 1))]);
    }
  };

  // The thumb is a 44px hit area around a 24px knob; the knob draws the focus ring
  const thumbClass =
    'thumb group absolute top-1/2 grid size-11 -translate-y-1/2 cursor-grab place-items-center outline-none active:cursor-grabbing';
  const knobClass =
    'size-6 rounded-full border-2 border-iris bg-white shadow-soft transition-shadow group-hover:shadow-lift group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-iris';

  return (
    <div
      ref={trackRef}
      className="relative h-11 touch-none select-none"
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.thumb')) return;
        const rect = trackRef.current!.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
        setDragging(pct < mid ? 'min' : 'max');
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.thumb')) return;
        const rect = trackRef.current!.getBoundingClientRect();
        const pct = (e.touches[0].clientX - rect.left) / rect.width;
        const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
        setDragging(pct < mid ? 'min' : 'max');
      }}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-sand">
        <div
          className="absolute h-2 rounded-full bg-iris"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Precio mínimo"
        aria-valuemin={min}
        aria-valuemax={value[1] - 1}
        aria-valuenow={value[0]}
        aria-valuetext={formatPrice(value[0])}
        className={thumbClass}
        style={{ left: `calc(${minPercent}% - 22px)` }}
        onMouseDown={(e) => { e.stopPropagation(); setDragging('min'); }}
        onTouchStart={(e) => { e.stopPropagation(); setDragging('min'); }}
        onKeyDown={handleKeyDown('min')}
      >
        <span aria-hidden="true" className={knobClass} />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Precio máximo"
        aria-valuemin={value[0] + 1}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        aria-valuetext={formatPrice(value[1])}
        className={thumbClass}
        style={{ left: `calc(${maxPercent}% - 22px)` }}
        onMouseDown={(e) => { e.stopPropagation(); setDragging('max'); }}
        onTouchStart={(e) => { e.stopPropagation(); setDragging('max'); }}
        onKeyDown={handleKeyDown('max')}
      >
        <span aria-hidden="true" className={knobClass} />
      </div>
    </div>
  );
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
      <h3 className="mt-6 font-display text-xl font-semibold text-dark">No encontramos productos con esos filtros</h3>
      <p className="mt-2 max-w-sm text-dark/75">Probá ajustando los filtros o buscando con otros términos.</p>
      <button type="button" onClick={onClear} className="btn btn-secondary mt-6">
        <X className="size-4" aria-hidden="true" /> Limpiar filtros
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
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    searchParams.get('categoria')?.split(',').filter(Boolean) as ProductCategory[] ?? []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('precio_min') ?? 0),
    Number(searchParams.get('precio_max') ?? 999999),
  ]);
  const [productType, setProductType] = useState<'all' | 'physical' | 'digital'>(
    (searchParams.get('tipo') as 'all' | 'physical' | 'digital' | null) ?? 'all'
  );
  const [onSale, setOnSale] = useState(searchParams.get('ofertas') === 'true');
  const [inStock, setInStock] = useState(searchParams.get('stock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('orden') ?? 'relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(Number(searchParams.get('pagina') ?? 1));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // Where focus was before an overlay opened, so closing it puts the keyboard user back
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const perPage = 12;

  /* ── Fetch all products (to compute price range & category counts) ── */
  useEffect(() => {
    let cancelled = false;
    api.getProducts().then(data => {
      if (!cancelled) {
        setAllProducts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /* ── Computed catalog price bounds ── */
  const catalogMinPrice = useMemo(() => allProducts.length ? Math.min(...allProducts.map(p => p.price)) : 0, [allProducts]);
  const catalogMaxPrice = useMemo(() => allProducts.length ? Math.max(...allProducts.map(p => p.price)) : 999999, [allProducts]);

  /* ── Sync price range when catalog loads ── */
  useEffect(() => {
    if (allProducts.length && priceRange[1] === 999999) {
      setPriceRange([catalogMinPrice, catalogMaxPrice]);
    }
  }, [allProducts, catalogMinPrice, catalogMaxPrice]);

  /* ── Filtering ── */
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (urlSearch) {
      const q = urlSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (productType === 'digital') result = result.filter(p => p.isDigital);
    if (productType === 'physical') result = result.filter(p => !p.isDigital);
    if (onSale) result = result.filter(p => p.comparePrice && p.comparePrice > p.price);
    if (inStock) result = result.filter(p => p.stock > 0);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [allProducts, urlSearch, selectedCategories, priceRange, productType, onSale, inStock, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const paginated = filteredProducts.slice((page - 1) * perPage, page * perPage);

  /* ── Category counts (from all products, unfiltered) ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [allProducts]);

  /* ── Active filter chips ── */
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (urlSearch) chips.push({ key: 'search', label: `Búsqueda: "${urlSearch}"`, onRemove: () => updateSearch('') });
    selectedCategories.forEach(cat => {
      const name = PRODUCT_CATEGORIES.find(c => c.id === cat)?.name ?? cat;
      chips.push({ key: `cat-${cat}`, label: name, onRemove: () => toggleCategory(cat) });
    });
    if (priceRange[0] > catalogMinPrice || priceRange[1] < catalogMaxPrice) {
      chips.push({ key: 'price', label: `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`, onRemove: () => setPriceRange([catalogMinPrice, catalogMaxPrice]) });
    }
    if (productType !== 'all') {
      chips.push({ key: 'type', label: productType === 'digital' ? 'Digitales' : 'Físicos', onRemove: () => setProductType('all') });
    }
    if (onSale) chips.push({ key: 'sale', label: 'Solo ofertas', onRemove: () => setOnSale(false) });
    if (inStock) chips.push({ key: 'stock', label: 'En stock', onRemove: () => setInStock(false) });
    return chips;
  }, [urlSearch, selectedCategories, priceRange, productType, onSale, inStock, catalogMinPrice, catalogMaxPrice]);

  const filterCount = activeChips.length + (sortBy !== 'relevance' ? 1 : 0);
  const hasFilters = filterCount > 0;

  /* ── URL sync ── */
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (urlSearch) params.set('search', urlSearch);
    if (selectedCategories.length) params.set('categoria', selectedCategories.join(','));
    if (priceRange[0] > catalogMinPrice) params.set('precio_min', String(priceRange[0]));
    if (priceRange[1] < catalogMaxPrice) params.set('precio_max', String(priceRange[1]));
    if (productType !== 'all') params.set('tipo', productType);
    if (onSale) params.set('ofertas', 'true');
    if (inStock) params.set('stock', 'true');
    if (sortBy !== 'relevance') params.set('orden', sortBy);
    if (page > 1) params.set('pagina', String(page));
    return params;
  }, [urlSearch, selectedCategories, priceRange, productType, onSale, inStock, sortBy, page, catalogMinPrice, catalogMaxPrice]);

  useEffect(() => {
    setSearchParams(buildParams());
  }, [buildParams, setSearchParams]);

  /* ── Debounced search ── */
  const updateSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUrlSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceRange([catalogMinPrice, catalogMaxPrice]);
    setProductType('all');
    setOnSale(false);
    setInStock(false);
    setSortBy('relevance');
    setPage(1);
  };

  /* ── Overlays: remember and restore focus, close with Escape ── */
  const openMobileFilters = () => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setMobileFiltersOpen(true);
  };
  const closeMobileFilters = () => {
    setMobileFiltersOpen(false);
    lastFocusRef.current?.focus();
  };
  const openQuickView = (product: Product) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setQuickViewProduct(product);
  };
  const closeQuickView = () => {
    setQuickViewProduct(null);
    lastFocusRef.current?.focus();
  };

  useEscapeKey(mobileFiltersOpen, closeMobileFilters);

  /* ── Filters (shared by the desktop sidebar and the mobile sheet) ── */
  const renderFilters = (idPrefix: string) => (
    <div>
      {/* Search */}
      <div>
        <label htmlFor={`${idPrefix}-search`} className={sectionTitle}>Buscar</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55" aria-hidden="true" />
          <input
            id={`${idPrefix}-search`}
            type="text"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscá agendas, tazas, invitaciones..."
            value={search}
            onChange={(e) => { updateSearch(e.target.value); }}
            className="field pl-12"
          />
        </div>
      </div>

      {/* Categories */}
      <div className={sectionDivider}>
        <fieldset>
          <legend className={sectionTitle}>Categorías</legend>
          <div className="mt-2">
            {PRODUCT_CATEGORIES.map((cat) => {
              const checked = selectedCategories.includes(cat.id as ProductCategory);
              return (
                <label
                  key={cat.id}
                  className="-mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-dark/75 transition-colors hover:bg-mist hover:text-dark"
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={() => toggleCategory(cat.id as ProductCategory)}
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-secondary bg-white text-white transition-colors peer-checked:border-dark peer-checked:bg-dark peer-checked:[&>svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris"
                  >
                    <Check className="size-4 opacity-0 transition-opacity" strokeWidth={3} />
                  </span>
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs text-dark/65">({categoryCounts[cat.id] ?? 0})</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Product type */}
      <div className={sectionDivider}>
        <fieldset>
          <legend className={sectionTitle}>Tipo</legend>
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-sand/30 p-1">
            {(['all', 'physical', 'digital'] as const).map(t => (
              <label key={t} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${idPrefix}-tipo`}
                  className="peer sr-only"
                  checked={productType === t}
                  onChange={() => { setProductType(t); setPage(1); }}
                />
                <span className="flex min-h-11 items-center justify-center rounded-full px-2 text-sm font-medium text-dark/65 transition-all hover:text-dark peer-checked:bg-white peer-checked:text-dark peer-checked:shadow-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris">
                  {t === 'all' ? 'Todos' : t === 'physical' ? 'Físicos' : 'Digitales'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Price */}
      <div className={sectionDivider}>
        <h3 className={sectionTitle}>Precio</h3>
        <p className="mt-1 whitespace-nowrap text-xs font-medium text-dark/65">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </p>
        <div className="mt-2">
          <DualRangeSlider
            min={catalogMinPrice} max={catalogMaxPrice} value={priceRange}
            onChange={(v) => { setPriceRange(v); setPage(1); }}
          />
        </div>
      </div>

      {/* On sale */}
      <div className={sectionDivider}>
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-dark/75">
            <BadgePercent className="size-5 text-iris" aria-hidden="true" /> Solo productos en oferta
          </span>
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={onSale}
            onChange={() => { setOnSale(!onSale); setPage(1); }}
          />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 shrink-0 rounded-full bg-sand ring-1 ring-inset ring-secondary/40 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-6 after:rounded-full after:bg-white after:shadow-soft after:transition-transform peer-checked:bg-dark peer-checked:ring-dark peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris"
          />
        </label>
      </div>

      {/* In stock */}
      <div className="mt-2">
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
          <span className="text-sm text-dark/75">Solo en stock</span>
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={inStock}
            onChange={() => { setInStock(!inStock); setPage(1); }}
          />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 shrink-0 rounded-full bg-sand ring-1 ring-inset ring-secondary/40 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-6 after:rounded-full after:bg-white after:shadow-soft after:transition-transform peer-checked:bg-dark peer-checked:ring-dark peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris"
          />
        </label>
      </div>
    </div>
  );

  const showingFrom = filteredProducts.length ? (page - 1) * perPage + 1 : 0;
  const showingTo = Math.min(page * perPage, filteredProducts.length);

  return (
    <>
      <SEO title="Productos" description="Explorá nuestros productos personalizados, sublimables, archivos digitales y más." />
      <PageHeader
        title="Productos"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Productos' }]}
        description={
          <>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
            {filteredProducts.length > 0 && ` — Mostrando ${showingFrom}-${showingTo}`}
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside aria-labelledby="filters-heading" className="hidden w-80 shrink-0 lg:block">
            <div className="card sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain p-6">
              <div className="mb-5 flex min-h-11 items-center justify-between gap-3">
                <h2 id="filters-heading" className="font-display text-lg font-semibold text-dark">Filtros</h2>
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                    Limpiar filtros
                  </button>
                )}
              </div>
              {renderFilters('desktop')}
            </div>
          </aside>

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  key="filters-scrim"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-dark/45 backdrop-blur-sm lg:hidden"
                  onClick={closeMobileFilters}
                  aria-hidden="true"
                />
                <motion.div
                  key="filters-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="filters-sheet-title"
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[85dvh] flex-col rounded-t-3xl bg-white shadow-lift lg:hidden"
                >
                  <div className="flex items-center gap-2 border-b border-sand/60 py-3 pl-6 pr-4">
                    <h2 id="filters-sheet-title" className="mr-auto font-display text-xl font-semibold text-dark">Filtros</h2>
                    {hasFilters && (
                      <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                        Limpiar filtros
                      </button>
                    )}
                    <button
                      type="button"
                      autoFocus
                      onClick={closeMobileFilters}
                      className={iconButton}
                      aria-label="Cerrar filtros"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
                    {renderFilters('sheet')}
                  </div>
                  <div className="border-t border-sand/60 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                    <button type="button" onClick={closeMobileFilters} className="btn btn-primary btn-lg w-full">
                      Ver {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={openMobileFilters}
                aria-haspopup="dialog"
                aria-expanded={mobileFiltersOpen}
                className="btn btn-secondary shrink-0 lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" /> Filtros
                {filterCount > 0 && (
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-dark px-1.5 text-xs font-bold text-white">
                    {filterCount}
                    <span className="sr-only"> activos</span>
                  </span>
                )}
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
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

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div role="group" aria-label="Filtros aplicados" className="mb-6 flex animate-fade-in flex-wrap items-center gap-2">
                {activeChips.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Quitar filtro: ${chip.label}`}
                    className="btn btn-soft btn-sm min-h-11 max-w-full"
                  >
                    <span className="truncate">{chip.label}</span>
                    <X className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                ))}
                <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                  Limpiar filtros
                </button>
              </div>
            )}

            <h2 className="sr-only">Listado de productos</h2>
            {loading ? (
              <div role="status">
                <span className="sr-only">Cargando productos…</span>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3'
                  : 'flex flex-col gap-6'
                }>
                  {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} viewMode={viewMode} />)}
                </div>
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3'
                  : 'flex flex-col gap-6'
                }>
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
        </div>
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
