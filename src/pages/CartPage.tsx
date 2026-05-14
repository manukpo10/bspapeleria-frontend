import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, couponCode, couponDiscount, removeCoupon } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <SEO title="Carrito" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <Package className="w-16 h-16 text-dark/20 mb-4" />
          <h1 className="font-display text-2xl text-dark mb-2">Tu carrito está vacío</h1>
          <p className="text-dark/60 mb-6">Agregá productos o cursos para comenzar.</p>
          <Link to="/productos" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-secondary transition-colors">
            <ArrowRight className="w-4 h-4" /> Ver productos
          </Link>
        </div>
      </>
    );
  }

  const hasPhysical = items.some((i) => !i.isDigital);
  const shipping = hasPhysical ? 1500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + shipping - couponDiscount;

  return (
    <>
      <SEO title="Carrito" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-dark mb-8">Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 rounded-2xl bg-white border border-sand/50 p-4"
              >
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-medium text-dark">{item.name}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isDigital ? 'bg-primary/10 text-primary' : 'bg-sand/50 text-dark/60'}`}>
                        {item.isDigital ? 'Digital' : 'Físico'}
                      </span>
                    </div>
                    <button
                      onClick={() => { removeItem(item.id); toast.info('Producto eliminado'); }}
                      className="p-2 rounded-full hover:bg-error/10 text-dark/40 hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 rounded-xl border border-sand">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-sand/50 rounded-l-xl">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-sand/50 rounded-r-xl">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand/50 shadow-soft p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Resumen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {hasPhysical && (
                  <div className="flex justify-between text-dark/70">
                    <span>Envío</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Descuento ({couponCode})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-sand/50 flex justify-between font-semibold text-dark">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full text-center rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors active:scale-[0.98]"
              >
                Ir al checkout
              </Link>

              {couponCode && (
                <button onClick={removeCoupon} className="mt-3 text-xs text-error hover:underline w-full text-center">
                  Eliminar cupón
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
