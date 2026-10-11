import { Link } from 'react-router-dom';
import { X, BookOpen, Package, PartyPopper } from 'lucide-react';
import { useDeliveredNotifications } from '../../hooks/useDeliveredNotifications';

export function DeliveredOrdersBanner() {
  const { items, dismiss, dismissAll } = useDeliveredNotifications();

  if (items.length === 0) return null;

  // Agrupar por orderId para mostrar un banner por orden
  const byOrder = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.orderId]) acc[item.orderId] = [];
    acc[item.orderId].push(item);
    return acc;
  }, {});

  return (
    <section aria-label="Pedidos entregados" className="mb-6 space-y-3">
      {Object.entries(byOrder).map(([orderId, orderItems]) => {
        const hasCourses = orderItems.some((i) => i.type === 'course');
        const hasProducts = orderItems.some((i) => i.type === 'product');
        const title = orderItems.length === 1
          ? `"${orderItems[0].name}" ya está disponible`
          : `Tu pedido #${orderItems[0].orderNumber} está listo`;

        return (
          <article
            key={orderId}
            className="relative flex items-start gap-4 rounded-3xl bg-ribbon p-5 pr-14 shadow-soft sm:p-6 sm:pr-16"
          >
            {/* Icono */}
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/80 text-iris">
              <PartyPopper className="size-6" aria-hidden="true" />
            </span>

            {/* Contenido */}
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold leading-snug text-dark">{title}</h2>
              <p className="mt-1 text-sm text-dark/80">
                {hasCourses && hasProducts
                  ? 'Tus cursos y productos ya están disponibles en tu cuenta.'
                  : hasCourses
                  ? 'Tu curso ya está disponible. Podés empezar a verlo ahora.'
                  : 'Tu producto ya está listo para retirar o fue entregado.'}
              </p>

              {/* Items */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {orderItems.map((item, i) => (
                  <li key={i} className="chip max-w-full bg-white/80 text-dark">
                    {item.type === 'course'
                      ? <BookOpen className="size-3.5 shrink-0 text-iris" aria-hidden="true" />
                      : <Package className="size-3.5 shrink-0 text-iris" aria-hidden="true" />
                    }
                    <span className="truncate">{item.name}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {hasCourses && (
                  <Link
                    to="/mi-cuenta/mis-cursos"
                    onClick={() => dismiss(orderId)}
                    className="btn btn-primary btn-sm min-h-11"
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                    Ver mis cursos
                  </Link>
                )}
                {hasProducts && (
                  <Link
                    to="/mi-cuenta/mis-productos"
                    onClick={() => dismiss(orderId)}
                    className={hasCourses ? 'btn btn-secondary btn-sm min-h-11' : 'btn btn-primary btn-sm min-h-11'}
                  >
                    <Package className="size-4" aria-hidden="true" />
                    Ver mis productos
                  </Link>
                )}
              </div>
            </div>

            {/* X arriba a la derecha */}
            <button
              type="button"
              onClick={() => dismiss(orderId)}
              aria-label={`Cerrar aviso: ${title}`}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-dark/70 transition-colors hover:bg-white/60 hover:text-dark"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </article>
        );
      })}

      {/* Dismiss all si hay más de una orden */}
      {Object.keys(byOrder).length > 1 && (
        <button type="button" onClick={dismissAll} className="btn btn-ghost btn-sm min-h-11">
          Cerrar todas las notificaciones
        </button>
      )}
    </section>
  );
}
