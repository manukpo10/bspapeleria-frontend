import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, User, Tag, ChevronRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const { user, isAuthenticated, login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(couponCode);
  const [couponDiscountLocal, setCouponDiscountLocal] = useState(couponDiscount);

  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    street: user?.addresses[0]?.street ?? '',
    city: user?.addresses[0]?.city ?? '',
    province: user?.addresses[0]?.province ?? '',
    zipCode: user?.addresses[0]?.zipCode ?? '',
  });

  const hasPhysical = items.some((i) => !i.isDigital);
  const shipping = hasPhysical ? 1500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + shipping - couponDiscountLocal;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl text-dark mb-2">Tu carrito está vacío</h1>
        <p className="text-dark/60">No podés hacer checkout sin productos.</p>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const result = await api.validateCoupon(couponInput.trim().toUpperCase());
      if (result.valid) {
        setAppliedCoupon(couponInput.trim().toUpperCase());
        const discount = Math.round(subtotal * (result.discount / 100));
        setCouponDiscountLocal(discount);
        toast.success('Cupón aplicado');
      } else {
        toast.error(result.message || 'Cupón inválido');
      }
    } catch {
      toast.error('Error al validar cupón');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.createOrder(
        items,
        hasPhysical ? {
          id: 'temp',
          fullName: formData.name,
          street: formData.street,
          city: formData.city,
          province: formData.province,
          zipCode: formData.zipCode,
          phone: formData.phone,
          isDefault: true,
        } : undefined,
        appliedCoupon ?? undefined
      );
      clearCart();
      toast.success('¡Compra exitosa!');
      navigate('/checkout/exito');
    } catch (e: any) {
      toast.error(e.message || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Datos', icon: User },
    { id: 2, label: 'Envío', icon: Truck },
    { id: 3, label: 'Pago', icon: CreditCard },
  ];

  return (
    <>
      <SEO title="Checkout" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-dark mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                step >= s.id ? 'bg-primary text-white' : 'bg-sand/50 text-dark/40'
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s.id ? 'text-dark font-medium' : 'text-dark/40'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-dark/20 ml-auto" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="rounded-2xl bg-white border border-sand/50 p-6">
                  <h3 className="font-display font-semibold text-dark mb-4">Tus datos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Nombre completo</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Teléfono</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <p className="text-xs text-dark/50 mt-4">
                      ¿Ya tenés cuenta? <a href="/login" className="text-primary hover:underline">Ingresá</a>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setStep(hasPhysical ? 2 : 3)}
                  className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {step === 2 && hasPhysical && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="rounded-2xl bg-white border border-sand/50 p-6">
                  <h3 className="font-display font-semibold text-dark mb-4">Dirección de envío</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-dark/60 mb-1">Calle y número</label>
                      <input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Ciudad</label>
                      <input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Provincia</label>
                      <input
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark/60 mb-1">Código postal</label>
                      <input
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-sand py-3 text-sm font-medium text-dark hover:bg-sand/30 transition-colors">
                    Atrás
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors">
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="rounded-2xl bg-white border border-sand/50 p-6">
                  <h3 className="font-display font-semibold text-dark mb-4">Método de pago</h3>
                  <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <span className="text-primary font-bold text-xs">MP</span>
                    </div>
                    <div>
                      <p className="font-medium text-dark">Mercado Pago</p>
                      <p className="text-xs text-dark/60">Tarjetas, efectivo, transferencia</p>
                    </div>
                  </div>
                  {/* TODO: integrar SDK Mercado Pago */}
                  <p className="text-xs text-dark/40 mt-3">La integración con Mercado Pago se realizará en el backend.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(hasPhysical ? 2 : 1)} className="flex-1 rounded-2xl border border-sand py-3 text-sm font-medium text-dark hover:bg-sand/30 transition-colors">
                    Atrás
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </div>
                    ) : (
                      `Pagar ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand/50 shadow-soft p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Tu orden</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark truncate">{item.name}</p>
                      <p className="text-xs text-dark/50">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-dark/40" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Código de cupón"
                  className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-sand/50 px-3 py-2 text-sm font-medium text-dark hover:bg-sand transition-colors"
                >
                  Aplicar
                </button>
              </div>

              <div className="space-y-2 text-sm pt-4 border-t border-sand/50">
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
                {couponDiscountLocal > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Descuento</span>
                    <span>-{formatPrice(couponDiscountLocal)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-dark pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
