import { Link } from 'react-router-dom'
import { Clock, BookOpen, Users, Calendar, Play } from 'lucide-react'

export default function CourseCard({ curso, variant = 'default' }) {
  const precio = curso.precio ? `$${curso.precio.toLocaleString('es-AR')}` : 'Consultar'
  const tieneDescuento = curso.precioOriginal && curso.precio < curso.precioOriginal

  const badgeClass = {
    'Más popular': 'bg-primary text-white',
    'Nuevo': 'bg-accent text-white',
    'Digital': 'bg-secondary text-white',
    'Próximamente': 'bg-dark text-white',
    'Destacado': 'bg-gradient-to-r from-primary to-secondary text-white',
  }[curso.badge] || 'bg-primary/10 text-primary'

  if (variant === 'featured') {
    return (
      <Link 
        to={`/cursos/${curso.slug}`}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500"
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={curso.imagen} 
            alt={curso.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
          
          {curso.badge && (
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`}>
              {curso.badge}
            </span>
          )}
          
          {!curso.disponible && (
            <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
              <span className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full">
                🚀 Próximamente
              </span>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/80 text-sm flex items-center gap-2">
              <BookOpen size={14} />
              {curso.clases} clases · {curso.duracion}
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-primary text-sm font-semibold uppercase mb-2">
            {curso.categoria}
          </p>
          <h3 className="font-heading text-2xl font-black text-dark mb-3 group-hover:text-primary transition">
            {curso.titulo}
          </h3>
          <p className="text-dark/60 mb-4 line-clamp-2">
            {curso.descripcionCorta}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-black text-primary">
                {precio}
              </span>
              {tieneDescuento && (
                <span className="text-dark/40 line-through">
                  ${curso.precioOriginal.toLocaleString('es-AR')}
                </span>
              )}
            </div>
            <span className="text-primary font-semibold group-hover:underline">
              Ver curso →
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link 
      to={`/cursos/${curso.slug}`}
      className="group relative bg-white rounded-2xl border border-sand/30 overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={curso.imagen} 
          alt={curso.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge */}
        {curso.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`}>
            {curso.badge}
          </span>
        )}
        
        {/* Estado no disponible */}
        {!curso.disponible && (
          <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
            <span className="bg-dark text-white text-xs font-bold px-3 py-1 rounded-full">
              🚀 Próximamente
            </span>
          </div>
        )}
        
        {/* Overlay con play */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-all duration-300">
            <Play size={24} className="text-primary ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
          {curso.categoria}
        </p>
        
        {/* Título */}
        <h3 className="font-heading font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition">
          {curso.titulo}
        </h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{curso.instructor.charAt(0)}</span>
          </div>
          <span className="text-sm text-dark/60">{curso.instructor}</span>
        </div>
        
        {/* Nivel y Modalidad */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-sand/50 text-dark/60 px-2 py-1 rounded capitalize">
            {curso.nivel}
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
            <Calendar size={10} />
            {curso.modalidad}
          </span>
        </div>
        
        {/* Duración y Clases */}
        <div className="flex items-center gap-4 text-xs text-dark/40 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {curso.duracion}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {curso.clases} clases
          </span>
        </div>
        
        {/* Descripción */}
        <p className="text-sm text-dark/50 line-clamp-2 mb-4">
          {curso.descripcionCorta}
        </p>
        
        {/* Precio y CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-sand/30">
          <div className="flex items-center gap-2">
            {curso.disponible ? (
              <>
                <span className="font-heading text-xl font-black text-primary">
                  {precio}
                </span>
                {tieneDescuento && (
                  <span className="text-xs text-dark/40 line-through">
                    ${curso.precioOriginal.toLocaleString('es-AR')}
                  </span>
                )}
              </>
            ) : (
              <span className="font-heading text-lg font-bold text-secondary">
                Consultar
              </span>
            )}
          </div>
          
          {curso.disponible ? (
            <span className="text-sm text-primary font-semibold group-hover:underline">
              Ver curso →
            </span>
          ) : (
            <span className="text-sm text-secondary font-semibold">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}