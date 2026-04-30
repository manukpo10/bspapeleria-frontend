import { useState } from 'react'
import { X, Filter, ChevronDown } from 'lucide-react'

export default function FiltersSidebar({ 
  filtros, 
  setFiltros, 
  categorias,
  productos,
  onClose 
}) {
  const [openSections, setOpenSections] = useState({
    categoria: true,
    tipo: true,
    precio: true,
    personalizable: true,
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const cats = filtros.categorias || []
  const subs = filtros.subcategorias || []

  const getSubcategorias = (categoriaId) => {
    const cat = categorias.find(c => c.id === categoriaId)
    return cat?.subcategorias || []
  }

  const handleCategoriaChange = (categoriaId) => {
    const cats = filtros.categorias || []
    const nuevas = cats.includes(categoriaId)
      ? cats.filter(c => c !== categoriaId)
      : [...cats, categoriaId]
    setFiltros({ ...filtros, categorias: nuevas, subcategorias: [] })
  }

  const handleSubcategoriaChange = (subcategoria) => {
    const subs = filtros.subcategorias || []
    const nuevas = subs.includes(subcategoria)
      ? subs.filter(s => s !== subcategoria)
      : [...subs, subcategoria]
    setFiltros({ ...filtros, subcategorias: nuevas })
  }

  const handleTipoChange = (tipo) => {
    setFiltros({ ...filtros, tipo: filtros.tipo === tipo ? null : tipo })
  }

  const handlePersonalizableChange = (valor) => {
    setFiltros({ ...filtros, personalizable: valor })
  }

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      categorias: [],
      subcategorias: [],
      tipo: null,
      precioMin: 0,
      precioMax: 100000,
      personalizable: null,
    })
  }

  const productosList = productos || []
  const minPrice = productosList.filter(p => p.precio).reduce((min, p) => p.precio < min ? p.precio : min, 0)
  const maxPrice = productosList.reduce((max, p) => p.precio > max ? p.precio : max, 0)

  return (
    <div className="bg-white rounded-2xl border border-sand/30 p-6 sticky top-24">
      {/* Header */}
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

      {/* Botón limpiar */}
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
              <div key={cat.id}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={cats.includes(cat.id)}
                    onChange={() => handleCategoriaChange(cat.id)}
                    className="w-4 h-4 rounded border-sand text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-dark/70 group-hover:text-dark transition">
                    {cat.emoji} {cat.nombre}
                  </span>
                </label>
                
                {/* Subcategorías */}
                {cats.includes(cat.id) && getSubcategorias(cat.id).length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {getSubcategorias(cat.id).map((sub) => (
                      <label key={sub} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={subs.includes(sub)}
                          onChange={() => handleSubcategoriaChange(sub)}
                          className="w-3.5 h-3.5 rounded border-sand text-primary focus:ring-primary/20"
                        />
                        <span className="text-xs text-dark/50">{sub}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tipo */}
      <div className="border-b border-sand/30 pb-4 mb-4">
        <button 
          onClick={() => toggleSection('tipo')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Tipo</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.tipo ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.tipo && (
          <div className="space-y-2 ml-2">
            {['fisico', 'digital'].map((tipo) => (
              <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  checked={filtros.tipo === tipo}
                  onChange={() => handleTipoChange(tipo)}
                  className="w-4 h-4 border-sand text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-dark/70 capitalize">
                  {tipo === 'fisico' ? '📦 Físico' : '📥 Digital'}
                </span>
              </label>
            ))}
            {filtros.tipo && (
              <button 
                onClick={() => handleTipoChange(null)}
                className="text-xs text-primary hover:underline"
              >
                Limpiar tipo
              </button>
            )}
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
            <div className="flex items-center gap-2 text-sm text-dark/60">
              <span>${filtros.precioMin.toLocaleString('es-AR')}</span>
              <span className="flex-1 border-b border-dashed border-sand"></span>
              <span>${filtros.precioMax.toLocaleString('es-AR')}</span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: Number(e.target.value) })}
              className="w-full h-2 bg-sand rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filtros.precioMin || ''}
                onChange={(e) => setFiltros({ ...filtros, precioMin: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-sand rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max"
                value={filtros.precioMax === maxPrice ? '' : filtros.precioMax}
                onChange={(e) => setFiltros({ ...filtros, precioMax: Number(e.target.value) || maxPrice })}
                className="w-full px-3 py-2 text-sm border border-sand rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Personalizable */}
      <div>
        <button 
          onClick={() => toggleSection('personalizable')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-dark">Personalizable</span>
          <ChevronDown size={16} className={`text-dark/40 transition ${openSections.personalizable ? 'rotate-180' : ''}`} />
        </button>
        
        {openSections.personalizable && (
          <div className="space-y-2 ml-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="personalizable"
                checked={filtros.personalizable === true}
                onChange={() => handlePersonalizableChange(true)}
                className="w-4 h-4 border-sand text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-dark/70">✨ Solo personalizables</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="personalizable"
                checked={filtros.personalizable === false}
                onChange={() => handlePersonalizableChange(false)}
                className="w-4 h-4 border-sand text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-dark/70">🚫 Solo estándar</span>
            </label>
            {filtros.personalizable !== null && (
              <button 
                onClick={() => handlePersonalizableChange(null)}
                className="text-xs text-primary hover:underline"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}