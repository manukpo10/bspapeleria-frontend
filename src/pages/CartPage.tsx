import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { useCartStore } from '../store/cartStore';
import { cn, formatPrice } from '../lib/utils';
import { toast } from 'sonner';

const stepperButton =
  'grid size-11 place-items-center rounded-full text-dark transition-colors hover:bg-mist';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, couponCode, couponDiscount, removeCoupon } = useCartStore();

  const crumbs = [{ label: 'Inicio', to: '/' }, { label: 'Carrito' }];

  if (items.length === 0) {
    return (
      <>
        <SEO title="Carrito" />
        <PageHeader title="Carrito" crumbs={crumbs} />
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="grid size-24 place-items-center rounded-full bg-mist text-iris">
            <ShoppingCart className="size-10" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-dark">Tu carrito está vacío</h2>
          <p className="mt-3 max-w-md text-dark/75">Agregá productos o cursos para comenzar.</p>
          <Link to="/productos" className="btn btn-primary btn-lg mt-8">
            Ver productos <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </>
    );
  }

  const hasPhysical = items.some((i) => !i.isDigital);
  const shipping = hasPhysical ? 1500 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + shipping - couponDiscount;
  const itemCount = getItemCount();

  return (
    <>
      <SEO title="Carrito" />
      <PageHeader
        title="Carrito"
        crumbs={crumbs}
        description={`${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <section aria-labelledby="cart-items-title">
            <h2 id="cart-items-title" className="sr-only">Productos en tu carrito</h2>
            <ul className="card divide-y divide-sand/60 overflow-hidden">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                    loading="lazy"
                    className="size-24 shrink-0 rounded-2xl bg-sand/40 object-cover sm:size-28"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold leading-snug text-dark">{item.name}</h3>
                        <span className={cn('chip mt-2', item.isDigital ? 'bg-mist text-iris' : 'bg-sand/40 text-dark/75')}>
                          {item.isDigital ? 'Digital' : 'Físico'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { removeItem(item.id); toast.info('Producto eliminado'); }}
                        aria-label={`Eliminar ${item.name} del carrito`}
                        className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-dark/65 transition-colors hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4">
                      <div role="group" aria-label={`Cantidad de ${item.name}`} className="inline-flex items-center rounded-full bg-white p-1 ring-1 ring-sand">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                          className={stepperButton}
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span aria-live="polite" className="w-10 text-center font-display font-semibold tabular-nums text-dark">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Agregar una unidad de ${item.name}`}
                          className={stepperButton}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="ml-auto font-display text-lg font-bold text-dark">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside aria-labelledby="cart-summary-title">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 id="cart-summary-title" className="font-display text-xl font-semibold text-dark">Resumen</h2>
              <dl className="mt-6 space-y-3 text-sm">
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
                {couponDiscount > 0 && (
                  <div className="flex justify-between gap-4 text-iris">
                    <dt>Descuento ({couponCode})</dt>
                    <dd className="font-medium">-{formatPrice(couponDiscount)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 border-t border-sand/60 pt-4 font-display text-lg font-bold text-dark">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn btn-primary btn-lg mt-6 w-full">
                Ir al checkout
              </Link>
              <Link to="/productos" className="btn btn-ghost mt-2 w-full">
                Seguir comprando
              </Link>

              {couponCode && (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="btn btn-sm mt-2 min-h-11 w-full text-rose-700 hover:bg-rose-50"
                >
                  Eliminar cupón
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
