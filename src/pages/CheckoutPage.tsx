import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CreditCard, Loader2, ShoppingCart, Truck, User, Tag } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { cn, formatPrice } from '../lib/utils';
import { toast } from 'sonner';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  className?: string;
}

function TextField({ id, label, value, onChange, type = 'text', autoComplete, className }: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={type === 'tel' ? 'tel' : undefined}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
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
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="grid size-24 place-items-center rounded-full bg-mist text-iris">
          <ShoppingCart className="size-10" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-dark">Tu carrito está vacío</h1>
        <p className="mt-3 max-w-md text-dark/75">No podés hacer checkout sin productos.</p>
        <Link to="/productos" className="btn btn-primary btn-lg mt-8">
          Ver productos <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
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
    } catch (e) {
      toast.error((e as { message?: string }).message || 'Error al procesar la compra');
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
      <PageHeader
        title="Checkout"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Carrito', to: '/carrito' }, { label: 'Checkout' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
          <div>
            {/* Progress */}
            <ol aria-label="Pasos del checkout" className="mb-8 flex items-center">
              {steps.map((s, i) => {
                const done = step > s.id;
                const current = step === s.id;
                const isLast = i === steps.length - 1;
                return (
                  <li key={s.id} aria-current={current ? 'step' : undefined} className={cn('flex items-center', !isLast && 'flex-1')}>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors',
                          current && 'bg-dark text-white shadow-soft',
                          done && 'bg-secondary/30 text-dark',
                          !current && !done && 'bg-white text-dark/65 ring-1 ring-sand',
                        )}
                      >
                        {done ? <Check className="size-5" aria-hidden="true" /> : s.id}
                      </span>
                      <span className={cn('text-sm font-medium', current ? 'text-dark' : 'text-dark/65 max-sm:sr-only')}>
                        {s.label}
                        {done && <span className="sr-only"> (completado)</span>}
                      </span>
                    </div>
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className={cn('mx-3 h-0.5 flex-1 rounded-full sm:mx-4', done ? 'bg-secondary/60' : 'bg-sand')}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            {step === 1 && (
              <div className="animate-fade-in">
                <section className="card p-6 sm:p-8" aria-labelledby="step-data-title">
                  <h2 id="step-data-title" className="font-display text-xl font-semibold text-dark">Tus datos</h2>
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField
                      id="checkout-name"
                      label="Nombre completo"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(v) => setFormData({ ...formData, name: v })}
                    />
                    <TextField
                      id="checkout-email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(v) => setFormData({ ...formData, email: v })}
                    />
                    <TextField
                      id="checkout-phone"
                      label="Teléfono"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(v) => setFormData({ ...formData, phone: v })}
                    />
                  </div>
                  {!isAuthenticated && (
                    <p className="mt-6 text-sm text-dark/75">
                      ¿Ya tenés cuenta?{' '}
                      <Link to="/login" className="font-medium text-iris underline-offset-4 hover:underline">Ingresá</Link>
                    </p>
                  )}
                </section>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(hasPhysical ? 2 : 3)}
                    className="btn btn-primary btn-lg w-full"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 2 && hasPhysical && (
              <div className="animate-fade-in">
                <section className="card p-6 sm:p-8" aria-labelledby="step-shipping-title">
                  <h2 id="step-shipping-title" className="font-display text-xl font-semibold text-dark">Dirección de envío</h2>
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField
                      id="checkout-street"
                      label="Calle y número"
                      autoComplete="street-address"
                      className="sm:col-span-2"
                      value={formData.street}
                      onChange={(v) => setFormData({ ...formData, street: v })}
                    />
                    <TextField
                      id="checkout-city"
                      label="Ciudad"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(v) => setFormData({ ...formData, city: v })}
                    />
                    <TextField
                      id="checkout-province"
                      label="Provincia"
                      autoComplete="address-level1"
                      value={formData.province}
                      onChange={(v) => setFormData({ ...formData, province: v })}
                    />
                    <TextField
                      id="checkout-zip"
                      label="Código postal"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(v) => setFormData({ ...formData, zipCode: v })}
                    />
                  </div>
                </section>
                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-ghost btn-lg">
                    Atrás
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn btn-primary btn-lg flex-1">
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <section className="card p-6 sm:p-8" aria-labelledby="step-payment-title">
                  <h2 id="step-payment-title" className="font-display text-xl font-semibold text-dark">Método de pago</h2>
                  <div className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-iris bg-mist p-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white shadow-soft">
                      <span className="font-display text-sm font-bold text-iris">MP</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-dark">Mercado Pago</p>
                      <p className="text-xs text-dark/65">Tarjetas, efectivo, transferencia</p>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-dark text-white">
                      <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      <span className="sr-only">Seleccionado</span>
                    </span>
                  </div>
                  {/* TODO: integrar SDK Mercado Pago */}
                  <p className="mt-4 text-xs text-dark/65">La integración con Mercado Pago se realizará en el backend.</p>
                </section>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setStep(hasPhysical ? 2 : 1)} className="btn btn-ghost btn-lg">
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    aria-busy={loading}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Procesando...
                      </>
                    ) : (
                      `Pagar ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside aria-labelledby="order-summary-title">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 id="order-summary-title" className="font-display text-xl font-semibold text-dark">Tu orden</h2>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      className="size-14 shrink-0 rounded-xl bg-sand/40 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dark">{item.name}</p>
                      <p className="text-xs text-dark/65">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-dark">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-sand/60 pt-6">
                <label htmlFor="checkout-coupon" className="mb-1.5 block text-sm font-medium text-dark">
                  Cupón de descuento
                </label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Tag className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-dark/55" aria-hidden="true" />
                    <input
                      id="checkout-coupon"
                      name="coupon"
                      autoComplete="off"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Código de cupón"
                      className="field pl-10"
                    />
                  </div>
                  <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary shrink-0">
                    Aplicar
                  </button>
                </div>
              </div>

              <dl className="mt-6 space-y-3 border-t border-sand/60 pt-6 text-sm">
                <div className="flex justify-between gap-4 text-dark/75">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-dark">{formatPrice(subtotal)}</dd>
                </div>
                {hasPhysical && (
                  <div className="flex justify-between gap-4 text-dark/75">
                    <dt>Envío</dt>
                    <dd className="font-medium text-dark">{formatPrice(shipping)}</dd>
                  </div>
                )}
                {couponDiscountLocal > 0 && (
                  <div className="flex justify-between gap-4 text-iris">
                    <dt>Descuento</dt>
                    <dd className="font-medium">-{formatPrice(couponDiscountLocal)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 border-t border-sand/60 pt-4 font-display text-lg font-bold text-dark">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
