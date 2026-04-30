import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Users, Download, Award, Lock, Menu, X } from 'lucide-react'
import Button from '../components/ui/Button'
import { getCursoBySlug } from '../data/cursosData'

function VideoPlayer({ titulo, url, completado }) {
  const [playing, setPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [error, setError] = useState(false)
  
  // Videos de prueba gratuitos
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'
  
  return (
    <div className="relative aspect-video bg-dark rounded-xl overflow-hidden">
      {playing || showVideo ? (
        error ? (
          <div className="w-full h-full flex items-center justify-center bg-dark text-white">
            <p>Error al cargar el video</p>
          </div>
        ) : (
          <video 
            className="w-full h-full object-cover"
            controls
            autoPlay
            src={videoUrl}
            onError={() => setError(true)}
          >
            Tu navegador no soporta video.
          </video>
        )
      ) : (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30 cursor-pointer"
          onClick={() => setShowVideo(true)}
        >
          <div className="text-center">
            <button 
              className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition mb-4"
            >
              <Play size={32} className="text-primary ml-1" fill="currentColor" />
            </button>
            <p className="text-white font-medium">Vista previa del curso</p>
            <p className="text-white/60 text-sm">Haz clic para reproducir</p>
          </div>
        </div>
      )}
      
      {completado && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <CheckCircle size={12} />
          Completado
        </div>
      )}
    </div>
  )
}

function SidebarLeccion({ leccion, index, activa, completada, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
        activa ? 'bg-primary/10 border border-primary' : 'hover:bg-sand/30'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        completada ? 'bg-green-500 text-white' : activa ? 'bg-primary text-white' : 'bg-sand text-dark/50'
      }`}>
        {completada ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{index + 1}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${activa ? 'text-primary' : 'text-dark'}`}>
          {leccion}
        </p>
        <p className="text-xs text-dark/40">10 min</p>
      </div>
      {activa && <Play size={14} className="text-primary flex-shrink-0" />}
    </button>
  )
}

export default function CursoAula() {
  const { slug } = useParams()
  const curso = getCursoBySlug(slug)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [leccionActiva, setLeccionActiva] = useState(0)
  const [moduloExpandido, setModuloExpandido] = useState(0)
  
  if (!curso) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-dark mb-4">Curso no encontrado</h2>
          <Link to="/cursos" className="text-primary hover:underline">
            ← Volver a cursos
          </Link>
        </div>
      </div>
    )
  }
  
  // Simular progreso
  const [progreso, setProgreso] = useState(25) // 25% completado
  
  const currentModulo = curso.modulos[moduloExpandido]
  const leccion = currentModulo?.lecciones[leccionActiva]
  
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      
      {/* Header del aula */}
      <header className="bg-white border-b border-sand/30 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-dark/60 hover:text-primary transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="hidden sm:block">
              <p className="text-xs text-dark/40">Curso</p>
              <p className="font-bold text-dark text-sm line-clamp-1">{curso.titulo}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Progreso */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-32 h-2 bg-sand rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-sm text-dark/50">{progreso}%</span>
            </div>
            
            {/* Menú mobile */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-sand/30 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* Sidebar - Contenido del curso */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-sand/30 
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          pt-16 lg:pt-0 overflow-y-auto
        `}>
          <div className="p-4">
            <h2 className="font-heading font-bold text-dark mb-4">Contenido del curso</h2>
            
            <div className="space-y-3">
              {curso.modulos.map((modulo, idx) => (
                <div key={idx}>
                  {/* Header del módulo */}
                  <button
                    onClick={() => setModuloExpandido(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                      moduloExpandido === idx ? 'bg-primary/10 border border-primary' : 'hover:bg-sand/30 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-dark text-sm truncate text-left">
                        {modulo.titulo}
                      </span>
                    </div>
                    <span className="text-xs text-dark/40 ml-2">{modulo.duracion}</span>
                  </button>
                  
                  {/* Lecciones del módulo */}
                  {moduloExpandido === idx && (
                    <div className="ml-2 mt-2 space-y-1">
                      {modulo.lecciones.map((leccion, lecIdx) => (
                        <SidebarLeccion
                          key={lecIdx}
                          leccion={leccion}
                          index={lecIdx}
                          activa={idx === moduloExpandido && leccionActiva === lecIdx}
                          completada={idx < moduloExpandido}
                          onClick={() => {
                            setLeccionActiva(lecIdx)
                            setSidebarOpen(false)
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Certificación */}
            <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Award size={24} className="text-primary" />
                <span className="font-bold text-dark">Certificado</span>
              </div>
              <p className="text-xs text-dark/50">
                Completá el 100% del curso para obtener tu certificado
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Área principal - Video y material */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Video player */}
            <div className="mb-6">
              <VideoPlayer 
                titulo={leccion}
                url={null}
                completado={false}
              />
            </div>

            {/* Info de la lección */}
            <div className="bg-white rounded-2xl p-6 border border-sand/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                    Lección {leccionActiva + 1}
                  </span>
                  <span className="text-xs text-dark/40">
                    Módulo {moduloExpandido + 1}
                  </span>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">
                  Marcar como completada
                </button>
              </div>
              
              <h1 className="font-heading text-2xl font-bold text-dark mb-4">
                {leccion}
              </h1>
              
              <p className="text-dark/60 mb-6">
                En esta lección aprenderás los conceptos fundamentales y técnicas necesarias 
                para dominar este tema. Sigue el video y practica junto con los ejemplos.
              </p>

              {/* Material descargable */}
              <div className="border border-sand/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Download size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark">Material de apoyo</p>
                    <p className="text-xs text-dark/40">PDF descargable · 2.5 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Descargar
                  </Button>
                </div>
              </div>
            </div>

            {/* Navegación */}
            <div className="flex items-center justify-between mt-6">
              <Button 
                variant="outline"
                disabled={leccionActiva === 0 && moduloExpandido === 0}
                onClick={() => {
                  if (leccionActiva > 0) {
                    setLeccionActiva(leccionActiva - 1)
                  } else if (moduloExpandido > 0) {
                    setModuloExpandido(moduloExpandido - 1)
                    setLeccionActiva(curso.modulos[moduloExpandido - 1].lecciones.length - 1)
                  }
                }}
              >
                ← Lección anterior
              </Button>
              
              <Button
                disabled={leccionActiva === currentModulo?.lecciones?.length - 1 && moduloExpandido === curso.modulos.length - 1}
                onClick={() => {
                  if (leccionActiva < currentModulo?.lecciones?.length - 1) {
                    setLeccionActiva(leccionActiva + 1)
                  } else if (moduloExpandido < curso.modulos.length - 1) {
                    setModuloExpandido(moduloExpandido + 1)
                    setLeccionActiva(0)
                  }
                }}
              >
                Siguiente lección →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}