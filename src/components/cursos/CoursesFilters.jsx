import { useState } from 'react'
import { X, Filter, ChevronDown } from 'lucide-react'

export default function CoursesFilters({ 
  filtros, 
  setFiltros, 
  categorias,
  niveles,
  onClose 
}) {
  const [openSections, setOpenSections] = useState({
    categoria: true,
    nivel: true,
    precio: true,
    estado: true,
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoriaChange = (categoriaId) => {
    const nuevas = filtros.categorias.includes(categoriaId)
      ? filtros.categorias.filter(c => c !== categoriaId)
      : [...filtros.categorias, categoriaId]
    setFiltros({ ...filtros, categorias: nuevas })
  }

  const handleNivelChange = (nivelId) => {
    const nuevas = filtros.niveles.includes(nivelId)
      ? filtros.niveles.filter(n => n !== nivelId)
      : [...filtros.niveles, nivelId]
    setFiltros({ ...filtros, niveles: nuevas })
  }

  const handleEstadoChange = (estado) => {
    setFiltros({ ...filtros, estado })
  }

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      categorias: [],
      niveles: [],
      precioMin: 0,
      precioMax: 50000,
      estado: null,
    })
  }

  const minPrice = 0
  const maxPrice = 50000

  return (
    <div className="bg-white rounded-2xl border border-sand/30 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-dark">Filtros</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-dark/40 hover:text-dark">
            <X size={20} />
          </button>
        )}
      </div>

      <button
        onClick={limpiarFiltros}
        className="w-full text-sm text-dark/50 hover:text-primary transition mb-6 py-2 border border-dashed border-sand rounded-lg hover:border-primary"
      >
        ✨ Limpiar filtros
      </button>

      {/* Categoría */}
      <div className="border-b border-sand/30 pb-4 mb-4">
        <button 
          onClick={() => toggleSection('categoria')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Categoría</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.categoria ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.categoria && (
          <div className="space-y-2 ml-2">
            {categorias.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.categorias.includes(cat.id)}
                  onChange={() => handleCategoriaChange(cat.id)}
                  className="w-4 h-4 rounded border-sand text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-dark/70 group-hover:text-dark transition">
                  {cat.emoji} {cat.nombre}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Nivel */}
      <div className="border-b border-sand/30 pb-4 mb-4">
        <button 
          onClick={() => toggleSection('nivel')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Nivel</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.nivel ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.nivel && (
          <div className="space-y-2 ml-2">
            {niveles.map((nivel) => (
              <label key={nivel.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filtros.niveles.includes(nivel.id)}
                  onChange={() => handleNivelChange(nivel.id)}
                  className="w-4 h-4 rounded border-sand text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-dark/70 group-hover:text-dark transition capitalize">
                  {nivel.nombre}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Precio */}
      <div className="border-b border-sand/30 pb-4 mb-4">
        <button 
          onClick={() => toggleSection('precio')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Precio</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.precio ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.precio && (
          <div className="space-y-3 ml-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: Number(e.target.value) })}
              className="w-full h-2 bg-sand rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center justify-between text-sm text-dark/50">
              <span>${filtros.precioMin.toLocaleString('es-AR')}</span>
              <span>${filtros.precioMax.toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Estado */}
      <div>
        <button 
          onClick={() => toggleSection('estado')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Estado</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.estado ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.estado && (
          <div className="space-y-2 ml-2">
            {[
              { id: 'disponible', label: '✅ Disponibles', count: 5 },
              { id: 'proximamente', label: '⏳ Próximamente', count: 1 },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="estado"
                  checked={filtros.estado === item.id}
                  onChange={() => handleEstadoChange(item.id)}
                  className="w-4 h-4 border-sand text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-dark/70 group-hover:text-dark transition">
                  {item.label} ({item.count})
                </span>
              </label>
            ))}
            {filtros.estado && (
              <button 
                onClick={() => handleEstadoChange(null)}
                className="text-xs text-primary hover:underline"
              >
                Limpiar estado
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}