import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ShoppingCart, Heart, ChevronLeft, ChevronRight,
  ChevronDown, LayoutGrid, List as ListIcon, Eye, Star, Sparkles, Package
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice, debounce } from '../lib/utils';
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

  return (
    <div className="pt-2 pb-1">
      <div
        ref={trackRef}
        className="relative h-2 bg-sand rounded-full select-none"
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
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <div
          className="thumb absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing shadow-md z-10"
          style={{ left: `calc(${minPercent}% - 10px)` }}
          onMouseDown={(e) => { e.stopPropagation(); setDragging('min'); }}
          onTouchStart={(e) => { e.stopPropagation(); setDragging('min'); }}
        />
        <div
          className="thumb absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing shadow-md z-10"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
          onMouseDown={(e) => { e.stopPropagation(); setDragging('max'); }}
          onTouchStart={(e) => { e.stopPropagation(); setDragging('max'); }}
        />
      </div>
    </div>
  );
}

/* ─── Star Rating ─── */
function StarRating({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={`${filled ? 'text-warning fill-warning' : half ? 'text-warning fill-warning/50' : 'text-dark/15'}`}
            />
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-dark/50">{rating.toFixed(1)} ({count})</span>
      )}
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

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2">
          <div className="aspect-square sm:aspect-auto bg-sand/20">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-dark/70 capitalize">
                {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name ?? product.category}
              </span>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-sand/50 transition-colors">
                <X className="w-5 h-5 text-dark/50" />
              </button>
            </div>
            <h3 className="font-display text-2xl font-semibold text-dark mb-2">{product.name}</h3>
            <StarRating rating={product.rating} count={product.reviewsCount} size={16} />
            <p className="text-dark/60 text-sm mt-3 line-clamp-3">{product.shortDescription}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-dark/40 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <div className="mt-auto pt-6 flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary transition-colors active:scale-[0.98] shadow-glow"
              >
                <ShoppingCart className="w-4 h-4" /> Agregar al carrito
              </button>
              <Link
                to={`/productos/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-2xl border border-sand px-5 py-3 text-sm font-medium text-dark hover:bg-sand/30 transition-colors"
              >
                Ver más
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Product Card ─── */
function ProductCard({
  product, viewMode, index,
}: { product: Product; viewMode: 'grid' | 'list'; index: number }) {
  const { addItem } = useCartStore();
  const [wished, setWished] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}`, type: 'product', itemId: product.id,
      name: product.name, image: product.images[0], price: product.price, quantity: 1, isDigital: product.isDigital,
    });
    toast.success('Producto agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const isNew = useMemo(() => {
    const created = new Date(product.createdAt);
    return (Date.now() - created.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }, [product.createdAt]);

  const categoryLabel = PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name ?? product.category;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group"
      >
        <div className="flex flex-col sm:flex-row rounded-2xl bg-white border border-sand/50 overflow-hidden shadow-[0_4px_20px_rgba(152,172,248,0.08)] hover:shadow-[0_16px_40px_rgba(152,172,248,0.2)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
          <Link to={`/productos/${product.slug}`} className="relative sm:w-56 aspect-square sm:aspect-auto shrink-0 overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            {discount > 0 && (
              <span className="absolute top-3 left-3 rounded-lg bg-error text-white text-[11px] font-bold px-2.5 py-1 shadow-md">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="absolute top-3 left-3 mt-7 rounded-lg bg-primary text-white text-[11px] font-bold px-2.5 py-1 shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Destacado
              </span>
            )}
          </Link>
          <div className="p-5 flex flex-col flex-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/20 text-dark/70 self-start mb-2">{categoryLabel}</span>
            <Link to={`/productos/${product.slug}`}>
              <h3 className="font-body font-bold text-dark group-hover:text-primary transition-colors line-clamp-2 text-lg">{product.name}</h3>
            </Link>
            <StarRating rating={product.rating} count={product.reviewsCount} />
            <p className="text-dark/60 text-sm mt-2 line-clamp-2">{product.shortDescription}</p>
            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.comparePrice && <span className="text-dark/40 line-through text-sm">{formatPrice(product.comparePrice)}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setWished(!wished)} className={`p-2.5 rounded-xl border transition-colors ${wished ? 'bg-error/10 border-error/30 text-error' : 'border-sand hover:bg-sand/30 text-dark/50'}`}>
                  <Heart className={`w-4 h-4 ${wished ? 'fill-error' : ''}`} />
                </button>
                <button onClick={handleAddToCart} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary hover:shadow-glow transition-all active:scale-[0.98]">
                  <ShoppingCart className="w-4 h-4" /> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <div className="relative rounded-2xl bg-white border border-sand/50 overflow-hidden shadow-[0_4px_20px_rgba(152,172,248,0.08)] hover:shadow-[0_16px_40px_rgba(152,172,248,0.2)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col">
        <Link to={`/productos/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="rounded-lg bg-error text-white text-[11px] font-bold px-2.5 py-1 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)', paddingBottom: '8px' }}>
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="rounded-lg bg-primary text-white text-[11px] font-bold px-2.5 py-1 shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Destacado
              </span>
            )}
            {isNew && (
              <span className="rounded-lg bg-success text-white text-[11px] font-bold px-2.5 py-1 shadow-md">Nuevo</span>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <span className="rounded-lg bg-error/80 text-white text-[11px] font-bold px-2.5 py-1 shadow-md">Últimas unidades</span>
            )}
          </div>
          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {product.isDigital && (
              <span className="rounded-lg bg-secondary/90 text-white text-[11px] font-bold px-2.5 py-1 shadow-md">Digital</span>
            )}
          </div>
          {/* Hover actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.preventDefault(); setQuickView(true); }}
              className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:bg-primary hover:text-white transition-all text-dark/70"
              aria-label="Vista rápida"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setWished(!wished); }}
              className={`p-2.5 rounded-full backdrop-blur-sm shadow-md transition-all ${wished ? 'bg-error text-white' : 'bg-white/95 text-dark/70 hover:text-error'}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-white' : ''}`} />
            </button>
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-dark/70 self-start mb-1.5">{categoryLabel}</span>
          <Link to={`/productos/${product.slug}`}>
            <h3 className="font-body font-bold text-dark group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1.5">
            <StarRating rating={product.rating} count={product.reviewsCount} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-dark/40 text-sm line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-auto pt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-secondary hover:shadow-glow transition-all duration-300 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" /> Agregar al carrito
          </button>
        </div>
      </div>
      <AnimatePresence>
        {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row rounded-2xl bg-white border border-sand/50 overflow-hidden animate-pulse">
        <div className="sm:w-56 aspect-square bg-sand/50" />
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="h-3 bg-sand/50 rounded w-20" />
          <div className="h-5 bg-sand/50 rounded w-3/4" />
          <div className="h-3 bg-sand/50 rounded w-32" />
          <div className="h-3 bg-sand/50 rounded w-full" />
          <div className="h-3 bg-sand/50 rounded w-2/3" />
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="h-6 bg-sand/50 rounded w-24" />
            <div className="h-9 bg-sand/50 rounded w-28" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white border border-sand/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-sand/50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-sand/50 rounded w-16" />
        <div className="h-4 bg-sand/50 rounded w-3/4" />
        <div className="h-3 bg-sand/50 rounded w-24" />
        <div className="h-6 bg-sand/50 rounded w-20" />
        <div className="h-9 bg-sand/50 rounded w-full" />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 col-span-full"
    >
      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-sand/30 flex items-center justify-center">
        <Package className="w-10 h-10 text-dark/20" />
      </div>
      <h3 className="font-display text-xl font-medium text-dark mb-2">No encontramos productos con esos filtros</h3>
      <p className="text-dark/60 mb-6 max-w-sm mx-auto">Probá ajustando los filtros o buscando con otros términos.</p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary transition-colors shadow-glow"
      >
        <X className="w-4 h-4" /> Limpiar filtros
      </button>
    </motion.div>
  );
}

