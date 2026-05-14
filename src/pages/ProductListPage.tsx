import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice, debounce } from '../lib/utils';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import type { Product, ProductCategory } from '../types';
import { toast } from 'sonner';

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        search: search || undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: inStock || undefined,
        sortBy: sortBy as any,
      });
      setProducts(data);
    } catch {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, minPrice, maxPrice, inStock, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const debouncedSearch = useCallback(debounce((val: string) => {
    setSearchParams(prev => { if (val) prev.set('search', val); else prev.delete('search'); return prev; });
    setPage(1);
  }, 400), []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    debouncedSearch(val);
  };

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSortBy('newest');
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const hasFilters = search || selectedCategories.length || minPrice || maxPrice || inStock || sortBy !== 'newest';

  const totalPages = Math.ceil(products.length / perPage);
  const paginated = products.slice((page - 1) * perPage, page * perPage);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `cart-${product.id}`,
      type: 'product',
      itemId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      isDigital: product.isDigital,
    });
    toast.success('Producto agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-display font-medium text-dark mb-3">Buscar</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
          <input
            type="text"
            placeholder="¿Qué buscás?"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <h4 className="font-display font-medium text-dark mb-3">Categorías</h4>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id as ProductCategory)}
                onChange={() => toggleCategory(cat.id as ProductCategory)}
                className="rounded border-sand text-primary focus:ring-primary"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display font-medium text-dark mb-3">Precio</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="text-dark/40">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="rounded border-sand text-primary focus:ring-primary"
          />
          Solo en stock
        </label>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-error hover:underline"
        >
          <X className="w-4 h-4" /> Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <SEO title="Productos" description="Explorá nuestros productos personalizados, sublimables, archivos digitales y más." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark">Productos</h1>
            <p className="text-dark/60 mt-1">{products.length} resultados</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand/50 p-6 shadow-soft">
              <FiltersContent />
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold">Filtros</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FiltersContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-sand/50 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-sand/50" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-sand/50 rounded w-3/4" />
                      <div className="h-4 bg-sand/50 rounded w-1/2" />
                      <div className="h-8 bg-sand/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-sand/50 flex items-center justify-center">
                  <Search className="w-8 h-8 text-dark/30" />
                </div>
                <h3 className="font-display text-xl font-medium text-dark mb-2">No encontramos productos</h3>
                <p className="text-dark/60 mb-6">Probá con otros filtros o términos de búsqueda.</p>
                <button onClick={clearFilters} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-secondary transition-colors">
                  <X className="w-4 h-4" /> Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group"
                    >
                      <div className="rounded-2xl bg-white border border-sand/50 shadow-soft hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                        <Link to={`/productos/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          {product.comparePrice && (
                            <span className="absolute top-3 left-3 rounded-full bg-error/90 text-white text-xs font-bold px-3 py-1">
                              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                            </span>
                          )}
                          {product.isDigital && (
                            <span className="absolute top-3 right-3 rounded-full bg-primary/90 text-white text-xs font-bold px-3 py-1">
                              Digital
                            </span>
                          )}
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Wishlist"
                          >
                            <Heart className="w-4 h-4 text-dark/70" />
                          </button>
                        </Link>
                        <div className="p-4">
                          <Link to={`/productos/${product.slug}`}>
                            <h3 className="font-display font-medium text-dark group-hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                            {product.comparePrice && (
                              <span className="text-dark/40 text-sm line-through">{formatPrice(product.comparePrice)}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-sand/50 py-2.5 text-sm font-medium text-dark hover:bg-primary hover:text-white transition-colors active:scale-[0.98]"
                          >
                            <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-full border border-sand hover:bg-sand/50 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          page === i + 1 ? 'bg-primary text-white' : 'hover:bg-sand/50 text-dark/70'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-full border border-sand hover:bg-sand/50 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
