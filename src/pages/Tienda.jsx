import { useState, useMemo } from 'react'
import { SlidersHorizontal, Grid, List, X, Package } from 'lucide-react'
import SearchBar from '../components/productos/SearchBar'
import FiltersSidebar from '../components/productos/FiltersSidebar'
import ProductCard from '../components/productos/ProductoCard'
import { productos, categorias } from '../data/productosData'

export default function Tienda() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vistaGrid, setVistaGrid] = useState(true)
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categorias: [],
    subcategorias: [],
    tipo: null,
    precioMin: 0,
    precioMax: 100000,
    personalizable: null,
  })

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      // Búsqueda
      if (filtros.busqueda) {
        const search = filtros.busqueda.toLowerCase()
        if (!producto.nombre.toLowerCase().includes(search) && 
            !producto.descripcion.toLowerCase().includes(search)) {
          return false
        }
      }

      // Categoría
      if (filtros.categorias.length > 0) {
        if (!filtros.categorias.includes(producto.categoria)) return false
      }

      // Subcategoría
      if (filtros.subcategorias.length > 0) {
        if (!filtros.subcategorias.includes(producto.subcategoria)) return false
      }

      // Tipo
      if (filtros.tipo && producto.tipo !== filtros.tipo) return false

      // Precio
      if (producto.precio !== null) {
        if (producto.precio < filtros.precioMin || producto.precio > filtros.precioMax) return false
      }

      // Personalizable
      if (filtros.personalizable !== null) {
        if (producto.personalizable !== filtros.personalizable) return false
      }

      return true
    })
  }, [filtros])

  // Contador de filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0
    if (filtros.categorias.length > 0) count++
    if (filtros.subcategorias.length > 0) count++
    if (filtros.tipo) count++
    if (filtros.precioMin > 0 || filtros.precioMax < 100000) count++
    if (filtros.personalizable !== null) count++
    return count
  }, [filtros])

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-primary/20 via-cream to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <span className="inline-flex items-center gap-2 bg-white/80 border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              ✨ Tienda Online
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-dark mb-2">
              Nuestros Productos
            </h1>
            <p className="text-dark/60 max-w-xl mx-auto">
              Encontrá todo lo que necesitás para expresar tu creatividad
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Buscador y controles superiores */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <SearchBar busqueda={filtros.busqueda} setBusqueda={(val) => setFiltros({ ...filtros, busqueda: val })} />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botón filtros mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand rounded-xl font-medium text-dark hover:bg-sand/30 transition md:hidden"
            >
              <SlidersHorizontal size={18} />
              Filtros
              {filtrosActivos > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {filtrosActivos}
                </span>
              )}
            </button>

            {/* Vistas */}
            <div className="hidden md:flex items-center gap-1 bg-white rounded-xl p-1 border border-sand/30">
              <button 
                onClick={() => setVistaGrid(true)}
                className={`p-2 rounded-lg transition ${vistaGrid ? 'bg-primary text-white' : 'text-dark/50 hover:text-dark'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setVistaGrid(false)}
                className={`p-2 rounded-lg transition ${!vistaGrid ? 'bg-primary text-white' : 'text-dark/50 hover:text-dark'}`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Resultados */}
            <p className="text-dark/50 text-sm whitespace-nowrap">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-8">
          
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FiltersSidebar 
              filtros={filtros}
              setFiltros={setFiltros}
              categorias={categorias}
              productos={productos}
            />
          </aside>

          {/* Sidebar Mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto">
                <FiltersSidebar 
                  filtros={filtros}
                  setFiltros={setFiltros}
                  categorias={categorias}
                  productos={productos}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Grid de productos */}
          <main className="flex-1">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-sand/30">
                <Package className="mx-auto text-primary/30 mb-4" size={64} />
                <h3 className="font-heading text-xl font-bold text-dark mb-2">
                  No encontramos productos
                </h3>
                <p className="text-dark/40 mb-6">
                  Probá cambiando los filtros o la búsqueda
                </p>
                <button 
                  onClick={() => setFiltros({
                    busqueda: '',
                    categorias: [],
                    subcategorias: [],
                    tipo: null,
                    precioMin: 0,
                    precioMax: 100000,
                    personalizable: null,
                  })}
                  className="text-primary font-medium hover:underline"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <div className={`
                ${vistaGrid 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }
              `}>
                {productosFiltrados.map(producto => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}