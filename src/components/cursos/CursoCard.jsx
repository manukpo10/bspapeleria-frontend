import { Clock, Calendar, Monitor, MapPin, Users, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import useCartStore from '../../store/useCartStore'
import Badge from '../ui/Badge'

export default function CursoCard({ curso }) {
  const addItem = useCartStore((s) => s.addItem)
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      referenciaId: curso.id,
      tipoItem: 'CURSO',
      nombre: curso.titulo,
      precio: curso.precio,
      imagenUrl: curso.imagenUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const esOnline = curso.modalidad === 'ONLINE'
  const cuposPocos = curso.cuposDisponibles && curso.cuposDisponibles <= 3
  const sinCupos = curso.cuposDisponibles === 0

  const gradient = esOnline
    ? 'from-primary via-accent to-secondary'
    : 'from-secondary via-primary to-accent'

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-sand/30 hover:border-accent/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Imagen con overlay de gradiente */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        {curso.imagenUrl && !imgError ? (
          <>
            <img
              src={curso.imagenUrl}
              alt={curso.titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent`} />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-6xl opacity-80">📚</span>
          </div>
        )}

        {/* Modalidad badge top */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${esOnline ? 'bg-accent' : 'bg-primary'} shadow-md`}>
            {esOnline ? <Monitor size={11} /> : <MapPin size={11} />}
            {esOnline ? 'Online' : 'Presencial'}
          </span>
        </div>

        {/* Cupos badge */}
        {cuposPocos && !sinCupos && (
          <div className="absolute top-4 right-4">
            <span className="bg-error text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ¡Ultimos {curso.cuposDisponibles} cupos!
            </span>
          </div>
        )}

        {/* Titulo sobre imagen */}
        {curso.imagenUrl && !imgError && (
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-heading font-bold text-white text-lg leading-snug line-clamp-2 drop-shadow-md">
              {curso.titulo}
            </h3>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {(!curso.imagenUrl || imgError) && (
          <h3 className="font-heading font-bold text-dark text-lg mb-2 line-clamp-2">
            {curso.titulo}
          </h3>
        )}

        {curso.descripcion && (
          <p className="text-dark/50 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {curso.descripcion}
          </p>
        )}

        {/* Info del curso */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {curso.duracionHoras && (
            <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2">
              <Clock size={13} className="text-primary flex-shrink-0" />
              <span className="text-dark/60 text-xs font-medium">{curso.duracionHoras}h totales</span>
            </div>
          )}
          {curso.fechaInicio && (
            <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2">
              <Calendar size={13} className="text-primary flex-shrink-0" />
              <span className="text-dark/60 text-xs font-medium">
                {new Date(curso.fechaInicio).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          )}
          {curso.cuposDisponibles != null && (
            <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2 col-span-2">
              <Users size={13} className="text-accent flex-shrink-0" />
              <span className="text-dark/60 text-xs font-medium">{curso.cuposDisponibles} cupos disponibles</span>
            </div>
          )}
        </div>

        {/* Precio + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-sand/20 mt-auto">
          <div>
            <span className="text-xs text-dark/40 block">Precio</span>
            <span className="text-2xl font-bold text-primary font-heading">
              ${Number(curso.precio).toLocaleString('es-AR')}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={sinCupos}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? 'bg-success-bg text-success'
                : sinCupos
                ? 'bg-dark/10 text-dark/40 cursor-not-allowed'
                : 'bg-accent/10 hover:bg-accent text-accent hover:text-white'
            }`}
          >
            {added ? '✓ Agregado' : sinCupos ? 'Sin cupos' : 'Inscribirme'}
          </button>
        </div>
      </div>
    </div>
  )
}