/* ─── Breadcrumbs ─── */
function Breadcrumbs() {
  return (
    <nav className="flex items-center gap-2 text-sm text-dark/50 mb-3">
      <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
      <span className="text-accent">/</span>
      <span className="text-dark font-medium">Productos</span>
    </nav>
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
    (searchParams.get('tipo') as any) ?? 'all'
  );
  const [onSale, setOnSale] = useState(searchParams.get('ofertas') === 'true');
  const [inStock, setInStock] = useState(searchParams.get('stock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('orden') ?? 'relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(Number(searchParams.get('pagina') ?? 1));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
    if (onSale) chips.push({ key: 'sale', label: 'Solo ofertas 🔥', onRemove: () => setOnSale(false) });
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

  /* ── Sidebar content ── */
  const renderFilters = (onClose?: () => void) => (
    <div className="space-y-0">
      {/* Search */}
      <div className="pb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
          <input
            type="text"
            placeholder="Buscá agendas, tazas, invitaciones..."
            value={search}
            onChange={(e) => { updateSearch(e.target.value); }}
            className="w-full rounded-xl border border-sand bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-sand pt-5 mt-5">
        <h4 className="font-display font-semibold text-dark mb-3">Categorías</h4>
        <div className="space-y-2.5">
          {PRODUCT_CATEGORIES.map((cat) => {
            const checked = selectedCategories.includes(cat.id as ProductCategory);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-3 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors group"
              >
                <button
                  onClick={() => toggleCategory(cat.id as ProductCategory)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    checked ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary/50'
                  }`}
                >
                  {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <span className="flex-1">{cat.name}</span>
                <span className="text-xs text-dark/40">({categoryCounts[cat.id] ?? 0})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Product type */}
      <div className="border-t border-sand pt-5 mt-5">
        <h4 className="font-display font-semibold text-dark mb-3">Tipo</h4>
        <div className="flex p-1 bg-sand/30 rounded-xl">
          {(['all', 'physical', 'digital'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setProductType(t); setPage(1); }}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${
                productType === t ? 'bg-white text-dark shadow-sm' : 'text-dark/50 hover:text-dark'
              }`}
            >
              {t === 'all' ? 'Todos' : t === 'physical' ? 'Físicos' : 'Digitales'}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-sand pt-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-semibold text-dark">Precio</h4>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
        <DualRangeSlider
          min={catalogMinPrice} max={catalogMaxPrice} value={priceRange}
          onChange={(v) => { setPriceRange(v); setPage(1); }}
        />
      </div>

      {/* On sale */}
      <div className="border-t border-sand pt-5 mt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-dark/70">Solo productos en oferta 🔥</span>
          <button
            onClick={() => { setOnSale(!onSale); setPage(1); }}
            className={`relative w-11 h-6 rounded-full transition-colors ${onSale ? 'bg-primary' : 'bg-sand'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${onSale ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* In stock */}
      <div className="border-t border-sand pt-5 mt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-dark/70">Solo en stock</span>
          <button
            onClick={() => { setInStock(!inStock); setPage(1); }}
            className={`relative w-11 h-6 rounded-full transition-colors ${inStock ? 'bg-primary' : 'bg-sand'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${inStock ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* Clear */}
      {hasFilters && (
        <div className="border-t border-sand pt-5 mt-5">
          <button
            onClick={() => { clearFilters(); onClose?.(); }}
            className="text-sm text-secondary hover:underline font-medium"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );

  const showingFrom = filteredProducts.length ? (page - 1) * perPage + 1 : 0;
  const showingTo = Math.min(page * perPage, filteredProducts.length);

  return (
    <>
      <SEO title="Productos" description="Explorá nuestros productos personalizados, sublimables, archivos digitales y más." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark">Productos</h1>
            <p className="text-dark/60 mt-1 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
              {filteredProducts.length > 0 && ` — Mostrando ${showingFrom}-${showingTo}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-sand/30 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-dark' : 'text-dark/40 hover:text-dark'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-dark' : 'text-dark/40 hover:text-dark'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-sand bg-white pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {activeChips.map(chip => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 hover:bg-primary/20 transition-colors"
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={clearFilters} className="text-xs text-secondary hover:underline font-medium px-1">
              Limpiar todo
            </button>
          </motion.div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand p-6 shadow-soft">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl font-semibold text-dark">Filtros</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-secondary hover:underline font-medium">
                    Limpiar todo
                  </button>
                )}
              </div>
              {renderFilters()}
            </div>
          </aside>

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl lg:hidden overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between p-5 border-b border-sand shrink-0">
                    <h3 className="font-display font-semibold text-lg">Filtros</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-sand/50">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto p-5">
                    {renderFilters(() => setMobileFiltersOpen(false))}
                  </div>
                  <div className="p-5 border-t border-sand shrink-0">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white hover:bg-secondary transition-colors"
                    >
                      Ver {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                : 'flex flex-col gap-4'
              }>
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} viewMode={viewMode} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1' : 'flex flex-col'}>
                <EmptyState onClear={clearFilters} />
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                  : 'flex flex-col gap-4'
                }>
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                    <p className="text-sm text-dark/50 order-2 sm:order-1">
                      Página {page} de {totalPages} — {filteredProducts.length} resultados
                    </p>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-sand hover:bg-sand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" /> Anterior
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const p = i + 1;
                          const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                          const showEllipsis = (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2);
                          if (showEllipsis) return <span key={p} className="w-8 h-8 flex items-center justify-center text-dark/30 text-sm">...</span>;
                          if (!show) return null;
                          return (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                                page === p ? 'bg-primary text-white shadow-glow' : 'hover:bg-sand/50 text-dark/70'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-sand hover:bg-sand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter FAB */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-dark text-white px-5 py-3 shadow-lg hover:bg-dark/90 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filtros</span>
        {filterCount > 0 && (
          <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>

      {/* Quick view modal (global) */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
