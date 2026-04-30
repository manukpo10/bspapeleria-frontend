import { Link } from 'react-router-dom'
import { Eye, MessageCircle, ShoppingCart, Heart } from 'lucide-react'

export default function ProductCard({ producto }) {
  const tienePrecio = producto.precio !== null

  return (
    <div className="group relative bg-white rounded-2xl border border-sand/30 overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={producto.imagen} 
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge */}
        {producto.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${
            producto.badge === 'Nuevo' ? 'bg-accent text-white' :
            producto.badge === 'Más vendido' ? 'bg-primary text-white' :
            producto.badge === 'Digital' ? 'bg-secondary text-white' :
            producto.badge === 'Consultar' ? 'bg-dark text-white' :
            'bg-primary text-white'
          }`}>
            {producto.badge}
          </span>
        )}

        {/* Badge personalizable */}
        {producto.personalizable && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-full shadow">
            ✨ Personalizable
          </span>
        )}

        {/* Overlay de acciones */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0">
            <Heart size={18} />
          </button>
          <Link 
            to={`/productos/${producto.id}`}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0"
            style={{ transitionDelay: '0.1s' }}
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Categoría */}
        <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
          {producto.categoria}
        </p>
        
        {/* Nombre */}
        <h3 className="font-heading font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition">
          {producto.nombre}
        </h3>

        {/* Descripción corta */}
        <p className="text-sm text-dark/50 line-clamp-2 mb-3">
          {producto.descripcion}
        </p>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          {tienePrecio ? (
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-black text-primary">
                ${producto.precio.toLocaleString('es-AR')}
              </span>
              {producto.precioOriginal && (
                <span className="text-sm text-dark/40 line-through">
                  ${producto.precioOriginal.toLocaleString('es-AR')}
                </span>
              )}
            </div>
          ) : (
            <span className="font-heading text-lg font-bold text-secondary">
              Consultar
            </span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {tienePrecio ? (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-secondary transition shadow-sm shadow-primary/20">
                <ShoppingCart size={16} />
                <span className="text-sm">Agregar</span>
              </button>
              <a 
                href="https://wa.me/549221xxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-sand rounded-xl hover:bg-green-500 hover:text-white hover:border-green-500 transition"
              >
                <MessageCircle size={16} />
              </a>
            </>
          ) : (
            <a 
              href="https://wa.me/549221xxxxxxx?text=Hola!%20Quiero%20consultar%20por%20{producto.nombre}"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl font-medium hover:bg-accent transition shadow-sm shadow-secondary/20"
            >
              <MessageCircle size={16} />
              <span className="text-sm">Consultar por WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}