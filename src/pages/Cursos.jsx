import { useState, useMemo } from 'react'
import { SlidersHorizontal, Grid, List, X, GraduationCap } from 'lucide-react'
import CourseCard from '../components/cursos/CourseCard'
import CoursesFilters from '../components/cursos/CoursesFilters'
import SearchBar from '../components/productos/SearchBar'
import { cursos, categorias, niveles } from '../data/cursosData'

export default function Cursos() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vistaGrid, setVistaGrid] = useState(true)
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categorias: [],
    niveles: [],
    precioMin: 0,
    precioMax: 50000,
    estado: null,
  })

  const cursosFiltrados = useMemo(() => {
    return cursos.filter(curso => {
      if (filtros.busqueda) {
        const search = filtros.busqueda.toLowerCase()
        if (!curso.titulo.toLowerCase().includes(search) && 
            !curso.descripcionCorta.toLowerCase().includes(search)) {
          return false
        }
      }

      if (filtros.categorias.length > 0) {
        if (!filtros.categorias.includes(curso.categoria)) return false
      }

      if (filtros.niveles.length > 0) {
        if (!filtros.niveles.includes(curso.nivel)) return false
      }

      if (curso.precio !== null && (curso.precio < filtros.precioMin || curso.precio > filtros.precioMax)) {
        return false
      }

      if (filtros.estado) {
        if (filtros.estado === 'disponible' && !curso.disponible) return false
        if (filtros.estado === 'proximamente' && curso.disponible) return false
      }

      return true
    })
  }, [filtros])

  const filtrosActivos = useMemo(() => {
    let count = 0
    if (filtros.categorias.length > 0) count++
    if (filtros.niveles.length > 0) count++
    if (filtros.precioMin > 0 || filtros.precioMax < 50000) count++
    if (filtros.estado) count++
    return count
  }, [filtros])

  // Featured course (el primero disponible)
  const featuredCourse = cursos.find(c => c.disponible)

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <div className="relative py-12 bg-gradient-to-br from-primary/20 via-cream to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <GraduationCap size={16} />
            Aprende creando
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-dark mb-4">
            Cursos y Talleres
          </h1>
          <p className="text-dark/60 max-w-2xl mx-auto">
            Aprendé técnicas creativas de la mano de profes apasionadas. 
            Cursos online y presenciales para todos los niveles.
          </p>
        </div>
      </div>

      {/* Featured Course */}
      {featuredCourse && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
          <h2 className="text-sm font-bold text-dark/50 uppercase tracking-wider mb-4 ml-2">
            ✨ Curso destacado
          </h2>
          <CourseCard curso={featuredCourse} variant="featured" />
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Buscador y controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <SearchBar 
              busqueda={filtros.busqueda} 
              setBusqueda={(val) => setFiltros({ ...filtros, busqueda: val })} 
            />
          </div>
          
          <div className="flex items-center gap-4">
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

            <p className="text-dark/50 text-sm whitespace-nowrap">
              {cursosFiltrados.length} curso{cursosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <CoursesFilters 
              filtros={filtros}
              setFiltros={setFiltros}
              categorias={categorias}
              niveles={niveles}
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
                <CoursesFilters 
                  filtros={filtros}
                  setFiltros={setFiltros}
                  categorias={categorias}
                  niveles={niveles}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Grid de cursos */}
          <main className="flex-1">
            {cursosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-sand/30">
                <GraduationCap className="mx-auto text-primary/30 mb-4" size={64} />
                <h3 className="font-heading text-xl font-bold text-dark mb-2">
                  No encontramos cursos
                </h3>
                <p className="text-dark/40 mb-6">
                  Probá cambiando los filtros o la búsqueda
                </p>
                <button 
                  onClick={() => setFiltros({
                    busqueda: '',
                    categorias: [],
                    niveles: [],
                    precioMin: 0,
                    precioMax: 50000,
                    estado: null,
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
                {cursosFiltrados.map(curso => (
                  <CourseCard key={curso.id} curso={curso} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}