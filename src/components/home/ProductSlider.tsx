import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { toast } from 'sonner';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  script?: string;
  products: Product[];
}

export function ProductSlider({ title, subtitle, script, products }: ProductSliderProps) {
  const { addItem } = useCartStore();

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

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            {script && <span className="block font-script text-xl text-secondary mb-1">{script}</span>}
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">{title}</h2>
            {subtitle && <p className="text-dark/60 mt-2">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button className="swiper-prev-btn p-2 rounded-full border border-sand hover:bg-sand/50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-next-btn p-2 rounded-full border border-sand hover:bg-sand/50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{ prevEl: '.swiper-prev-btn', nextEl: '.swiper-next-btn' }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group h-full"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white border border-sand/50 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <Link to={`/productos/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {product.comparePrice && (
                      <span className="absolute top-3 left-3 rounded-full bg-error/90 text-white text-xs font-bold px-3 py-1 shadow-md">
                        -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                      </span>
                    )}
                    {product.isDigital && (
                      <span className="absolute top-3 right-3 rounded-full bg-primary/90 text-white text-xs font-bold px-3 py-1 shadow-md">
                        Digital
                      </span>
                    )}
                    {/* Wishlist button - always visible on mobile, hover on desktop */}
                    <button
                      onClick={(e) => { e.preventDefault(); /* toggle wishlist */ }}
                      className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                      aria-label="Agregar a wishlist"
                    >
                      <Heart className="w-4 h-4 text-dark/70 hover:text-error transition-colors" />
                    </button>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col">
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
                    <div className="mt-auto pt-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-sand/50 py-2.5 text-sm font-medium text-dark hover:bg-primary hover:text-white transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
