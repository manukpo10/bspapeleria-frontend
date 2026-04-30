import { ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import useCartStore from '../../store/useCartStore'
import Badge from '../ui/Badge'

const categoryGradients = {
  Arte:         'from-primary/20 to-accent/30',
  Papeleria:    'from-accent/20 to-sand/50',
  Manualidades: 'from-secondary/15 to-primary/20',
  Escolar:      'from-cream to-accent/20',
  Oficina:      'from-sand/40 to-primary/15',
}

const categoryEmoji = {
  Arte: '🎨', Papeleria: '📓', Manualidades: '✂️', Escolar: '📐', Oficina: '🖊️',
}

export default function ProductoCard({ producto }) {
  const addItem = useCartStore((s) => s.addItem)
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      referenciaId: producto.id,
      tipoItem: 'PRODUCTO',
      nombre: producto.nombre,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl || producto.imagen,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const gradient = categoryGradients[producto.categoria] || 'from-cream to-sand/30'
  const emoji = categoryEmoji[producto.categoria] || '📦'
  const stockNum = typeof producto.stock === 'number' ? producto.stock : (producto.stock ? 1 : 0)
  const sinStock = stockNum === 0

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-sand/30 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Imagen */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} h-52 flex-shrink-0`}>
        {(producto.imagenUrl || producto.imagen) && !imgError ? (
          <img
            src={producto.imagenUrl || producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-60">{emoji}</span>
          </div>
        )}

        {/* Badges de estado */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {stockNum > 0 && stockNum < 5 && <Badge color="sand">Ultimas {stockNum}</Badge>}
          {sinStock && <Badge color="red">Sin stock</Badge>}
        </div>

        {/* Categoria chip */}
        {producto.categoria && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-dark/70 text-xs font-medium px-2.5 py-1 rounded-full">
              {producto.categoria}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-dark text-sm leading-snug mb-1 line-clamp-2 flex-1">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-dark/40 text-xs leading-relaxed mb-3 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-sand/20">
          <div>
            <span className="text-xl font-bold text-primary font-heading">
              ${Number(producto.precio).toLocaleString('es-AR')}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={sinStock}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
              added
                ? 'bg-success-bg text-success'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {added
              ? <><span>✓</span> <span>Agregado</span></>
              : <><ShoppingCart size={16} /> <span>Agregar</span></>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
