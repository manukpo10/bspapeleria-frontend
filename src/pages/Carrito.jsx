import { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, GraduationCap, Package, ArrowRight, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import { crearOrden } from '../api/ordenes'
import Button from '../components/ui/Button'

function QuantitySelector({ cantidad, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        className="w-8 h-8 rounded-lg bg-cream hover:bg-sand text-dark/60 hover:text-dark flex items-center justify-center transition-all duration-200"
        disabled={cantidad <= 1}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-semibold text-dark">{cantidad}</span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 rounded-lg bg-cream hover:bg-sand text-dark/60 hover:text-dark flex items-center justify-center transition-all duration-200"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const isCurso = item.tipoItem === 'CURSO'
  const subtotal = Number(item.precio) * item.cantidad

  return (
    <div className="group bg-white rounded-2xl p-5 border border-sand/40 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex gap-5">
        {/* Imagen */}
        <div className="w-24 h-24 bg-cream rounded-xl flex-shrink-0 overflow-hidden border border-sand/30">
          {item.imagenUrl ? (
            <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              {isCurso ? '🎓' : '📦'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isCurso 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary' 
                    : 'bg-sand/50 text-dark/60'
                }`}>
                  {isCurso ? (
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} />
                      Curso
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Package size={12} />
                      Producto
                    </span>
                  )}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-dark truncate pr-2">{item.nombre}</h3>
            </div>
            
            {/* Eliminar */}
            <button
              onClick={() => onRemove(item.referenciaId, item.tipoItem)}
              className="text-dark/30 hover:text-error p-2 -mr-2 rounded-lg hover:bg-error/10 transition-all"
              aria-label="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex items-end justify-between mt-4">
            {/* Precio y cantidad */}
            <div className="flex items-center gap-4">
              {isCurso ? (
                <span className="text-sm text-dark/40">1 inscripción</span>
              ) : (
                <QuantitySelector
                  cantidad={item.cantidad}
                  onIncrease={() => onUpdateQuantity(item.referenciaId, item.tipoItem, item.cantidad + 1)}
                  onDecrease={() => onUpdateQuantity(item.referenciaId, item.tipoItem, item.cantidad - 1)}
                />
              )}
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-xs text-dark/40 mb-0.5">
                {isCurso ? 'Precio fijo' : `$${Number(item.precio).toLocaleString('es-AR')} c/u`}
              </p>
              <p className="font-heading font-bold text-primary text-lg">
                ${subtotal.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSummary({ items, total, onCheckout, onContinue, onWhatsApp, loading }) {
  const productos = items.filter(i => i.tipoItem === 'PRODUCTO')
  const cursos = items.filter(i => i.tipoItem === 'CURSO')
  const productosCount = productos.reduce((sum, i) => sum + i.cantidad, 0)
  const cursosCount = cursos.length

  return (
    <div className="bg-white rounded-2xl p-6 border border-sand/40 shadow-lg sticky top-24">
      <h3 className="font-heading text-xl font-bold text-dark mb-6">Resumen de compra</h3>
      
      {/* Detalle */}
      <div className="space-y-4 mb-6">
        {productosCount > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-sand/30">
            <span className="text-dark/60 flex items-center gap-2">
              <Package size={16} className="text-dark/40" />
              Productos ({productosCount})
            </span>
            <span className="font-medium text-dark">
              ${productos.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0).toLocaleString('es-AR')}
            </span>
          </div>
        )}
        
        {cursosCount > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-sand/30">
            <span className="text-dark/60 flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" />
              Cursos ({cursosCount})
            </span>
            <span className="font-medium text-dark">
              ${cursos.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0).toLocaleString('es-AR')}
            </span>
          </div>
        )}
      </div>

      {/* Envío simulado */}
      <div className="bg-cream/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-dark/60 text-sm">Envío</span>
          <span className="text-secondary font-medium text-sm">
            {productosCount > 0 ? 'A calcular en checkout' : 'No aplica (solo cursos)'}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t-2 border-dashed border-sand/40 pt-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="font-heading text-lg font-bold text-dark">Total</span>
          <span className="font-heading text-2xl font-black text-primary">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onCheckout}
          loading={loading}
        >
          <span className="flex items-center justify-center gap-2">
            Finalizar compra <ArrowRight size={18} />
          </span>
        </Button>

        <a
          href="https://wa.me/5492215703036"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-500 rounded-xl font-medium text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
        >
          <MessageCircle size={18} />
          Consultar por WhatsApp
        </a>

        <button
          onClick={onContinue}
          className="w-full text-sm text-dark/50 hover:text-primary transition-colors py-2"
        >
          ← Seguir comprando
        </button>
      </div>

      {/* Seguridad */}
      <div className="mt-6 pt-4 border-t border-sand/30 text-center">
        <p className="text-xs text-dark/40 flex items-center justify-center gap-1">
          🔒 Pago 100% seguro | Envíos a todo el país
        </p>
      </div>
    </div>
  )
}

export default function Carrito() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const total = items.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0)
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await crearOrden({
        items: items.map((i) => ({
          referenciaId: i.referenciaId,
          tipoItem: i.tipoItem,
          cantidad: i.cantidad,
        })),
      })
      clearCart()
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la orden')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center px-4">
        <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-dark mb-2">
            ¡Pedido confirmado!
          </h2>
          <p className="text-dark/50 mb-6">
            Tu orden fue creada exitosamente. Te enviamos un email con los detalles.
          </p>
          <p className="text-sm text-dark/40">Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center px-4 py-12">
        <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md">
          <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-primary/40" size={48} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-dark mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-dark/50 mb-8">
            Descubrí nuestros productos y cursos para darle un toque especial a tus proyectos
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/productos">
              <Button size="lg">Ver productos</Button>
            </Link>
            <Link to="/cursos">
              <Button size="lg" variant="outline">Ver cursos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-2">
            Tu carrito
          </h1>
          <p className="text-dark/50">
            {items.length} {items.length === 1 ? 'item' : 'items'} en tu compra
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.tipoItem}-${item.referenciaId}`}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}

            {/* Vaciar carrito */}
            <div className="pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-dark/40 hover:text-error transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <CartSummary
              items={items}
              total={total}
              onCheckout={handleCheckout}
              onContinue={() => navigate('/productos')}
              onWhatsApp={() => window.open('https://wa.me/5492215703036', '_blank')}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}