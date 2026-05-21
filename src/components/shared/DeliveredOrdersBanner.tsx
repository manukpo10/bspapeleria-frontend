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
    <div className="space-y-3 mb-6">
      {Object.entries(byOrder).map(([orderId, orderItems]) => {
        const hasCourses = orderItems.some((i) => i.type === 'course');
        const hasProducts = orderItems.some((i) => i.type === 'product');

        return (
          <div
            key={orderId}
            className="relative rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4 flex items-start gap-4"
          >
            {/* Icono */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-primary" />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-dark text-sm">
                {orderItems.length === 1
                  ? `"${orderItems[0].name}" ya esta disponible`
                  : `Tu pedido #${orderItems[0].orderNumber} esta listo`}
              </p>
              <p className="text-xs text-dark/60 mt-0.5">
                {hasCourses && hasProducts
                  ? 'Tus cursos y productos ya estan disponibles en tu cuenta.'
                  : hasCourses
                  ? 'Tu curso ya esta disponible. Podes empezar a verlo ahora.'
                  : 'Tu producto ya esta listo para retirar o fue entregado.'}
              </p>

              {/* Items */}
              <div className="flex flex-wrap gap-2 mt-3">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 border border-sand/50 shadow-sm">
                    {item.type === 'course'
                      ? <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      : <Package className="w-3.5 h-3.5 text-secondary shrink-0" />
                    }
                    <span className="text-xs text-dark font-medium truncate max-w-[160px]">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 mt-3">
                {hasCourses && (
                  <Link
                    to="/mi-cuenta/mis-cursos"
                    onClick={() => dismiss(orderId)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ver mis cursos
                  </Link>
                )}
                {hasProducts && (
                  <Link
                    to="/mi-cuenta/mis-productos"
                    onClick={() => dismiss(orderId)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-medium text-white hover:bg-secondary/90 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Ver mis productos
                  </Link>
                )}
                <button
                  onClick={() => dismiss(orderId)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sand/50 px-3 py-1.5 text-xs font-medium text-dark/60 hover:text-dark hover:bg-sand/30 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* X arriba a la derecha */}
            <button
              onClick={() => dismiss(orderId)}
              className="shrink-0 p-1 rounded-lg text-dark/30 hover:text-dark/60 hover:bg-white/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      {/* Dismiss all si hay más de una orden */}
      {Object.keys(byOrder).length > 1 && (
        <button
          onClick={dismissAll}
          className="text-xs text-dark/40 hover:text-dark/60 transition-colors"
        >
          Cerrar todas las notificaciones
        </button>
      )}
    </div>
  );
}
