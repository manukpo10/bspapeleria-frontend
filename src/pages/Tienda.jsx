import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, Grid, List, X, Package, Loader2 } from 'lucide-react'
import SearchBar from '../components/productos/SearchBar'
import FiltersSidebar from '../components/productos/FiltersSidebar'
import ProductCard from '../components/productos/ProductoCard'
import { getProductos } from '../api/productos'

export default function Tienda() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  const categorias = [
    { id: 'Papeleria', nombre: 'Papeleria' },
    { id: 'Arte', nombre: 'Arte' },
    { id: 'Manualidades', nombre: 'Manualidades' },
    { id: 'Escolar', nombre: 'Escolar' },
    { id: 'Oficina', nombre: 'Oficina' },
    { id: 'Kit Agendas', nombre: 'Kit Agendas' },
    { id: 'Personalizados', nombre: 'Personalizados' },
    { id: 'Sublimables', nombre: 'Sublimables' },
    { id: 'Detalles Fiestas', nombre: 'Detalles Fiestas' },
    { id: 'Carteleria', nombre: 'Carteleria' },
  ]

  useEffect(() => {
    getProductos()
      .then(res => {
        const data = (res.data || []).map(p => ({
          ...p,
          imagen: p.imagen || p.imagenUrl || 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
          disponible: p.disponible !== false,
        }))
        console.log('Productos transformados:', data)
        setProductos(data)
      })
      .catch(err => {
        console.error('Error productos:', err)
        setError('Error al cargar productos')
      })
      .finally(() => setLoading(false))
  }, [])

  const productosFiltrados = useMemo(() => {
    if (!productos || productos.length === 0) return []
    
    return productos.filter(producto => {
      if (filtros.busqueda) {
        const search = filtros.busqueda.toLowerCase()
        if (!(producto.nombre || '').toLowerCase().includes(search) && 
            !(producto.descripcion || '').toLowerCase().includes(search)) {
          return false
        }
      }

      if (filtros.categorias.length > 0 && producto.categoria) {
        const categoriaProducto = producto.categoria.toLowerCase()
        if (!filtros.categorias.some(cat => cat.toLowerCase() === categoriaProducto)) {
          return false
        }
      }

      if (filtros.precioMin > 0 && producto.precio < filtros.precioMin) {
        return false
      }
      if (filtros.precioMax < 100000 && producto.precio > filtros.precioMax) {
        return false
      }

      if (!producto.disponible) {
        return false
      }

      if (filtros.tipo && producto.tipo?.toLowerCase() !== filtros.tipo.toLowerCase()) {
        return false
      }

      if (filtros.personalizable === true && !producto.personalizable) {
        return false
      }
      if (filtros.personalizable === false && producto.personalizable) {
        return false
      }

      return true
    })
  }, [productos, filtros])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="relative py-12 bg-gradient-to-br from-accent/20 via-cream to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-sand text-secondary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <Package size={16} />
            Tienda Online
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-dark mb-4">
            Nuestros Productos
          </h1>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">
            Descubrí nuestra colección de productos personalizados
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-72 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 text-dark/60"
              >
                <X size={20} /> Cerrar filtros
              </button>
            </div>
            <FiltersSidebar
              categorias={categorias}
              filtros={filtros}
              setFiltros={setFiltros}
              productos={productos}
            />
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <SearchBar
                value={filtros.busqueda}
                onChange={(busqueda) => setFiltros({ ...filtros, busqueda })}
              />
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-sand/30 rounded-xl text-dark/60 hover:bg-sand/30 transition"
                >
                  <SlidersHorizontal size={18} />
                  Filtros
                </button>
                
                <div className="flex items-center gap-1 bg-white border border-sand/30 rounded-xl p-1">
                  <button
                    onClick={() => setVistaGrid(true)}
                    className={`p-2 rounded-lg transition ${vistaGrid ? 'bg-primary text-white' : 'text-dark/40 hover:text-dark'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setVistaGrid(false)}
                    className={`p-2 rounded-lg transition ${!vistaGrid ? 'bg-primary text-white' : 'text-dark/40 hover:text-dark'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="text-dark/20 mx-auto mb-4" />
                <p className="text-dark/50">No se encontraron productos</p>
              </div>
            ) : (
              <div className={vistaGrid 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} variant={vistaGrid ? 'grid' : 'list'} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}