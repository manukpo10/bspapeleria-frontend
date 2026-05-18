import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, Star, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProductBySlug(slug).then((p) => {
      setProduct(p ?? null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-sand/50 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-sand/50 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-sand/50 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-sand/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-sand/50 rounded w-5/6 animate-pulse" />
            <div className="h-12 bg-sand/50 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-2xl text-dark mb-4">Producto no encontrado</h1>
        <Link to="/productos" className="text-primary hover:underline">Ver todos los productos</Link>
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

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} image={product.images[0]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand/20 border border-sand/50">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-warning fill-warning' : 'text-dark/20'}`} />
                  ))}
                </div>
                <span className="text-sm text-dark/60">({product.reviewsCount} reseñas)</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-semibold text-primary">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-xl text-dark/40 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>

              <p className="text-dark/70 mb-8 leading-relaxed">{product.shortDescription}</p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-dark/60">Cantidad</span>
                <div className="flex items-center gap-2 rounded-xl border border-sand bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-sand/50 rounded-l-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-sand/50 rounded-r-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="text-xs text-warning">¡Solo quedan {product.stock}!</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-secondary hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-dark py-3.5 text-sm font-semibold text-white hover:bg-dark/90 transition-all active:scale-[0.98]"
                >
                  Comprar ahora
                </button>
                <button
                  onClick={() => toast.info('Agregado a wishlist')}
                  className="p-3.5 rounded-2xl border border-sand hover:bg-sand/50 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-dark/70" />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <Truck className="w-4 h-4 text-primary" /> Envío a todo el país
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <Shield className="w-4 h-4 text-primary" /> Pago seguro
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <RotateCcw className="w-4 h-4 text-primary" /> 10 días de devolución
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60">
                  <Check className="w-4 h-4 text-success" /> {product.stock > 0 ? 'En stock' : 'Sin stock'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 border-b border-sand/50 mb-6">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? 'text-primary' : 'text-dark/60 hover:text-dark'
                }`}
              >
                {tab === 'description' ? 'Descripción' : tab === 'specs' ? 'Especificaciones' : 'Reseñas'}
                {activeTab === tab && (
                  <motion.div layoutId="product-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && (
              <div className="max-w-3xl text-dark/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-sand/20 p-4">
                    <span className="text-xs text-dark/50 uppercase tracking-wider">Categoría</span>
                    <p className="font-medium text-dark mt-1">{product.category}</p>
                  </div>
                  <div className="rounded-xl bg-sand/20 p-4">
                    <span className="text-xs text-dark/50 uppercase tracking-wider">Stock</span>
                    <p className="font-medium text-dark mt-1">{product.stock} unidades</p>
                  </div>
                  <div className="rounded-xl bg-sand/20 p-4">
                    <span className="text-xs text-dark/50 uppercase tracking-wider">Tipo</span>
                    <p className="font-medium text-dark mt-1">{product.isDigital ? 'Digital' : 'Físico'}</p>
                  </div>
                  <div className="rounded-xl bg-sand/20 p-4">
                    <span className="text-xs text-dark/50 uppercase tracking-wider">Tags</span>
                    <p className="font-medium text-dark mt-1">{product.tags.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                <p className="text-dark/60">Las reseñas se cargarán desde el backend próximamente.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
